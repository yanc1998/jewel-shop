import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import {PersistentEntity} from '../../../shared/modules/data-access/typeorm/base.entity';
import {ProductPersistence} from "../../../product/infra/entities/product.persistence";
import {CategoryPersistence} from "../../../category/infra/entities/category.persistence";

@Entity('subcategory')
@Index(['id'], {unique: true})
export class SubcategoryPersistence extends PersistentEntity {
    @Column({type: 'text'})
    name: string;

    @Column({type: 'text'})
    description: string;

    @OneToMany(
        () => ProductPersistence,
        p => p.subcategory,
        {cascade: ['update']},
    )
    products: ProductPersistence[] | any;

    @Column()
    categoryId: string;

    @ManyToOne(() => (CategoryPersistence), (category) => (category.subcategories))
    @JoinColumn({name: 'category_Id'})
    category: CategoryPersistence;
}
