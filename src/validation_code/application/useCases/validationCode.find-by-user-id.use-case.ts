import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {ValidationCode} from "../../domain/entities/validation_code.entity";
import {ValidateCodeRepository} from "../../infra/repositories/validateCode.repository";

export type FindByIdFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<ValidationCode>
        | AppError.ValidationErrorResult<ValidationCode>
        | AppError.ObjectNotExistResult<ValidationCode>,
        Result<ValidationCode>>;

@Injectable()
export class FindByUserIdValidationCodeUseCase implements IUseCase<{ id: string }, Promise<FindByIdFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly validateCodeRepository: ValidateCodeRepository) {
        this._logger = new Logger('FindByUserIdValidateCodeUseCase');
    }

    async execute(request: {
        id: string
    }): Promise<FindByIdFileUseCaseResponse> {
        try {
            return Optional(await this.validateCodeRepository.findOne({userId: request.id}))
                .okOr(new AppError.ObjectNotExist(`Validate with userId ${request.id} doesn't exist`))
                .mapOrElse(
                    //if error
                    (err: AppError.ObjectNotExist) =>
                        left(Result.Fail(err)),
                    //if ok
                    (file: ValidationCode) =>
                        right(Result.Ok(file)),
                );

        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
