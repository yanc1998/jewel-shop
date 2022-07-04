import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {CategoryCreateDto} from '../dtos/category.create.dto';

import {CategoryRepository} from '../../infra/repositories/category.repository';
import {Category} from "../../domain/entities/category.entity";


export type CreateCategoryUseCaseResponse = Either<AppError.UnexpectedErrorResult<Category>
    | AppError.ValidationErrorResult<Category>,
    Result<Category>>;

@Injectable()
export class CreateCategoryUseCase implements IUseCase<CategoryCreateDto, Promise<CreateCategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) {
        this._logger = new Logger('CreateCategoryUseCase');
    }

    async execute(request: CategoryCreateDto): Promise<CreateCategoryUseCaseResponse> {
        this._logger.log('Executing...');

        const categoryOrError: Result<Category> = Category.New({...request});

        if (categoryOrError.isFailure)
            return left(categoryOrError);

        const category: Category = categoryOrError.unwrap();

        try {
            await this.categoryRepository.save(category);


            return right(Result.Ok(category));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
