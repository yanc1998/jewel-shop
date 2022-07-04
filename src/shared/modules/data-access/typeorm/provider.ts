import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app-config.module';
import { AppConfigService } from '../../config/service/app-config-service';
import { ConnectionOptions } from 'typeorm';

export const typeOrmProvider = TypeOrmModule.forRootAsync({
  imports: [AppConfigModule],
  inject: [AppConfigService],
  useFactory: (config: AppConfigService): ConnectionOptions => {
    return {
      entities: [
        __dirname + '/../../../../**/infra/entities/*.infra{.ts,.js}',
        __dirname + '/../../../../**/infra/entities/*.view{.ts,.js}',
        __dirname + '/../../../../**/infra/entities/*.persistence{.ts,.js}',
      ],
      migrations: [__dirname + '/../../../../../migrations/*.js'],
      cli: {
        migrationsDir: __dirname + '/../../../../../migrations/',
      },
      logging: config.app.nodeEnv !== 'production',
      ...config.database,
    } as ConnectionOptions;
  },
});
