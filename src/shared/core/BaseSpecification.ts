import {
  ISpecificationVisitor,
  ISpecification,
} from './interfaces/ISpecification';
import { IEntity } from './interfaces/IEntity';
import { Identifier } from '../domain/Identifier';

export abstract class BaseSpecification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(item: T): boolean;

  accept(visitor: ISpecificationVisitor<T, ISpecification<T>>): void {
    visitor.visit(this);
  }
}

/**
 * Specify if the Identifier of the passed Entity is equal to an 'Id'
 *
 * @export
 * @class IdIsSpecification
 * @extends {BaseSpecification<T>}
 * @template T
 */
export class IdIsSpec<T extends IEntity> extends BaseSpecification<T> {
  constructor(public readonly id: Identifier) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    return this.id.equals(item._id);
  }
}

/**
 * Specify if the Identifier of the passed Entity is in the 'IdArr' list
 *
 * @export
 * @class IdInSpecification
 * @extends {BaseSpecification<T>}
 * @template T
 */
export class IdInSpec<T extends IEntity> extends BaseSpecification<T> {
  constructor(public readonly idArr: Identifier[]) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    return this.idArr.some(id => item._id.equals(id));
  }
}
