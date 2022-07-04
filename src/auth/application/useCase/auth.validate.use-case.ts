import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import { UserRepository } from 'src/user/infra/repositories/user.repository';
import { ValidateDto } from '../dtos/validate.dto';
import { compareSync } from 'bcrypt';
import { UserStatus } from 'src/user/domain/enums/user.status';

export type ValidateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

@Injectable()
export class ValidateUserUseCase implements IUseCase<ValidateDto, Promise<ValidateUserUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly userRepository: UserRepository) {
        this._logger = new Logger('FindByIdUseCase');
    }

    async execute(request: ValidateDto): Promise<ValidateUserUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            const userDomain = await this.userRepository.findOne({
                email: request.email,
            });
            if (!userDomain) {
                return left(Result.Fail(new AppError.ValidationError('invalid email')));
            }
            if (userDomain.status == UserStatus.Pending) {
                return left(Result.Fail(new AppError.ValidationError('user not register')));
            }
            if (!compareSync(request.password, userDomain.password)) {
                return left(Result.Fail(new AppError.ValidationError('invalid password')));
            }
            return right(Result.Ok(userDomain));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}