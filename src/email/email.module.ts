import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendEmailUseCase } from './application/useCases/email.send.use-case';
import { AppConfigModule } from '../shared/modules/config/app-config.module';
import { AppConfigService } from '../shared/modules/config/service/app-config-service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        transport: {
          host: appConfig.smtp.host,
          secure: true,
          auth: {
            user: appConfig.smtp.email,
            pass: appConfig.smtp.password,
          },
        }, defaults: {
          from: `"nest-modules" <${'username@gmail.com'}>`,
        },
      }),
    }),
  ],
  providers: [SendEmailUseCase],
})
export class EmailModule {
}
