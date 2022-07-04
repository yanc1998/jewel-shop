import { Module, Global } from '@nestjs/common';
import { Connection } from 'typeorm';
import { typeOrmProvider } from './typeorm/provider';

@Global()
@Module({
  imports: [typeOrmProvider],
  providers: [
    {
      provide: 'TYPEORM_CONNECTION',
      useExisting: Connection,
    },
  ],
  exports: [
    typeOrmProvider,
    {
      provide: 'TYPEORM_CONNECTION',
      useExisting: Connection,
    },
  ],
})
export class DataAccessModule {
}
