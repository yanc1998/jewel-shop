import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Product} from "../../domain/entities/product.entity";
import {ProductRepository} from "../../infra/repositories/product.repository";

export type RemoveProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class RemoveProductUseCase implements IUseCase<{ id: string }, Promise<RemoveProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository) {
        this._logger = new Logger('RemoveProductUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveProductUseCaseResponse> {
        const product = Optional(await this.productRepository.findById(request.id));

        if (product.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Product with id ${request.id} doesn't exist`)));

        try {
            await this.productRepository.drop(product.unwrap());
            return right(Result.Ok(product.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
