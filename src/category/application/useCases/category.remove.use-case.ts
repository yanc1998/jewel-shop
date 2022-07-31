import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Category} from "../../domain/entities/category.entity";
import {CategoryRepository} from "../../infra/repositories/category.repository";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";
import {RemoveSubcategoryUseCase} from "../../../subcategory/application/useCases";
import {RemoveSubcategoryManyUseCase} from "../../../subcategory/application/useCases/subcategory.remove-many.use-case";

export type RemoveCategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Category>
        | AppError.ValidationErrorResult<Category>
        | AppError.ObjectNotExistResult<Category>,
        Result<Category>>;

@Injectable()
export class RemoveCategoryUseCase implements IUseCase<{ id: string }, Promise<RemoveCategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork,
                private readonly categoryRepository: CategoryRepository,
                private readonly subcategoryRemove: RemoveSubcategoryManyUseCase) {
        this._logger = new Logger('RemoveCategoryUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveCategoryUseCaseResponse> {
        await this.typeOrmUnitOfWork.start()

        const category = await this.typeOrmUnitOfWork.commit(async () => {
            return await this._remove(request);
        })

        return category
    }

    private async _remove(request): Promise<RemoveCategoryUseCaseResponse> {
        const category = Optional(await this.categoryRepository.findById(request.id));

        if (category.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Category with id ${request.id} doesn't exist`)));

        const removeOrError = await this.subcategoryRemove.execute({filter: {categoryId: request.id}})
        if (removeOrError.isLeft()) {
            const error = removeOrError.value.unwrapError()
            return left(Result.Fail(new AppError.ValidationError(error.message)));
        }
        //poner que revise que la categoria no tenga ninguna subcategoria asociado
        try {
            await this.categoryRepository.drop(category.unwrap());
            return right(Result.Ok(category.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
