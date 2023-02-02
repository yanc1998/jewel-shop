import {Either, left, right} from 'src/shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {Injectable, Logger} from '@nestjs/common';
import {User} from 'src/user/domain/entities/user.entity';
import {UserCreateDto} from '../dtos/user.create.dto';
import {UserRepository} from 'src/user/infra/repositories/user.repository';
import {UserStatus} from "../../domain/enums/user.status";
import {Roles} from "../../../shared/domain/enum.permits";

export type CreateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

@Injectable()
export class CreateUserUseCase implements IUseCase<UserCreateDto, Promise<CreateUserUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly userRepository: UserRepository) {
        this._logger = new Logger('CreateUserUseCase');
    }

    async onModuleInit() {
        const exist = await this.userRepository.findOne({filter: {$and: {email: 'yancarloglez98@gamil.com'}}})
        if (!exist) {
            const userAdmin: UserCreateDto = {
                username: "YanCarlos",
                password: "12345678ABC",
                email: "yancarloglez98@gamil.com",
                status: UserStatus.Register,
                roles: [Roles.Admin]
            }
            console.log(userAdmin)
            await this.execute(userAdmin)
        }
    }

    async execute(request: UserCreateDto): Promise<CreateUserUseCaseResponse> {
        this._logger.log('Executing...');


        const userDomainOrError: Result<User> = User.New({
            username: request.username,
            password: request.password,
            roles: request.roles,
            email: request.email,
            status: request.status
        });


        if (userDomainOrError.isFailure)
            return left(userDomainOrError);

        const user: User = userDomainOrError.unwrap();
        user.setPasswordHash(request.password)


        const existUser = await this.userRepository.findOne({filter: {$and: {email: user.email}}})
        if (existUser)
            return left(Result.Fail(new AppError.ValidationError('user exist')));

        try {
            await this.userRepository.save(user);
            return right(Result.Ok(user));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
