import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/domain/entities/user.entity';
import { ValidateUserUseCase } from '../useCase/auth.validate.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.validateUserUseCase.execute({ email: email, password: password });
    if (user.isLeft()) {
      throw new UnauthorizedException(user.value.unwrapError());
    }
    return user.value.unwrap();
  }
}