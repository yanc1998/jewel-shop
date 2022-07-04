import { v4 } from 'uuid';

import { BaseIdentifier } from './Identifier';

export class UniqueEntityID extends BaseIdentifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : v4());
  }
}
