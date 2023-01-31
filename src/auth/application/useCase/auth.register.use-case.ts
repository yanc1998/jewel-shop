import {Either, left, right} from 'src/shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {Injectable, Logger} from '@nestjs/common';
import {User} from 'src/user/domain/entities/user.entity';
import {RegisterDto} from '../dtos/register.dto';
import {CreateUserUseCase} from 'src/user/application/useCases/user.create.use-case';
import {SendEmailUseCase} from 'src/email/application/useCases/email.send.use-case';
import {Roles} from 'src/shared/domain/enum.permits';
import {UserStatus} from 'src/user/domain/enums/user.status';
import {AppConfigService} from 'src/shared/modules/config/service/app-config-service';
import {
    CreateValidationCodeUseCase,
    FindByUserIdValidationCodeUseCase
} from "../../../validation_code/application/useCases";
import stringRandom from "string-random";
import {FindByEmailUserUseCase} from "../../../user/application/useCases/user.findByEmail.use-case";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";


export type RegisterUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<User>
        | AppError.ValidationErrorResult<User>
        | AppError.ObjectNotExistResult<User>,
        Result<User>>;

@Injectable()
export class RegisterUseCase implements IUseCase<RegisterDto, Promise<RegisterUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork,
                private readonly createValidationCodeUseCase: CreateValidationCodeUseCase,
                private readonly configService: AppConfigService,
                private readonly createUserUseCase: CreateUserUseCase,
                private readonly sendEmailUseCase: SendEmailUseCase,
                private readonly findUser: FindByEmailUserUseCase,
                private readonly findValidationCode: FindByUserIdValidationCodeUseCase) {
        this._logger = new Logger('RegisterUseCase');
    }

    async _execute(request: RegisterDto): Promise<RegisterUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            //si existe el usuario pero sin confirmar, retornar el codigo de conformacion
            const exist = await this.findUser.execute({email: request.email})
            if (exist.isRight() && exist.value.unwrap()) {
                const user = exist.value.unwrap()
                if (user.status == UserStatus.Pending) {
                    const codeOrError = await this.findValidationCode.execute({id: user._id.toString()})
                    if (codeOrError.isLeft()) {
                        const error = codeOrError.value.unwrapError()
                        return left(Result.Fail(new AppError.ValidationError(error.message)))
                    }

                    const code = codeOrError.value.unwrap()
                    const emailOrError = await this.sendEmailUseCase.execute({
                        to: user.email,
                        body: {data: "", message: `write this code for validate register ${code}`}
                    })
                    if (emailOrError.isLeft()) {
                        const error = emailOrError.value.unwrapError()
                        console.log(error)
                        return left(Result.Fail(new AppError.ValidationError(error.message)));
                    }

                }
            }

            //caso de registro normal

            const userOrError = await this.createUserUseCase.execute({
                ...request,
                roles: [Roles.Client],
                status: UserStatus.Pending
            })

            if (userOrError.isLeft()) {
                const error = userOrError.value.unwrapError()
                return left(Result.Fail(new AppError.ValidationError(error.message)));
            }

            const user = userOrError.value.unwrap()
            const code = await this.generateCode()
            const validationCodeOrError = await this.createValidationCodeUseCase.execute({
                userId: user._id.toString(),
                code: code
            })
            if (validationCodeOrError.isLeft()) {
                const error = validationCodeOrError.value.unwrapError()
                return left(Result.Fail(new AppError.ValidationError(error.message)))
            }
            //ver si es mejor no esperar por la promesa
            const emailOrError = await this.sendEmailUseCase.execute({
                to: user.email,
                body: {data: "", message: `write this code for validate register ${code}`}
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

    async execute(request: RegisterDto): Promise<RegisterUseCaseResponse> {
        await this.typeOrmUnitOfWork.start()

        const user: RegisterUseCaseResponse = await this.typeOrmUnitOfWork.commit(async () => {
            return await this._execute(request);
        })
        return user
    }

    private async generateCode(): Promise<string> {
        const code = stringRandom(6)
        return code
    }
}
