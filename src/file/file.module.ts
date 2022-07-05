import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FilePersistence} from './infra/entities/file.persistence';
import {ProductUseCases} from './application/useCases';
import {FileRepository} from './infra/repositories/file.repository';
import {FileController} from './presentation/controllers/file.controller';

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([FilePersistence]),
    ],
    providers: [...ProductUseCases, FileRepository],
    exports: [],
    controllers: [FileController],
})
export class FileModule {
}

