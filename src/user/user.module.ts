import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ValidateUserUseCase} from 'src/auth/application/useCase';
import {DataAccessModule} from 'src/shared/modules/data-access/data-access.module';
import {CreateUserUseCase} from './application/useCases/user.create.use-case';
import {FindByEmailUserUseCase} from './application/useCases/user.findByEmail.use-case';
import {FindByIdUserUseCase} from './application/useCases/user.findById.use-case';
import {UpdateUserUseCase} from './application/useCases/user.update.use-case';
import {UserController} from './controller/UserController';
import {UserPersistence} from './infra/entities/user.persistence';
import {UserRepository} from './infra/repositories/user.repository';
import {PaginatedUserUseCase} from "./application/useCases/user.paginate.use-case";

@Module({
    imports: [DataAccessModule, TypeOrmModule.forFeature([UserPersistence])],
    providers: [ValidateUserUseCase, CreateUserUseCase, FindByEmailUserUseCase, FindByIdUserUseCase, UserRepository, UpdateUserUseCase, PaginatedUserUseCase],
    controllers: [UserController],
    exports: [UserRepository, ValidateUserUseCase, FindByEmailUserUseCase, CreateUserUseCase, UpdateUserUseCase]
})
export class UserModule {
}
