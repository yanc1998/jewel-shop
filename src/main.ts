import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './shared/modules/config/service/app-config-service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    // allowedHeaders: [],
  });

  const configService = app.get(AppConfigService);
  await app.listen(configService.app.port);

  console.log(`App run in port ${configService.app.port}`);

}

bootstrap();
