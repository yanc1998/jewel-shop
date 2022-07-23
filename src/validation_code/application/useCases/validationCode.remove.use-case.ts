import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {ValidationCode} from "../../domain/entities/validation_code.entity";
import {ValidateCodeRepository} from "../../infra/repositories/validateCode.repository";

export type RemoveFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<ValidationCode>
        | AppError.ValidationErrorResult<ValidationCode>
        | AppError.ObjectNotExistResult<ValidationCode>,
        Result<ValidationCode>>;

@Injectable()
export class RemoveValidationCodeUseCase implements IUseCase<{ id: string }, Promise<RemoveFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: ValidateCodeRepository) {
        this._logger = new Logger('RemoveFileUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveFileUseCaseResponse> {
        const file = Optional(await this.fileRepository.findById(request.id));

        if (file.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`File with id ${request.id} doesn't exist`)));

        try {
            await this.fileRepository.drop(file.unwrap());
            return right(Result.Ok(file.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
