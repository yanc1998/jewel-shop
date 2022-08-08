import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import {PersistentEntity} from '../../../shared/modules/data-access/typeorm/base.entity';
import {SubcategoryPersistence} from "../../../subcategory/infra/entities/subcategory.persistence";


@Entity('category')
@Index(['id'], {unique: true})
export class CategoryPersistence extends PersistentEntity {
    @Column({type: 'text'})
    name: string;

    @Column({type: 'text'})
    description: string;

    @OneToMany(
        () => SubcategoryPersistence,
        f => f.category,
        {cascade: ['update']},
    )
    @JoinTable()
    subcategories: SubcategoryPersistence[] | any;

}
