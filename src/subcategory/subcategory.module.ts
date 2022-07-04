import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SubcategoryPersistence} from './infra/entities/subcategory.persistence';
import {SubcategoryUseCases} from './application/useCases';
import {SubcategoryRepository} from './infra/repositories/subcategory.repository';
import {SubcategoryController} from './presentation/controllers/subcategory.controller';
import {ProductModule} from "../product/product.module";

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([SubcategoryPersistence]),
        ProductModule
    ],
    providers: [...SubcategoryUseCases, SubcategoryRepository],
    exports: [],
    controllers: [SubcategoryController],
})
export class SubcategoryModule {
}

