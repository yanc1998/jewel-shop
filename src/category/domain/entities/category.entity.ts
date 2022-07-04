import {DomainBaseProps} from '../../../shared/domain/domain.base-props';
import {DomainTimestamp} from '../../../shared/domain/domain.timestamp';
import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';
import {Subcategory} from "../../../subcategory/domain/entities/subcategory.entity";


type categoryProps = DomainBaseProps & DomainTimestamp & {
    subcategoriesIds?: { id: string }[];
    subcategories?: Subcategory[];
};

type newCategoryProps = Omit<categoryProps, 'id' | 'createdAt' | 'updatedAt'>;

export class Category extends DomainEntity<categoryProps> {

    get name(): string {
        return this.props.name;
    }

    get subcategoriesIds(): { id: string }[] {
        return this.props.subcategoriesIds;
    }

    get subcategories(): Subcategory[] {
        return this.props.subcategories;
    }


    get description(): string {
        return this.props.description;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public SetSubcategories(facs: { id: string }[]): void {

        if (!facs) return;

        this.props.subcategoriesIds = facs;
    }

    public static New(props: newCategoryProps): Result<Category> {
        const ans: Result<Category> = this.Create({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (ans.isFailure) return Result.Fail(ans.unwrapError());

        return Result.Ok(ans.unwrap());
    }

    public static Create(props: categoryProps, id: string = null): Result<Category> {
        // set guards here
        return Result.Ok(new Category(props, new UniqueEntityID(id)));
    }

    public Update(props: any) {

        this.props.description = props.description ?? this.props.description;
        this.props.name = props.fullName ?? this.props.name;
        this.SetSubcategories(props.subcategoriesIds);
        this.props.updatedAt = new Date();
    }

}
