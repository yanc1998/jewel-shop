import { BaseIdentifier } from './Identifier';

export class NumericEntityId extends BaseIdentifier<number> {
  constructor(id: number) {
    super(id);
  }
}
