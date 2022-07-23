import {Either, left, right} from 'src/shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {Injectable, Logger} from '@nestjs/common';
import {User} from 'src/user/domain/entities/user.entity';
import {UserStatus} from 'src/user/domain/enums/user.status';
import {AppConfigService} from 'src/shared/modules/config/service/app-config-service';
import {UpdateUserUseCase} from 'src/user/application/useCases/user.update.use-case';
import {ConfirmRegisterDto} from '../dtos/confirm.register.dto';
import {FindByUserIdValidationCodeUseCase} from "../../../validation_code/application/useCases";


export type ConfirmRegisterUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
    | AppError.ValidationErrorResult<User>,
    Result<User>>;

export type ConfirmCodeUseCaseResponse = Either<AppError.UnexpectedErrorResult<any>
    | AppError.ValidationErrorResult<any>,
    Result<any>>;

@Injectable()
export class ConfirmRegisterUseCase implements IUseCase<ConfirmRegisterDto, Promise<ConfirmRegisterUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly findValidationCodeByUserId: FindByUserIdValidationCodeUseCase, private readonly confifService: AppConfigService, private readonly updateUserUseCase: UpdateUserUseCase) {
        this._logger = new Logger('FindByIdUseCase');
    }

    async execute(request: ConfirmRegisterDto): Promise<ConfirmRegisterUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            const idOrError = await this.validateToken(request.token, request.userId)
            if (idOrError.isLeft()) {
                const error = idOrError.value.unwrapError()
                return left(Result.Fail(new AppError.ValidationError(error.message)));
            }
            const id = idOrError.value.unwrap()
            const userConfirmRegister = await this.updateUserUseCase.execute({
                id: id,
                data: {status: UserStatus.Register}
            })

            if (userConfirmRegister.isLeft()) {
                const error = userConfirmRegister.value.unwrapError()
                return left(Result.Fail(new AppError.UnexpectedError((error))));
            }
            const userConfirmed = userConfirmRegister.value.unwrap()
            return right(Result.Ok(userConfirmed))

        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }

    private async validateToken(token: string, userId: string): Promise<ConfirmCodeUseCaseResponse> {
        const validationCodeOrError = await this.findValidationCodeByUserId.execute({id: userId})
        if (validationCodeOrError.isLeft()) {
            const error = validationCodeOrError.value.unwrapError()
            return left(Result.Fail(new AppError.ValidationError(error.message)))
        }
        const validationCode = validationCodeOrError.value.unwrap()
        if (validationCode.code != token) {
            return left(Result.Fail(new AppError.ValidationError('invalid code')))
        }
        return right(Result.Ok())
    }
}
