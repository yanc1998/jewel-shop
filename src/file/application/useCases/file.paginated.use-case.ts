import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {PageParams} from '../../../shared/core/PaginatorParams';
import {File} from "../../domain/entities/file.entity";
import {FilePaginatedDto} from "../dtos/file.paginated.dto";
import {FileRepository} from "../../infra/repositories/file.repository";

export type PaginatedFileUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<File>>
    | AppError.ValidationErrorResult<PaginatedFindResult<File>>,
    Result<PaginatedFindResult<File>>>;

@Injectable()
export class PaginatedFileUseCase implements IUseCase<FilePaginatedDto, Promise<PaginatedFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: FileRepository) {
        this._logger = new Logger('PaginatedFileUseCase');
    }

    async execute(request: FilePaginatedDto): Promise<PaginatedFileUseCaseResponse> {
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
