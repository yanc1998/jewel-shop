import {Either, left, right} from 'src/shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {Injectable, Logger} from '@nestjs/common';
import {User} from 'src/user/domain/entities/user.entity';
import {RegisterDto} from '../dtos/register.dto';
import {CreateUserUseCase} from 'src/user/application/useCases/user.create.use-case';
import {SendEmailUseCase} from 'src/email/application/useCases/email.send.use-case';
import {EnumPermits, Roles} from 'src/shared/domain/enum.permits';
import {UserStatus} from 'src/user/domain/enums/user.status';
import {AppConfigService} from 'src/shared/modules/config/service/app-config-service';
import {CreateValidationCodeUseCase} from "../../../validation_code/application/useCases";


export type RegisterUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

@Injectable()
export class RegisterUseCase implements IUseCase<RegisterDto, Promise<RegisterUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly createValidationCodeUseCase: CreateValidationCodeUseCase, private readonly confifService: AppConfigService, private readonly createUserUseCase: CreateUserUseCase, private readonly sendEmailUseCase: SendEmailUseCase) {
        this._logger = new Logger('RegisterUseCase');
    }

    async execute(request: RegisterDto): Promise<RegisterUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            const userOrError = await this.createUserUseCase.execute({
                ...request,
                roles: [Roles.Admin],
                status: UserStatus.Pending
            })

            if (userOrError.isLeft()) {
                const error = userOrError.value.unwrapError()
                return left(Result.Fail(new AppError.ValidationError(error.message)));
            }

            const user = userOrError.value.unwrap()

            const validationCodeOrError = await this.createValidationCodeUseCase.execute({
                userId: user._id.toString()
            })
            if (validationCodeOrError.isLeft()) {
                const error = validationCodeOrError.value.unwrapError()
                return left(Result.Fail(new AppError.ValidationError(error.message)))
            }
            const validationCode = validationCodeOrError.value.unwrap()
            //por ahora asi, despues hasheo el id para que no haya problemas con seguridad
            const emailOrError = await this.sendEmailUseCase.execute({
                to: user.email,
                body: {data: "", message: `write this code for validate register ${validationCode.code}`}
            })
            if (emailOrError.isLeft()) {
                const error = emailOrError.value.unwrapError()
                console.log(error)
                return left(Result.Fail(new AppError.ValidationError(error.message)));
            }
            return right(Result.Ok(user));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
