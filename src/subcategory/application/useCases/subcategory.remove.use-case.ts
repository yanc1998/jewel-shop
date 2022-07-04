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
export class RemoveSubcategoryUseCase implements IUseCase<{ id: string }, Promise<RemoveSubcategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly subcategoryRepository: SubcategoryRepository) {
        this._logger = new Logger('RemoveSubcategoryUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveSubcategoryUseCaseResponse> {
        const subcategory = Optional(await this.subcategoryRepository.findById(request.id));

        if (subcategory.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Subcategory with id ${request.id} doesn't exist`)));

        try {
            await this.subcategoryRepository.drop(subcategory.unwrap());
            return right(Result.Ok(subcategory.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
