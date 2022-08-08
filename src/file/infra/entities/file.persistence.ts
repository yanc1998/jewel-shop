import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import {PersistentEntity} from '../../../shared/modules/data-access/typeorm/base.entity';
import {SubcategoryPersistence} from "../../../subcategory/infra/entities/subcategory.persistence";
import {ProductPersistence} from "../../../product/infra/entities/product.persistence";

@Entity('file')
@Index(['id'], {unique: true})
export class FilePersistence extends PersistentEntity {
    @Column({type: 'text'})
    url: string;

    @OneToMany(() => (ProductPersistence), (product) => (product.file))
    products: ProductPersistence[]
}
