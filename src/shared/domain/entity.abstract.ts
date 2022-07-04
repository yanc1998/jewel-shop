import { BaseProps, IEntity } from '../core/interfaces/IEntity';
import { Identifier } from './Identifier';
import { v4 } from 'uuid';

export abstract class DomainEntity<T extends BaseProps> implements IEntity {
  public readonly _id: Identifier;
  protected readonly props: T;

  protected constructor(props: T, id?: Identifier) {
    this._id = id ?? v4();
    this.props = props;
  }

  public equals(entity: DomainEntity<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
