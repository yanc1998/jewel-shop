import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {FileCreateDto} from '../dtos/file.create.dto';
import {File} from "../../domain/entities/file.entity";
import {FileRepository} from "../../infra/repositories/file.repository";


export type CreateFileUseCaseResponse = Either<AppError.UnexpectedErrorResult<File>
    | AppError.ValidationErrorResult<File>,
    Result<File>>;

@Injectable()
export class CreateFileUseCase implements IUseCase<FileCreateDto, Promise<CreateFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly fileRepository: FileRepository,
    ) {
        this._logger = new Logger('CreateFileUseCase');
    }

    async execute(request: FileCreateDto): Promise<CreateFileUseCaseResponse> {
        this._logger.log('Executing...');

        const fileOrError: Result<File> = File.New({...request});

        if (fileOrError.isFailure)
            return left(fileOrError);

        const file: File = fileOrError.unwrap();

        try {
            await this.fileRepository.save(file);

            return right(Result.Ok(file));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
