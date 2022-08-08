import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {PageParams} from '../../../shared/core/PaginatorParams';
import {Product} from "../../domain/entities/product.entity";
import {ProductPaginatedDto} from "../dtos/product.paginated.dto";
import {ProductRepository} from "../../infra/repositories/product.repository";

export type PaginatedProductUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<Product>>
    | AppError.ValidationErrorResult<PaginatedFindResult<Product>>,
    Result<PaginatedFindResult<Product>>>;

@Injectable()
export class PaginatedProductUseCase implements IUseCase<ProductPaginatedDto, Promise<PaginatedProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository) {
        this._logger = new Logger('PaginatedProductUseCase');
    }

    async execute(request: ProductPaginatedDto): Promise<PaginatedProductUseCaseResponse> {
        this._logger.log('Executing..');

        try {
            return (
                await PageParams.create(
                    request.pageParams,
                ).mapAsync(async (pageParams: PageParams) =>
                    this.productRepository.getPaginated(
                        pageParams,
                        request.filter,
                    ),
                )
            ).mapOrElse(
                // Err case
                err => left(Result.Fail(err)),
                // Ok case
                result => right(Result.Ok(result)),
            );
        } catch (err) {
            return left(Result.Fail(new AppError.UnexpectedError(err)));
        }
    }
}
