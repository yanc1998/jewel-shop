import { Connection, QueryRunner, EntityManager } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { IUnitOfWork } from 'src/shared/core/interfaces/IUnitOfWork';
import { OrmName } from '../types/orm-name.enum';
import {
  IRepository,
  IRepositoryFactory,
} from 'src/shared/core/interfaces/IRepository';

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

  async commit<T>(work: () => Promise<T> | T): Promise<T> {
    try {
      const result = await work();
      await this.queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }
}
