import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ReturnLoginDto } from '../dtos/returnLogin.dto';

export type LoginUseCaseResponse = Either<AppError.UnexpectedErrorResult<ReturnLoginDto>
  | AppError.ValidationErrorResult<ReturnLoginDto>,
  Result<ReturnLoginDto>>;

@Injectable()
export class LoginUseCase implements IUseCase<User, Promise<LoginUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly jwtService: JwtService) {
    this._logger = new Logger('LoginUseCase');
  }

  async execute(request: User): Promise<LoginUseCaseResponse> {
    this._logger.log(`Executing. Request: ${JSON.stringify(request)}`);

    try {
      const payload = { email: request.email, sub: request._id.toString(), role: request.roles };
      const token: string = await this.jwtService.signAsync(payload);
      return right(Result.Ok({ token: token }));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}