import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Product} from '../../domain/entities/product.entity';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {ProductRepository} from '../../infra/repositories/product.repository';
import Optional from '../../../shared/core/Option';

export type FindDetailsProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class FindDetailsProductUseCase implements IUseCase<{ id: string }, Promise<FindDetailsProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository) {
        this._logger = new Logger('FindDetailsProductUseCase');
    }

    async execute(request: {
        id: string
    }): Promise<FindDetailsProductUseCaseResponse> {
        try {
            return Optional(await this.productRepository.findById(request.id, ['file']))
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
