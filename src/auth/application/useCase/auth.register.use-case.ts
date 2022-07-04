import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';
import { CreateUserUseCase } from 'src/user/application/useCases/user.create.use-case';
import { SendEmailUseCase } from 'src/email/application/useCases/email.send.use-case';
import { EnumPermits } from 'src/shared/domain/enum.permits';
import { UserStatus } from 'src/user/domain/enums/user.status';
import { AppConfigService } from 'src/shared/modules/config/service/app-config-service';


export type RegisterUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

@Injectable()
export class RegisterUseCase implements IUseCase<RegisterDto, Promise<RegisterUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly confifService: AppConfigService, private readonly createUserUseCase: CreateUserUseCase, private readonly sendEmailUseCase: SendEmailUseCase) {
        this._logger = new Logger('FindByIdUseCase');
    }

    async execute(request: RegisterDto): Promise<RegisterUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            console.log('beofr')
            const userOrError = await this.createUserUseCase.execute({ ...request, roles: [EnumPermits.RegularAction], status: UserStatus.Pending })
            console.log(userOrError,'userOreror')
            if (userOrError.isLeft()) {
                console.log('entro')
                const error = userOrError.value.unwrapError()
                return left(Result.Fail(new AppError.ValidationError(error.message)));
            }
            console.log('1')
            const user = userOrError.value.unwrap()
            console.log(user,2)
            //por ahora asi, despues hasheo el id para que no haya problemas con seguridad 
            const linkToConfirmRegister = this.confifService.app.hostFront + `/:${user._id.toString()}`
            const emailOrError = await this.sendEmailUseCase.execute({ to: user.email, body: { data: "", message: `Pres the link to confirm register ${linkToConfirmRegister}` } })
            console.log(emailOrError,3)
            if (emailOrError.isLeft()) {
                const error = emailOrError.value.unwrapError()
                return left(Result.Fail(new AppError.UnexpectedError(error)));
            }
            return right(Result.Ok(user));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}