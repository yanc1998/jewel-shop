import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryPersistence} from './infra/entities/category.persistence';
import {CategoryUseCases} from './application/useCases';
import {CategoryRepository} from './infra/repositories/category.repository';
import {CategoryController} from './presentation/controllers/category.controller';
import {SubcategoryModule} from "../subcategory/subcategory.module";

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([CategoryPersistence]),
        SubcategoryModule,
    ],
    providers: [...CategoryUseCases, CategoryRepository],
    exports: [],
    controllers: [CategoryController],
})
export class CategoryModule {
}

