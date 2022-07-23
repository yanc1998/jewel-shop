import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne} from 'typeorm';
import {PersistentEntity} from '../../../shared/modules/data-access/typeorm/base.entity';
import {SubcategoryPersistence} from "../../../subcategory/infra/entities/subcategory.persistence";
import {User} from "../../../user/domain/entities/user.entity";
import {UserPersistence} from "../../../user/infra/entities/user.persistence";

@Entity('validationCode')
@Index(['id'], {unique: true})
export class Validation_codePersistence extends PersistentEntity {
    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    userId: string

    @OneToOne(() => (UserPersistence), (user) => (user))
    @JoinColumn({name: 'userId'})
    user: UserPersistence
}
