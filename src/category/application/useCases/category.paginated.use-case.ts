import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';

import {PageParams} from '../../../shared/core/PaginatorParams';
import {Category} from "../../domain/entities/category.entity";
import {CategoryPaginatedDto} from "../dtos/category.paginated.dto";
import {CategoryRepository} from "../../infra/repositories/category.repository";

export type PaginatedCategoryUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<Category>>
    | AppError.ValidationErrorResult<PaginatedFindResult<Category>>,
    Result<PaginatedFindResult<Category>>>;

@Injectable()
export class PaginatedCategoryUseCase implements IUseCase<CategoryPaginatedDto, Promise<PaginatedCategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly categoryRepository: CategoryRepository) {
        this._logger = new Logger('PaginatedCategoryUseCase');
    }

    async execute(request: CategoryPaginatedDto): Promise<PaginatedCategoryUseCaseResponse> {
        this._logger.log('Executing..');

        try {
            return (
                await PageParams.create(
                    request.pageParams,
                ).mapAsync(async (pageParams: PageParams) =>
                    this.categoryRepository.getPaginated(
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
