import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Category} from "../../domain/entities/category.entity";
import {CategoryUpdateDto} from "../dtos/category.update.dto";
import {CategoryRepository} from "../../infra/repositories/category.repository";

export type UpdateCategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Category>
        | AppError.ValidationErrorResult<Category>
        | AppError.ObjectNotExistResult<Category>,
        Result<Category>>;

@Injectable()
export class UpdateTeacherUseCase implements IUseCase<CategoryUpdateDto, Promise<UpdateCategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly categoryRepository: CategoryRepository) {
        this._logger = new Logger('UpdateTeacherUseCase');
    }

    async execute(request: CategoryUpdateDto): Promise<UpdateCategoryUseCaseResponse> {
        this._logger.log('Executing');

        const toUpdate = Optional(await this.categoryRepository.findById(request.categoryId));
        if (toUpdate.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Category with id ${request.categoryId} doesn't exist`)));

        let forUpdate: Category = toUpdate.unwrap();
        forUpdate.Update(request);

        try {
            await this.categoryRepository.save(forUpdate);
            return right(Result.Ok(forUpdate));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
