import { BaseEntity, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IPersistentEntity } from 'src/shared/core/interfaces/IPersistentEntity';

export abstract class PersistentEntity extends BaseEntity
  implements IPersistentEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
