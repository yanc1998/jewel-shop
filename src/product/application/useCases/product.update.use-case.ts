import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Product} from "../../domain/entities/product.entity";
import {ProductUpdateDto} from "../dtos/product.update.dto";
import {ProductRepository} from "../../infra/repositories/product.repository";
import {UpdateFileUseCase, UpdateFileUseCaseResponse} from "../../../file/application/useCases";
import {ProductCreateDto} from "../dtos/product.create.dto";
import {CreateProductUseCaseResponse} from "./product.create.use-case";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";

export type UpdateProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class UpdateProductUseCase implements IUseCase<ProductUpdateDto, Promise<UpdateProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository,
                private readonly updateFileUseCase: UpdateFileUseCase,
                private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork) {
        this._logger = new Logger('UpdateTeacherUseCase');
    }

    async execute(request: ProductUpdateDto): Promise<UpdateProductUseCaseResponse> {
        await this.typeOrmUnitOfWork.start()

        const product: UpdateProductUseCaseResponse = await this.typeOrmUnitOfWork.commit(async () => {
            return await this._execute(request);
        })

        return product
    }

    async _execute(request: ProductUpdateDto): Promise<UpdateProductUseCaseResponse> {


        try {
            this._logger.log('Executing');

            const toUpdate = Optional(await this.productRepository.findById(request.productId));
            if (toUpdate.isNone())
                return left(Result.Fail(new AppError.ObjectNotExist(`Product with id ${request.productId} doesn't exist`)));

            let forUpdate: Product = toUpdate.unwrap();
            if (request.file) {
                const updatedFileOrError: UpdateFileUseCaseResponse = await this.updateFileUseCase.execute({
                    file: request.file,
                    fileId: forUpdate.fileId
                })
                if (updatedFileOrError.isLeft()) {
                    return left(Result.Fail(new AppError.ValidationError(updatedFileOrError.value.unwrapError().message)))
                }
            }
            const updatedOrError: Result<Product> = forUpdate.Update({
                name: request.name,
                count: request.count,
                description: request.description,
                price: request.price
            });

            if (updatedOrError.isFailure) {
                return left(Result.Fail(updatedOrError.unwrapError()))
            }
            await this.productRepository.save(updatedOrError.unwrap());
            return right(Result.Ok(updatedOrError.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
