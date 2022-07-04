import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';

import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';

import Optional from '../../../shared/core/Option';
import {Subcategory} from "../../domain/entities/subcategory.entity";
import {SubcategoryUpdateDto} from "../dtos/subcategory.update.dto";
import {SubcategoryRepository} from "../../infra/repositories/subcategory.repository";

export type UpdateSubcategoryUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Subcategory>
        | AppError.ValidationErrorResult<Subcategory>
        | AppError.ObjectNotExistResult<Subcategory>,
        Result<Subcategory>>;

@Injectable()
export class UpdateTeacherUseCase implements IUseCase<SubcategoryUpdateDto, Promise<UpdateSubcategoryUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly subcategoryRepository: SubcategoryRepository) {
        this._logger = new Logger('UpdateTeacherUseCase');
    }

    async execute(request: SubcategoryUpdateDto): Promise<UpdateSubcategoryUseCaseResponse> {
        this._logger.log('Executing');

        const toUpdate = Optional(await this.subcategoryRepository.findById(request.subcategoryId));
        if (toUpdate.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Teacher with id ${request.subcategoryId} doesn't exist`)));

        let forUpdate: Subcategory = toUpdate.unwrap();
        forUpdate.Update(request);

        try {
            await this.subcategoryRepository.save(forUpdate);
            return right(Result.Ok(forUpdate));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
