import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {File} from "../../domain/entities/file.entity";
import {FileUpdateDto} from "../dtos/file.update.dto";
import {FileRepository} from "../../infra/repositories/file.repository";

export type UpdateFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<File>
        | AppError.ValidationErrorResult<File>
        | AppError.ObjectNotExistResult<File>,
        Result<File>>;

@Injectable()
export class UpdateFileUseCase implements IUseCase<FileUpdateDto, Promise<UpdateFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: FileRepository) {
        this._logger = new Logger('UpdateTeacherUseCase');
    }

    async execute(request: FileUpdateDto): Promise<UpdateFileUseCaseResponse> {
        this._logger.log('Executing');

        const toUpdate = Optional(await this.fileRepository.findById(request.fileId));
        if (toUpdate.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`File with id ${request.fileId} doesn't exist`)));

        let forUpdate: File = toUpdate.unwrap();
        forUpdate.Update(request);

        try {
            await this.fileRepository.save(forUpdate);
            return right(Result.Ok(forUpdate));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
