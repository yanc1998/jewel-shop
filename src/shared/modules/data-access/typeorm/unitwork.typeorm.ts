import {Connection, QueryRunner, EntityManager} from 'typeorm';
import {Injectable, Inject} from '@nestjs/common';
import {IUnitOfWork} from 'src/shared/core/interfaces/IUnitOfWork';
import {OrmName} from '../types/orm-name.enum';
import {
    IRepository,
    IRepositoryFactory,
} from 'src/shared/core/interfaces/IRepository';
import {Either, left} from "../../../core/Either";
import {AppError} from "../../../core/errors/AppError";
import {Category} from "../../../../category/domain/entities/category.entity";
import {Result} from "../../../core/Result";

export type TypeResponse =
    Either<AppError.UnexpectedErrorResult<any>
        | AppError.ValidationErrorResult<any>
        | AppError.ObjectNotExistResult<any>,
        Result<any>>;

@Injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
    private readonly asyncDatabaseConnection: Connection;
    private readonly queryRunner: QueryRunner;
    private dbContext: EntityManager;

    constructor(
        @Inject('TYPEORM_CONNECTION') asyncDatabaseConnection: Connection,
    ) {
        this.asyncDatabaseConnection = asyncDatabaseConnection;
        this.queryRunner = this.asyncDatabaseConnection.createQueryRunner();
    }

    getOrmName(): string {
        return OrmName.TYPE_ORM;
    }

    getRepository<E, T extends IRepository<E>>(F: IRepositoryFactory<E, T>): T {
        switch (true) {
            case F.getOrmName() !== this.getOrmName():
                throw new Error(
                    `ORM type ${this.getOrmName()} is not compatible with ${F.getOrmName()}`,
                );
            case !this.dbContext:
                throw new Error('Transaction must be started');
            case this.queryRunner.isReleased:
                throw new Error('QueryRunner has been released');
            default:
                return F.build(this.dbContext);
        }
    }

    async start(): Promise<void> {
        await this.queryRunner.startTransaction();
        this.dbContext = this.queryRunner.manager;
    }

    async commit(work: () => Promise<any>): Promise<any> {
        try {
            const result = await work() as any;
            if (result.isLeft()) {
                const error = result.value.unwrapError()
                await this.queryRunner.rollbackTransaction();
                return left(Result.Fail(new AppError.ValidationError(error.message)))
            }
            await this.queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await this.queryRunner.rollbackTransaction();
            return left(Result.Fail(new AppError.UnexpectedError(error)))
        } finally {
            await this.queryRunner.release();
        }
    }
}
