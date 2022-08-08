import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne} from 'typeorm';
import {PersistentEntity} from '../../../shared/modules/data-access/typeorm/base.entity';
import {SubcategoryPersistence} from "../../../subcategory/infra/entities/subcategory.persistence";
import {FilePersistence} from "../../../file/infra/entities/file.persistence";

@Entity('product')
@Index(['id'], {unique: true})
export class ProductPersistence extends PersistentEntity {
    @Column({type: 'text'})
    name: string;

    @Column({type: 'text'})
    description: string;

    @Column({type: 'float'})
    price: number;

    @Column({type: 'int'})
    count: number;

    @Column()
    subcategoryId: string;

    @ManyToOne(() => (SubcategoryPersistence), (subcategory) => (subcategory.products))
    @JoinColumn({name: 'subcategoryId'})
    subcategory: SubcategoryPersistence;

    @Column()
    fileId: string

    @ManyToOne(() => (FilePersistence), (file) => (file.products))
    @JoinColumn({name: 'fileId'})
    file: FilePersistence | any
}
