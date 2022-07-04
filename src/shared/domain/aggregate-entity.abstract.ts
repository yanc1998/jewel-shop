import { AggregateRoot } from '@nestjs/cqrs';
import { IEntity, BaseProps } from '../core/interfaces/IEntity';
import { Identifier } from './Identifier';
import { Logger } from '@nestjs/common';

export abstract class AggregateDomainEntity<TProps extends BaseProps>
  extends AggregateRoot
  implements IEntity {
  public readonly _id: Identifier;
  protected readonly props: TProps;
  protected _logger: Logger;

  protected constructor(
    props: TProps,
    id: Identifier,
    ctx: string = 'AggregateDomainEntity',
  ) {
    super();
    this._id = id;
    this.props = props;
    this._logger = new Logger(ctx);
  }

  public equals(entity: AggregateDomainEntity<TProps>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
