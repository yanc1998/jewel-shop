import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AppConfigService } from './service/app-config-service';
import { databaseConfig, databaseSchema } from './namespaces/database.config';
import { appConfig, appSchema } from './namespaces/app.config';
import { emailConfig, emailSchema } from './namespaces/email.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.dev.env', '.dev.env'],
      load: [
        // syncConfig,
        appConfig,
        // erpConfig,
        databaseConfig,
        emailConfig,
        // graphqlConfig,
        // inventoryClientConfig,
      ],
      validationSchema: Joi.object({
        ...appSchema,
        ...databaseSchema,
        ...emailSchema,
        // ...graphqlSchema,
        // ...erpSchema,
        // ...syncSchema,
        // ...inventoryClientSchema,
      }),
      validationOptions: { abortEarly: true },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {
}
