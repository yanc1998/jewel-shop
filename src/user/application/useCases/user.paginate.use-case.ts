import {Either, left, right} from 'src/shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {Injectable, Logger} from '@nestjs/common';
import {PageParams} from 'src/shared/core/PaginatorParams';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {User} from "../../domain/entities/user.entity";
import {UserPaginatedDto} from "../dtos/user.paginated.dto";
import {UserRepository} from "../../infra/repositories/user.repository";
import {UserMapper} from "../../infra/mappers/user.mappers";

export type PaginatedUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<User>>
    | AppError.ValidationErrorResult<PaginatedFindResult<User>>,
    Result<PaginatedFindResult<User>>>;

@Injectable()
export class PaginatedUserUseCase implements IUseCase<UserPaginatedDto, Promise<PaginatedUserUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly userRepository: UserRepository) {
        this._logger = new Logger('PaginatedUserUseCase');
    }

    async execute(request: UserPaginatedDto): Promise<PaginatedUserUseCaseResponse> {
        this._logger.log('Executing..');

        try {
            return (
                await PageParams.create(
                    request.pageParams,
                ).mapAsync(async (pageParams: PageParams) =>
                    this.userRepository.getPaginated(
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
