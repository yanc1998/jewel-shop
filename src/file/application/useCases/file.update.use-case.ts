import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {File} from "../../domain/entities/file.entity";
import {FileUpdateDto} from "../dtos/file.update.dto";
import {FileRepository} from "../../infra/repositories/file.repository";
import {AppConfigService} from "../../../shared/modules/config/service/app-config-service";

export type UpdateFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<File>
        | AppError.ValidationErrorResult<File>
        | AppError.ObjectNotExistResult<File>,
        Result<File>>;

@Injectable()
export class UpdateFileUseCase implements IUseCase<FileUpdateDto, Promise<UpdateFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: FileRepository,
                private readonly configService: AppConfigService) {
        this._logger = new Logger('UpdateTeacherUseCase');
    }

    async execute(request: FileUpdateDto): Promise<UpdateFileUseCaseResponse> {
        this._logger.log('Executing');


        try {

            const toUpdate = Optional(await this.fileRepository.findById(request.fileId));
            if (toUpdate.isNone())
                return left(Result.Fail(new AppError.ObjectNotExist(`File with id ${request.fileId} doesn't exist`)));

            let forUpdate: File = toUpdate.unwrap();
            const updatedOrError: Result<File> = await forUpdate.Update({
                file: request.file,
                fileDir: this.configService.app.fileDir
            })

            if (updatedOrError.isFailure) {
                return left(Result.Fail(updatedOrError.unwrapError()))
            }
            await this.fileRepository.save(updatedOrError.unwrap());
            return right(Result.Ok(updatedOrError.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
