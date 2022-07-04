import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductPersistence} from './infra/entities/product.persistence';
import {ProductUseCases} from './application/useCases';
import {ProductRepository} from './infra/repositories/product.repository';
import {ProductController} from './presentation/controllers/product.controller';

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([ProductPersistence]),
    ],
    providers: [...ProductUseCases, ProductRepository],
    exports: [],
    controllers: [ProductController],
})
export class ProductModule {
}

