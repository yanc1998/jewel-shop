import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Subcategory} from "../../domain/entities/subcategory.entity";
import {SubcategoryRepository} from "../../infra/repositories/subcategory.repository";

export type RemoveSubcategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Subcategory>
        | AppError.ValidationErrorResult<Subcategory>
        | AppError.ObjectNotExistResult<Subcategory>,
        Result<Subcategory>>;

@Injectable()
export class RemoveSubcategoryManyUseCase implements IUseCase<{ filter: {} }, Promise<RemoveSubcategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly subcategoryRepository: SubcategoryRepository) {
        this._logger = new Logger('RemoveSubcategoryUseCase');
    }

    async execute(request: { filter: {} }): Promise<RemoveSubcategoryUseCaseResponse> {
        try {
            await this.subcategoryRepository.deleteMany(request.filter);
            return right(Result.Ok());
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
