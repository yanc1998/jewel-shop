import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Category} from "../../domain/entities/category.entity";
import {CategoryRepository} from "../../infra/repositories/category.repository";

export type RemoveCategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Category>
        | AppError.ValidationErrorResult<Category>
        | AppError.ObjectNotExistResult<Category>,
        Result<Category>>;

@Injectable()
export class RemoveCategoryUseCase implements IUseCase<{ id: string }, Promise<RemoveCategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly categoryRepository: CategoryRepository) {
        this._logger = new Logger('RemoveCategoryUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveCategoryUseCaseResponse> {
        const category = Optional(await this.categoryRepository.findById(request.id));

        if (category.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Category with id ${request.id} doesn't exist`)));

        try {
            await this.categoryRepository.drop(category.unwrap());
            return right(Result.Ok(category.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
