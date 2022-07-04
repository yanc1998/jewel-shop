import { EnumPermits } from 'src/shared/domain/enum.permits';
import { PermitsMap } from './permits.mapper';

describe('Permits Mapper Test', () => {
  it('Permits To Int', () => {
    const result = PermitsMap.permitsToInt(new Set([EnumPermits.usersReading]));

    expect(result).toEqual(1);
  });

  it('Int to Permits', () => {
    const result = PermitsMap.intToPermits(1);

    expect(result).toEqual(new Set([EnumPermits.usersReading]));
  });
});
