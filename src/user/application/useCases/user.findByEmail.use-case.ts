import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserRepository } from 'src/user/infra/repositories/user.repository';
import { UserFindByIdDto } from '../dtos/user.findById.dto';
import { UserFindEmailIdDto } from '../dtos/user.findByEmial.dto';

export type FindByEmailUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

@Injectable()
export class FindByEmailUserUseCase implements IUseCase<UserFindEmailIdDto, Promise<FindByEmailUserUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly userRepository: UserRepository) {
        this._logger = new Logger('FindByIdUseCase');
    }

    async execute(request: UserFindEmailIdDto): Promise<FindByEmailUserUseCaseResponse> {
        this._logger.log('Executing...');
        console.log(request,'request')
        try {
            const userDomain = await this.userRepository.findOne({ email: request.email });
            return right(Result.Ok(userDomain));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}