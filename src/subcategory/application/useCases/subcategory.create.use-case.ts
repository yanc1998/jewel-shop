import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {SubcategoryCreateDto} from '../dtos/subcategory.create.dto';
import {Subcategory} from "../../domain/entities/subcategory.entity";
import {SubcategoryRepository} from "../../infra/repositories/subcategory.repository";


export type CreateSubcategoryUseCaseResponse = Either<AppError.UnexpectedErrorResult<Subcategory>
    | AppError.ValidationErrorResult<Subcategory>,
    Result<Subcategory>>;

@Injectable()
export class CreateSubcategoryUseCase implements IUseCase<SubcategoryCreateDto, Promise<CreateSubcategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly subcategoryRepository: SubcategoryRepository,
    ) {
        this._logger = new Logger('CreateSubcategoryUseCase');
    }

    async execute(request: SubcategoryCreateDto): Promise<CreateSubcategoryUseCaseResponse> {
        this._logger.log('Executing...');

        const teacherOrError: Result<Subcategory> = Subcategory.New({...request});

        if (teacherOrError.isFailure)
            return left(teacherOrError);

        const subcategory: Subcategory = teacherOrError.unwrap();

        try {
            await this.subcategoryRepository.save(subcategory);

            return right(Result.Ok(subcategory));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
