import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Subcategory} from "../../domain/entities/subcategory.entity";
import {SubcategoryRepository} from "../../infra/repositories/subcategory.repository";

export type FindByIdSubcategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Subcategory>
        | AppError.ValidationErrorResult<Subcategory>
        | AppError.ObjectNotExistResult<Subcategory>,
        Result<Subcategory>>;

@Injectable()
export class FindByIdSubcategoryUseCase implements IUseCase<{ id: string }, Promise<FindByIdSubcategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly subcategoryRepository: SubcategoryRepository) {
        this._logger = new Logger('FindByIdSubcategoryUseCase');
    }

    async execute(request: {
        id: string
    }): Promise<FindByIdSubcategoryUseCaseResponse> {
        try {
            return Optional(await this.subcategoryRepository.findById(request.id))
                .okOr(new AppError.ObjectNotExist(`Subcategory with id ${request.id} doesn't exist`))
                .mapOrElse(
                    //if error
                    (err: AppError.ObjectNotExist) =>
                        left(Result.Fail(err)),
                    //if ok
                    (subcategory: Subcategory) =>
                        right(Result.Ok(subcategory)),
                );

        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
