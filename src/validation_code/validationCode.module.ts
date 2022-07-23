import {Module} from '@nestjs/common';
import {DataAccessModule} from '../shared/modules/data-access/data-access.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Validation_codePersistence} from './infra/entities/validation_code.persistence';
import {ValidateCodeUseCases} from './application/useCases';
import {ValidateCodeRepository} from './infra/repositories/validateCode.repository';

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([Validation_codePersistence]),
    ],
    providers: [...ValidateCodeUseCases, ValidateCodeRepository],
    exports: [...ValidateCodeUseCases],
})
export class ValidationCodeModule {
}

