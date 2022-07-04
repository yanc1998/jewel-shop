import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Product} from "../../domain/entities/product.entity";
import {ProductRepository} from "../../infra/repositories/product.repository";

export type FindByIdProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class FindByIdProductUseCase implements IUseCase<{ id: string }, Promise<FindByIdProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository) {
        this._logger = new Logger('FindByIdProductUseCase');
    }

    async execute(request: {
        id: string
    }): Promise<FindByIdProductUseCaseResponse> {
        try {
            return Optional(await this.productRepository.findById(request.id))
                .okOr(new AppError.ObjectNotExist(`Product with id ${request.id} doesn't exist`))
                .mapOrElse(
                    //if error
                    (err: AppError.ObjectNotExist) =>
                        left(Result.Fail(err)),
                    //if ok
                    (product: Product) =>
                        right(Result.Ok(product)),
                );

        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
