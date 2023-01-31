import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {FileCreateDto} from '../dtos/file.create.dto';
import {File} from "../../domain/entities/file.entity";
import {FileRepository} from "../../infra/repositories/file.repository";
import Jimp from 'jimp/es';
import {v4} from 'uuid'
import {AppConfigService} from "../../../shared/modules/config/service/app-config-service";
import {resizeFile} from "../utils/resize-file";

export type CreateFileUseCaseResponse = Either<AppError.UnexpectedErrorResult<File>
    | AppError.ValidationErrorResult<File>,
    Result<File>>;

@Injectable()
export class CreateFileUseCase implements IUseCase<FileCreateDto, Promise<CreateFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly fileRepository: FileRepository,
        private readonly configService: AppConfigService
    ) {
        this._logger = new Logger('CreateFileUseCase');
    }

    async execute(request: FileCreateDto): Promise<CreateFileUseCaseResponse> {
        this._logger.log('Executing...');


        try {

            const fileOrError: Result<File> = await File.New({
                file: request.file,
                fileDir: this.configService.app.fileDir
            });

            if (fileOrError.isFailure)
                return left(fileOrError);

            const file: File = fileOrError.unwrap();
            await this.fileRepository.save(file);

            return right(Result.Ok(file));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
