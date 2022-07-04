import { Result } from '../Result';
import { BaseError } from '../BaseError';

/**
 * @desc General application errors (few of these as possible)
 * @http 500
 */
export namespace AppError {
  const _context = 'AppError';

  export class UnexpectedError extends BaseError {
    private readonly _brand?: void;

    public constructor(error?: Error) {
      super({
        name: 'UnexpectedError',
        message: error
          ? `An unexpected error occurred: ${error.message}`
          : 'An unexpected error occurred.',
        context: _context,
      });
    }
  }

  export type UnexpectedErrorResult<T> = Result<T, UnexpectedError>;

  export class TransactionalError extends BaseError {
    private readonly _brand?: TransactionalError;

    public constructor() {
      super({
        name: 'TransactionalError',
        message: `A transactional error has ocurred`,
        context: _context,
      });
    }
  }

  export type TransactionalErrorResult<T> = Result<T, ValidationError>;

  export class ValidationError extends BaseError {
    private readonly _brand?: ValidationError;

    public constructor(message: string) {
      super({ name: 'ValidationError', message, context: _context });
    }
  }

  export type ValidationErrorResult<T> = Result<T, ValidationError>;


  export class ObjectNotExist extends BaseError {
    private readonly _brand?: ObjectNotExist;

    public constructor(message: string) {
      super({ name: 'ObjectNotExist', message, context: _context });
    }
  }

  export type ObjectNotExistResult<T> = Result<T, ObjectNotExist>;
}
