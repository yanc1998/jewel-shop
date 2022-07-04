import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { IUserRepository } from '../../domain/interfaces/IRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import { UserPersistence } from '../entities/user.persistence';
import { UserMapper } from '../mappers/user.mappers';

@Injectable()
export class UserRepository extends BaseRepository<User, UserPersistence> implements IUserRepository {
  constructor(@InjectRepository(UserPersistence) _repository: Repository<UserPersistence>) {
    super(_repository, UserMapper.DomainToPersist, UserMapper.PersistToDomain, 'UserRepository');
  }
}