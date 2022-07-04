import { Response } from 'express';
import { IResultError } from './interfaces/IResultError';

export class BaseController {
  public ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public fail(res: Response, error: IResultError) {
    return res.status(500).json({
      code: error.name,
      message: error.message,
    });
  }
}
