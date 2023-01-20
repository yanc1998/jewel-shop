import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {ValidationCode} from "../../domain/entities/validation_code.entity";
import {ValidationCodeUpdateDto} from "../dtos/validationCode.update.dto";
import {ValidateCodeRepository} from "../../infra/repositories/validateCode.repository";

export type UpdateFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<ValidationCode>
        | AppError.ValidationErrorResult<ValidationCode>
        | AppError.ObjectNotExistResult<ValidationCode>,
        Result<ValidationCode>>;

@Injectable()
export class UpdateValidationCodeUseCase implements IUseCase<ValidationCodeUpdateDto, Promise<UpdateFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: ValidateCodeRepository) {
        this._logger = new Logger('UpdateValidationCodeUseCase');
    }

    async execute(request: ValidationCodeUpdateDto): Promise<UpdateFileUseCaseResponse> {
        this._logger.log('Executing');

        const toUpdate = Optional(await this.fileRepository.findOne({filter: {userId: request.userId}}));
        if (toUpdate.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`ValidationCode with userId ${request.userId} doesn't exist`)));

        let forUpdate: ValidationCode = toUpdate.unwrap();
        forUpdate.Update(request);

        try {
            await this.fileRepository.save(forUpdate);
            return right(Result.Ok(forUpdate));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
