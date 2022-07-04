import { BaseProps } from '../core/interfaces/IEntity';

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */
export abstract class ValueObject<T extends BaseProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
