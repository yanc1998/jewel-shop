import { ValueObject } from '../value-object.abstract';

function fixedFloadGuard(value: unknown): value is FixedFloat {
  return value instanceof FixedFloat;
}

function numberGuard(value: unknown): value is number {
  return typeof value === 'number';
}

type FixedFloatProps = {
  value: number;
};

export class FixedFloat extends ValueObject<FixedFloatProps> {
  private readonly _brand?: void;
  private static readonly fractionDigits = 3;

  toString(): string {
    return this.props.value.toFixed(FixedFloat.fractionDigits);
  }

  valueOf(): number {
    return parseFloat(this.props.value.toFixed(FixedFloat.fractionDigits));
  }

  eq(value: FixedFloat): boolean;
  eq(value: number): boolean;
  eq(value: FixedFloat | number): boolean {
    if (fixedFloadGuard(value) || numberGuard(value))
      return this.props.value === value.valueOf();
    return false;
  }

  lt(value: FixedFloat): boolean;
  lt(value: number): boolean;
  lt(value: FixedFloat | number): boolean {
    if (fixedFloadGuard(value) || numberGuard(value))
      return this.props.value < value.valueOf();
    return false;
  }

  lte(value: FixedFloat): boolean;
  lte(value: number): boolean;
  lte(value: FixedFloat | number): boolean {
    if (fixedFloadGuard(value) || numberGuard(value))
      return this.props.value <= value.valueOf();
    return false;
  }

  gt(value: FixedFloat): boolean;
  gt(value: number): boolean;
  gt(value: FixedFloat | number): boolean {
    if (fixedFloadGuard(value) || numberGuard(value))
      return this.props.value > value.valueOf();
    return false;
  }

  gte(value: FixedFloat): boolean;
  gte(value: number): boolean;
  gte(value: FixedFloat | number): boolean {
    if (fixedFloadGuard(value) || numberGuard(value))
      return this.props.value >= value.valueOf();
    return false;
  }

  sum(value: FixedFloat): FixedFloat {
    if (fixedFloadGuard(value))
      return new FixedFloat({ value: this.valueOf() + value.valueOf() });
    return new FixedFloat({ value: this.valueOf() });
  }

  mult(value: FixedFloat): FixedFloat {
    if (fixedFloadGuard(value))
      return new FixedFloat({ value: this.valueOf() * value.valueOf() });
    return new FixedFloat({ value: this.valueOf() });
  }

  static Create(value: number): FixedFloat {
    return new FixedFloat({
      value: parseFloat(value.toFixed(this.fractionDigits)),
    });
  }
}
