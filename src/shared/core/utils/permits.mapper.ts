import { EnumPermits } from 'src/shared/domain/enum.permits';

export class PermitsMap {
  public static permitsToInt(permits: Set<EnumPermits>): number {
    let sum = 0;
    for (const item of permits) sum += Math.pow(2, item);

    return sum;
  }

  public static intToPermits(permitsInt: number): Set<EnumPermits> {
    const permits: Set<EnumPermits> = new Set();
    let str = permitsInt.toString(2);
    while (str.length < 32) {
      str = '0' + str;
    }
    for (let index = 0; index < 32; index++) {
      if (str[index] == '1') permits.add(31 - index);
    }
    return permits;
  }
}
