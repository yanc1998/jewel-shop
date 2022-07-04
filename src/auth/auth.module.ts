import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './application/strategies/localStrategy';
import { JwtStrategy } from './application/strategies/jwtStrategy';
import { ValidateUserUseCase } from './application/useCase/auth.validate.use-case';
import { AuthController } from './controller/authController';
import { AppConfigModule } from '../shared/modules/config/app-config.module';
import { AppConfigService } from '../shared/modules/config/service/app-config-service';
import { AuthUseCases } from './application/useCase';
import { SendEmailUseCase } from 'src/email/application/useCases/email.send.use-case';
import { RegisterUseCase } from './application/useCase/auth.register.use-case';

@Module({
  imports: [
    EmailModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.app.jwtSecret,
        signOptions: {
          expiresIn: configService.app.jwtExpiration,
        },
      }),

    }),
  ],
  controllers: [AuthController],
  providers: [
    ValidateUserUseCase,
    LocalStrategy,
    JwtStrategy,
    SendEmailUseCase,
    RegisterUseCase,
    ...AuthUseCases,
  ],
})
export class AuthModule {
}
