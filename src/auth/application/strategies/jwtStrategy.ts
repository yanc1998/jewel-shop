import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/shared/modules/config/service/app-config-service';
import { FindByEmailUserUseCase } from 'src/user/application/useCases/user.findByEmail.use-case';
import { User } from 'src/user/domain/entities/user.entity';
import { UserStatus } from 'src/user/domain/enums/user.status';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly findByEmailUseCase: FindByEmailUserUseCase, configService: AppConfigService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.app.jwtSecret,
    });
  }

  async validate(payload: any): Promise<User> {
    try {
      const userDomainOrError = await this.findByEmailUseCase.execute({ email: payload.email });
      if (userDomainOrError.isLeft()) {
        throw new UnauthorizedException('error');
      }
      const userDomain = userDomainOrError.value.unwrap();
      if (!userDomain || userDomain.status == UserStatus.Pending) {
        throw new UnauthorizedException('not permits');
      }
      return userDomain;
    } catch (error) {
      throw new UnauthorizedException('not permits');
    }

  }
}