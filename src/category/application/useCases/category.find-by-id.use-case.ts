import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';

import Optional from '../../../shared/core/Option';
import {Category} from "../../domain/entities/category.entity";
import {CategoryRepository} from "../../infra/repositories/category.repository";

export type FindByIdCategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Category>
        | AppError.ValidationErrorResult<Category>
        | AppError.ObjectNotExistResult<Category>,
        Result<Category>>;

@Injectable()
export class FindByIdCategoryUseCase implements IUseCase<{ id: string }, Promise<FindByIdCategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly categoryRepository: CategoryRepository) {
        this._logger = new Logger('FindByIdTeacherUseCase');
    }

    async execute(request: {
        id: string
    }): Promise<FindByIdCategoryUseCaseResponse> {
        try {
            return Optional(await this.categoryRepository.findById(request.id))
                .okOr(new AppError.ObjectNotExist(`Category with id ${request.id} doesn't exist`))
                .mapOrElse(
                    //if error
                    (err: AppError.ObjectNotExist) =>
                        left(Result.Fail(err)),
                    //if ok
                    (category: Category) =>
                        right(Result.Ok(category)),
                );

        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
