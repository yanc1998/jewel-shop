import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {File} from "../../domain/entities/file.entity";
import {FileRepository} from "../../infra/repositories/file.repository";
import {removeFile} from "../utils/remove-file";
import {AppConfigService} from "../../../shared/modules/config/service/app-config-service";

export type RemoveFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<File>
        | AppError.ValidationErrorResult<File>
        | AppError.ObjectNotExistResult<File>,
        Result<File>>;

@Injectable()
export class RemoveFileUseCase implements IUseCase<{ id: string }, Promise<RemoveFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: FileRepository,
                private readonly configService: AppConfigService) {
        this._logger = new Logger('RemoveFileUseCase');
    }

    async execute(request: { id: string }): Promise<RemoveFileUseCaseResponse> {
        try {
            const file = Optional(await this.fileRepository.findById(request.id));

            if (file.isNone())
                return left(Result.Fail(new AppError.ObjectNotExist(`File with id ${request.id} doesn't exist`)));

            removeFile(file.unwrap().url, this.configService.app.fileDir)
            await this.fileRepository.drop(file.unwrap());
            return right(Result.Ok(file.unwrap()));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
