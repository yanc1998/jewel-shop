import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Product} from "../../domain/entities/product.entity";
import {ProductRepository} from "../../infra/repositories/product.repository";
import {RemoveFileUseCase} from "../../../file/application/useCases";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";

export type RemoveProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class RemoveProductUseCase implements IUseCase<{ id: string }, Promise<RemoveProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository,
                private readonly removeFileUseCase: RemoveFileUseCase,
                private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork,) {
        this._logger = new Logger('RemoveProductUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveProductUseCaseResponse> {
        await this.typeOrmUnitOfWork.start()

        const product: RemoveProductUseCaseResponse = await this.typeOrmUnitOfWork.commit(async () => {
            return await this._execute(request);
        })

        return product
    }

    async _execute(request: { id: string }): Promise<RemoveProductUseCaseResponse> {
        const productOptional = Optional(await this.productRepository.findById(request.id));

        if (productOptional.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Product with id ${request.id} doesn't exist`)));

        try {
            const product = productOptional.unwrap()
            await this.productRepository.drop(product);
            await this.removeFileUseCase.execute({id: product.fileId})
            return right(Result.Ok(product));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
