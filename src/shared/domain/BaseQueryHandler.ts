import { IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

export abstract class BaseQueryHandler<T, U> implements IQueryHandler<T> {
  protected readonly _logger: Logger;

  constructor(context: string) {
    this._logger = new Logger(context);
  }

  abstract execute(query: T): Promise<U>;
}
