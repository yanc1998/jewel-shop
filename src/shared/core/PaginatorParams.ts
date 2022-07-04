import { ValueObject } from '../domain/value-object.abstract';
import { Guard } from './Guard';
import { Result } from './Result';
import { AppError } from './errors/AppError';

export type PageParamsDto = {
  pageNum: number;
  pageLimit: number;
};

type PageParamsProps = {
  pageNum: number;
  pageLimit: number;
};

export class PageParams extends ValueObject<PageParamsProps> {
  static pageMinValue = 1;
  static pageLimitMinValue = 1;

  get pageLimit(): number {
    return this.props.pageLimit;
  }

  get pageNum(): number {
    return this.props.pageNum;
  }

  static create(props: PageParamsProps): Result<PageParams> {
    const pageLimitIsGreaterThanResult = Guard.greaterThanEqual(
      this.pageLimitMinValue,
      props.pageLimit,
      'pageLimit',
    );

    if (!pageLimitIsGreaterThanResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(pageLimitIsGreaterThanResult.message),
      );
    const pageNumIsGreaterThanResult = Guard.greaterThanEqual(
      this.pageMinValue,
      props.pageNum,
      'pageNum',
    );

    if (!pageNumIsGreaterThanResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(pageNumIsGreaterThanResult.message),
      );

    return Result.Ok(new PageParams(props));
  }
}
