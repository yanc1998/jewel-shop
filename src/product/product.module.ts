import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductPersistence} from './infra/entities/product.persistence';
import {ProductUseCases} from './application/useCases';
import {ProductRepository} from './infra/repositories/product.repository';
import {ProductController} from './presentation/controllers/product.controller';
import {FileModule} from "../file/file.module";
import {MulterModule} from "@nestjs/platform-express";
import {AppConfigModule} from "../shared/modules/config/app-config.module";
import {AppConfigService} from "../shared/modules/config/service/app-config-service";
import {multerOptions} from "../shared/modules/config/utils/multer.config";

@Module({
    imports: [
        DataAccessModule,
        FileModule,
        TypeOrmModule.forFeature([ProductPersistence]),
        MulterModule.registerAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                ...multerOptions(configService.app.fileDir)
            }),
        })
    ],
    providers: [...ProductUseCases, ProductRepository],
    exports: [],
    controllers: [ProductController],
})
export class ProductModule {
}

