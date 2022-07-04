import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { Result } from 'src/shared/core/Result';
import { Guard, GuardArgumentCollection } from 'src/shared/core/Guard';
import { AppError } from 'src/shared/core/errors/AppError';

type RollCodeProps = {
  lot: string;
  rollConsecutive: number;
  lineNumber: number;
};

export class RollCode extends ValueObject<RollCodeProps> {
  private readonly _brand?: void;
  private _code: string;
  private static readonly maxConsecutive = 999;
  private static readonly minConsecutive = 1;

  private zeroPad(num: number, places: number) {
    return String(num).padStart(places, '0');
  }

  constructor(props: RollCodeProps) {
    super(props);
    this._code = `${this.props.lot}${this.zeroPad(
      this.props.lineNumber,
      2,
    )}${this.zeroPad(this.props.rollConsecutive, 3)}`;
  }

  get code() {
    return this._code;
  }

  private static isSatisfiedBy(props: RollCodeProps): Result<void> {
    const args: GuardArgumentCollection<unknown> = [
      { argument: props.lineNumber, argumentPath: 'lineNumber' },
      { argument: props.lot, argumentPath: 'lot' },
      { argument: props.rollConsecutive, argumentPath: 'rollConsecutive' },
    ];

    const nullGuard = Guard.againstNullOrUndefinedBulk(args);
    if (!nullGuard.succeeded) {
      return Result.Fail(new AppError.ValidationError(nullGuard.message));
    }

    const rollConsecutiveLtGuardResult = Guard.greaterThanEqual(
      RollCode.minConsecutive,
      props.rollConsecutive,
      'rollCode.consecutive',
    );
    if (!rollConsecutiveLtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(rollConsecutiveLtGuardResult.message),
      );

    const rollConsecutiveGtGuardResult = Guard.lesserThanEqual(
      RollCode.maxConsecutive,
      props.rollConsecutive,
      'rollCode.consecutive',
    );
    if (!rollConsecutiveGtGuardResult.succeeded)
      return Result.Fail(
        new AppError.ValidationError(rollConsecutiveGtGuardResult.message),
      );
    return Result.Ok();
  }

  public static create(props: RollCodeProps): Result<RollCode> {
    const voidOrErr = this.isSatisfiedBy(props);
    if (voidOrErr.isFailure)
      return Result.Fail<RollCode>(voidOrErr.unwrapError());
    return Result.Ok(new RollCode(props));
  }

  public static createFromStr(code: string): Result<RollCode> {
    const rollConsecutive = +code.substr(code.length - 3);
    const lot = code.substring(0, 9);
    const lineNumber = +code.substring(code.length - 5, code.length - 3);
    return Result.Ok(
      new RollCode({
        rollConsecutive,
        lot: lot,
        lineNumber,
      }),
    );
  }
}
