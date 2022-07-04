export interface ISpecification<T> {
  isSatisfiedBy(item: T): boolean;

  accept(visitor: ISpecificationVisitor<T, ISpecification<T>>): void;
}

export interface ISpecificationVisitor<T, TVisit extends ISpecification<T>> {
  visit(specification: TVisit): void;
}

export class SpecificationComposite {
  static And<T>(left: ISpecification<T>, right: ISpecification<T>) {
    return new AndSpecification(left, right);
  }

  static Or<T>(left: ISpecification<T>, right: ISpecification<T>) {
    return new OrSpecification(left, right);
  }

  static Not<T>(specification: ISpecification<T>) {
    return new NotSpecification<T>(specification);
  }
}

export class AndSpecification<T> implements ISpecification<T> {
  constructor(
    public readonly left: ISpecification<T>,
    public readonly right: ISpecification<T>,
  ) {
  }

  accept(visitor: ISpecificationVisitor<T, ISpecification<T>>): void {
    visitor.visit(this);
  }

  public isSatisfiedBy(item: T): boolean {
    return this.left.isSatisfiedBy(item) && this.right.isSatisfiedBy(item);
  }
}

export class OrSpecification<T> implements ISpecification<T> {
  constructor(
    public readonly left: ISpecification<T>,
    public readonly right: ISpecification<T>,
  ) {
  }

  accept(visitor: ISpecificationVisitor<T, ISpecification<T>>): void {
    return visitor.visit(this);
  }

  public isSatisfiedBy(item: T): boolean {
    return this.left.isSatisfiedBy(item) || this.right.isSatisfiedBy(item);
  }
}

export class NotSpecification<T> implements ISpecification<T> {
  constructor(public readonly specification: ISpecification<T>) {
    this.specification = specification;
  }

  accept(visitor: ISpecificationVisitor<T, ISpecification<T>>): void {
    visitor.visit(this);
  }

  public isSatisfiedBy(item: T): boolean {
    return !this.specification.isSatisfiedBy(item);
  }
}
