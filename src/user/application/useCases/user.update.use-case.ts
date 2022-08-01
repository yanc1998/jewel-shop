import {Either, left, right} from 'src/shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {Injectable, Logger, Optional} from '@nestjs/common';
import {User} from 'src/user/domain/entities/user.entity';
import {UserRepository} from 'src/user/infra/repositories/user.repository';
import {UserUpdateDto} from '../dtos/user.update.dto';

export type UpdateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

@Injectable()
export class UpdateUserUseCase implements IUseCase<UserUpdateDto, Promise<UpdateUserUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly userRepository: UserRepository) {
        this._logger = new Logger('CreateUserUseCase');
    }


    async execute(request: UserUpdateDto): Promise<UpdateUserUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            const user = await this.userRepository.findById(request.id)
            if (!user)
                return left(Result.Fail(new AppError.ValidationError('user not found')))
            console.log(request)
            user.Update(request.data)
            const newUserOrError = User.Create(user, user._id.toString())
            if (newUserOrError.isFailure) {
                const error = newUserOrError.unwrapError()
                return left(Result.Fail(error));
            }
            const newUser = newUserOrError.unwrap()
            newUser.setPasswordHash(request.data.password)
            await this.userRepository.update(newUser, user._id.toString());
            return right(Result.Ok(newUser));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
