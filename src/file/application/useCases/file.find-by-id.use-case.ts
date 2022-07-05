import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {File} from "../../domain/entities/file.entity";
import {FileRepository} from "../../infra/repositories/file.repository";

export type FindByIdFileUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<File>
        | AppError.ValidationErrorResult<File>
        | AppError.ObjectNotExistResult<File>,
        Result<File>>;

@Injectable()
export class FindByIdFileUseCase implements IUseCase<{ id: string }, Promise<FindByIdFileUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly fileRepository: FileRepository) {
        this._logger = new Logger('FindByIdFileUseCase');
    }

    async execute(request: {
        id: string
    }): Promise<FindByIdFileUseCaseResponse> {
        try {
            return Optional(await this.fileRepository.findById(request.id))
                .okOr(new AppError.ObjectNotExist(`File with id ${request.id} doesn't exist`))
                .mapOrElse(
                    //if error
                    (err: AppError.ObjectNotExist) =>
                        left(Result.Fail(err)),
                    //if ok
                    (file: File) =>
                        right(Result.Ok(file)),
                );

        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
