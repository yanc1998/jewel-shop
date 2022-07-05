import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne} from 'typeorm';
import {PersistentEntity} from '../../../shared/modules/data-access/typeorm/base.entity';
import {SubcategoryPersistence} from "../../../subcategory/infra/entities/subcategory.persistence";

@Entity('file')
@Index(['id'], {unique: true})
export class FilePersistence extends PersistentEntity {
    @Column({type: 'text'})
    url: string;
}
