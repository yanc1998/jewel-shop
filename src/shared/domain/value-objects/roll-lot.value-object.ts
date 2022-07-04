import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { Result } from 'src/shared/core/Result';
import { Guard } from 'src/shared/core/Guard';
import { AppError } from 'src/shared/core/errors/AppError';

type RollLotProps = {
  orgCode: string;
  consecutive: number;
  rollType: 'W' | 'R';
};

export class RollLot extends ValueObject<RollLotProps> {
  private readonly _brand?: void;
  private _code: string;

  private static zeroPad(num: number, places: number) {
    return String(num).padStart(places, '0');
  }

  constructor(props: RollLotProps);
  constructor(props: RollLotProps) {
    super(props);
    this._code = `${'PQ'}${RollLot.zeroPad(this.props.consecutive, 6)}${props.rollType || 'R'}`;

  }


  get value(): string {
    return this._code;
  }

  get consecutive(): number {
    return this.props.consecutive;
  }

  get orgCode(): string {
    return this.props.orgCode;
  }

  get rollType(): string {
    return this.props.rollType;
  }


  private static isSatisfiedBy(props: Partial<RollLotProps>): Result<void> {

    const nullGuardResult = Guard.againstNullOrUndefined(
      props.orgCode,
      'orgCode',
    );

    if (!nullGuardResult.succeeded)
      return Result.Fail(new AppError.ValidationError(nullGuardResult.message));
    return Result.Ok();
  }

  public static createFromString(lot: string): Result<RollLot> {
    const orgCode = lot.substr(0, 2);
    const consecutive = +lot.substr(2, lot.length - 3);
    const rollType = lot.substr(lot.length - 1) as any;

    const rollLotProps: RollLotProps = { orgCode, consecutive, rollType };
    const voidOrErr = this.isSatisfiedBy(rollLotProps);
    if (voidOrErr.isFailure)
      return Result.Fail<RollLot>(voidOrErr.unwrapError());

    return Result.Ok(new RollLot(rollLotProps));
  }

  public static create(props: RollLotProps): Result<RollLot> {
    const voidOrErr = this.isSatisfiedBy(props);
    if (voidOrErr.isFailure)
      return Result.Fail<RollLot>(voidOrErr.unwrapError());
    return Result.Ok(new RollLot(props));
  }
}
