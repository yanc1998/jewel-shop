import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';

import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';

import {PageParams} from '../../../shared/core/PaginatorParams';
import {Subcategory} from "../../domain/entities/subcategory.entity";
import {SubcategoryPaginatedDto} from "../dtos/subcategory.paginated.dto";
import {SubcategoryRepository} from "../../infra/repositories/subcategory.repository";

export type PaginatedSubcategoryUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<Subcategory>>
    | AppError.ValidationErrorResult<PaginatedFindResult<Subcategory>>,
    Result<PaginatedFindResult<Subcategory>>>;

@Injectable()
export class PaginatedTeacherUseCase implements IUseCase<SubcategoryPaginatedDto, Promise<PaginatedSubcategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly subcategoryRepository: SubcategoryRepository) {
        this._logger = new Logger('PaginatedTeacherUseCase');
    }

    async execute(request: SubcategoryPaginatedDto): Promise<PaginatedSubcategoryUseCaseResponse> {
        this._logger.log('Executing..');

        try {
            return (
                await PageParams.create(
                    request.pageParams,
                ).mapAsync(async (pageParams: PageParams) =>
                    this.subcategoryRepository.getPaginated(
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
