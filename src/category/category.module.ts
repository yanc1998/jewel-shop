import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryPersistence} from './infra/entities/category.persistence';
import {CategoryUseCases} from './application/useCases';
import {CategoryRepository} from './infra/repositories/category.repository';
import {TeacherController} from './presentation/controllers/teacher.controller';
import {SubcategoryModule} from "../subcategory/subcategory.module";

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([CategoryPersistence]),
        SubcategoryModule
    ],
    providers: [...CategoryUseCases, CategoryRepository],
    exports: [],
    controllers: [TeacherController],
})
export class CategoryModule {
}

