import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { EmailSendDto } from '../dtos/emial.send.dto';
import { MailerService } from '@nestjs-modules/mailer';

export type SendEMailUseCaseResponse = Either<AppError.UnexpectedErrorResult<void>
    | AppError.ValidationErrorResult<void>,
    Result<void>>;

@Injectable()
export class SendEmailUseCase implements IUseCase<EmailSendDto, Promise<SendEMailUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly mailerService: MailerService) {
        this._logger = new Logger('CreateUserUseCase');
    }

    async execute(request: EmailSendDto): Promise<SendEMailUseCaseResponse> {
        this._logger.log('Executing...');

        try {
            //ponerle la plantilla del correo que se va a enviar
            await this.mailerService.sendMail({ to: request.to, html: request.body.message });
            return right(Result.Ok());
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}