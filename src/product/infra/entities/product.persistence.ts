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

    @Column()
    subcategoryId: number;

    @ManyToOne(() => (SubcategoryPersistence), (subcategory) => (subcategory.products))
    @JoinColumn({name: 'subcategory_id'})
    subcategory: SubcategoryPersistence;


    @Column()
    fileId: number

    @ManyToOne(() => (FilePersistence))
    @JoinColumn({name: 'file_id'})
    file: FilePersistence
}
