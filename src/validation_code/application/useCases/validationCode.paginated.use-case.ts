import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {PageParams} from '../../../shared/core/PaginatorParams';
import {ValidationCode} from "../../domain/entities/validation_code.entity";
import {ValidationCodePaginatedDto} from "../dtos/validationCode.paginated.dto";
import {ValidateCodeRepository} from "../../infra/repositories/validateCode.repository";

export type PaginatedFileUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<ValidationCode>>
    | AppError.ValidationErrorResult<PaginatedFindResult<ValidationCode>>,
    Result<PaginatedFindResult<ValidationCode>>>;

@Injectable()
export class PaginatedValidationCodeUseCase implements IUseCase<ValidationCodePaginatedDto, Promise<PaginatedFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: ValidateCodeRepository) {
        this._logger = new Logger('PaginatedFileUseCase');
    }

    async execute(request: ValidationCodePaginatedDto): Promise<PaginatedFileUseCaseResponse> {
        this._logger.log('Executing..');

        try {
            return (
                await PageParams.create(
                    request.pageParams,
                ).mapAsync(async (pageParams: PageParams) =>
                    this.fileRepository.getPaginated(
                        pageParams,
                        request.filter,
                    ),
                )
            ).mapOrElse(
                // Err case
                err => left(Result.Fail(err)),
                // Ok case
                result => right(Result.Ok(result)),
            );
        } catch (err) {
            return left(Result.Fail(new AppError.UnexpectedError(err)));
        }
    }
}
