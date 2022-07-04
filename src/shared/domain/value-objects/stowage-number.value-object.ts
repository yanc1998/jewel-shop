import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { Result } from 'src/shared/core/Result';
import { Guard } from 'src/shared/core/Guard';
import { AppError } from 'src/shared/core/errors/AppError';


type StowageNumberProps = {
  orgCode: string,
  year: number,
  month: number,
  consecutive: number,
};

export class StowageNumber extends ValueObject<StowageNumberProps> {
  private readonly _brand?: void;
  private _value: string;
  private static readonly minMonthValue = 1;
  private static readonly maxMonthValue = 12;
  private static readonly minYearValue = 21;
  private static readonly maxYearValue = 99;
  private static readonly minConsecutive = 0;
  private static readonly maxConsecutive = 9999;

  private zeroPad(num: number, places: number) {
    return String(num).padStart(places, '0');
  }

  constructor(props: StowageNumberProps) {
    super(props);
    this._value = `${this.props.orgCode}${this.zeroPad(this.props.year, 2)}${this.zeroPad(this.props.month, 2)}L${this.zeroPad(this.props.consecutive, 4)}`;
  }


  get value(): string {
    return this._value;
  }

  get consecutive(): number {
    return this.props.consecutive;
  }

  get year(): number {
    return this.props.year;
  }

  get month(): number {
    return this.props.month;
  }

  get orgCode(): string {
    return this.props.orgCode;
  }

  private static isSatisfiedBy(props: StowageNumberProps): Result<void> {


    //Validate Year
    const yearLtGuardResult = Guard.lesserThanEqual(
      this.maxYearValue,
      props.year,
      'stowage.year',
    );
    if (!yearLtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(yearLtGuardResult.message),
      );

    const yearGtGuardResult = Guard.greaterThanEqual(
      this.minYearValue,
      props.year,
      'stowage.year',
    );
    if (!yearGtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(yearGtGuardResult.message),
      );


    //Validate Month
    const monthLtGuardResult = Guard.lesserThanEqual(
      this.maxMonthValue,
      props.month,
      'stowage.month',
    );
    if (!monthLtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(monthLtGuardResult.message),
      );

    const monthGtGuardResult = Guard.greaterThanEqual(
      this.minMonthValue,
      props.month,
      'stowage.month',
    );
    if (!monthGtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(monthGtGuardResult.message),
      );


    //Validate Consecutive
    const consecutiveLtGuardResult = Guard.lesserThanEqual(
      this.maxConsecutive,
      props.consecutive,
      'stowage.consecutive',
    );
    if (!consecutiveLtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(consecutiveLtGuardResult.message),
      );

    const consecutiveGtGuardResult = Guard.greaterThanEqual(
      this.minConsecutive,
      props.consecutive,
      'stowage.consecutive',
    );
    if (!consecutiveGtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(consecutiveGtGuardResult.message),
      );

    return Result.Ok();
  }

  public static create(props: StowageNumberProps): Result<StowageNumber> {
    const voidOrErr = this.isSatisfiedBy(props);
    if (voidOrErr.isFailure)
      return Result.Fail<StowageNumber>(voidOrErr.unwrapError());

    return Result.Ok(new StowageNumber(props));
  }


}






