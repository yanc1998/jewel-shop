import { ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Result } from '../core/Result';

export abstract class BaseCommandHandler<T> implements ICommandHandler<T> {
  protected readonly _logger: Logger;

  constructor(context: string) {
    this._logger = new Logger(context);
  }

  abstract execute(command: T): Promise<Result<void>>;
}
