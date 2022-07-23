import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {ValidationCodeCreateDto} from '../dtos/validationCode.create.dto';
import {ValidationCode} from "../../domain/entities/validation_code.entity";
import {ValidateCodeRepository} from "../../infra/repositories/validateCode.repository";


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
        const code = await this.generateCode()
        const fileOrError: Result<ValidationCode> = ValidationCode.New({...request, code: code});

        if (fileOrError.isFailure)
            return left(fileOrError);

        const file: ValidationCode = fileOrError.unwrap();

        try {
            await this.validateCodeRepository.save(file);

            return right(Result.Ok(file));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }

    async generateCode(): Promise<string> {
        return 'ABCDE'
    }
}
