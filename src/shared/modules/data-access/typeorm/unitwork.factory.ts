import {
  IUnitOfWorkFactory,
  IUnitOfWork,
} from 'src/shared/core/interfaces/IUnitOfWork';
import { TypeOrmUnitOfWork } from './unitwork.typeorm';
import { Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { OrmName } from '../types/orm-name.enum';

export class TypeOrmUnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(
    @Inject('TYPEORM_CONNECTION') private readonly connection: Connection,
  ) {
  }

  getOrmName(): string {
    return OrmName.TYPE_ORM;
  }

  build(): IUnitOfWork {
    return new TypeOrmUnitOfWork(this.connection);
  }
}
