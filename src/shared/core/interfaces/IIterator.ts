import Optional from '../Option';

export interface IIterator<T> {
  // Return the current element.
  current(): Promise<Optional<T>>;

  // Return the current element and move forward to next element.
  next(): Promise<Optional<T>>;

  // Return the key of the current element.
  key(): number;

  // Rewind the Iterator to the first element.
  // rewind(): void;
}
