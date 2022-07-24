import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {ValidationCodeCreateDto} from '../dtos/validationCode.create.dto';
import {ValidationCode} from "../../domain/entities/validation_code.entity";
import {ValidateCodeRepository} from "../../infra/repositories/validateCode.repository";
import stringRandom from 'string-random'
import {hash} from 'bcrypt';

export type CreateValidationCodeUseCaseResponse = Either<AppError.UnexpectedErrorResult<ValidationCode>
    | AppError.ValidationErrorResult<ValidationCode>,
    Result<ValidationCode>>;

@Injectable()
export class CreateValidationCodeUseCase implements IUseCase<ValidationCodeCreateDto, Promise<CreateValidationCodeUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly validateCodeRepository: ValidateCodeRepository,
    ) {
        this._logger = new Logger('CreateFileUseCase');
    }

    async execute(request: ValidationCodeCreateDto): Promise<CreateValidationCodeUseCaseResponse> {
        this._logger.log('Executing...');
        const validationCodeOrError: Result<ValidationCode> = ValidationCode.New({...request});

        if (validationCodeOrError.isFailure)
            return left(validationCodeOrError);

        const validationCode: ValidationCode = validationCodeOrError.unwrap();
        validationCode.setCodeHash(validationCode.code)
        try {
            await this.validateCodeRepository.save(validationCode);

            return right(Result.Ok(validationCode));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }

}
