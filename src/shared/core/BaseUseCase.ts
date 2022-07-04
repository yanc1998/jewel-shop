import { IUseCase } from './interfaces/IUseCase';
import { Logger } from '@nestjs/common';

export abstract class BaseUseCase<T, U> implements IUseCase<T, U> {
  protected _logger: Logger;

  constructor(ctx: string) {
    this._logger = new Logger(ctx);
  }

  abstract execute(request: T): U | Promise<U>;
}
