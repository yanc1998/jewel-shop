import { Module, Global } from '@nestjs/common';
import { Connection } from 'typeorm';
import { typeOrmProvider } from './typeorm/provider';
import {TypeOrmUnitOfWork} from "./typeorm/unitwork.typeorm";

@Global()
@Module({
  imports: [typeOrmProvider],
  providers: [
    {
      provide: 'TYPEORM_CONNECTION',
      useExisting: Connection,
    },
    TypeOrmUnitOfWork
  ],
  exports: [
    TypeOrmUnitOfWork,
    typeOrmProvider,
    {
      provide: 'TYPEORM_CONNECTION',
      useExisting: Connection,
    },
  ],
})
export class DataAccessModule {
}
