import {Module} from '@nestjs/common';
import {DataAccessModule} from './shared/modules/data-access/data-access.module';
import {UserModule} from './user/user.module';
import {EmailModule} from './email/email.module';
import {AuthModule} from './auth/auth.module';
import {MulterModule} from "@nestjs/platform-express";
import {AppConfigService} from "./shared/modules/config/service/app-config-service";
import {multerOption} from './shared/modules/config/utils/multer.config'
import {AppConfigModule} from "./shared/modules/config/app-config.module";

@Module({
    imports: [
        DataAccessModule,
        UserModule,
        EmailModule,
        AuthModule,
        MulterModule.registerAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                dest: configService.app.fileDir,
                ...multerOption
            }),
        })
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
