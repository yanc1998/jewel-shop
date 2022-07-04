import {
  ISpecificationVisitor,
  ISpecification,
  AndSpecification,
  OrSpecification,
} from 'src/shared/core/interfaces/ISpecification';
import { IEntity } from 'src/shared/core/interfaces/IEntity';
import { Brackets, WhereExpression } from 'typeorm';
import { Type } from '@nestjs/common';

const UnhandledSpecificationError = new Error('Unhandled Specification');

export type BaseSpecificationArgs<T> = AndSpecification<T> | OrSpecification<T>;

export abstract class BaseTypeOrmVisitor<T extends IEntity>
  implements ISpecificationVisitor<T, ISpecification<T>> {
  protected brackets: Brackets;

  private childNum: number = 1;

  abstract visit(spec: BaseSpecificationArgs<T>): void;

  constructor(
    protected type: Type<ISpecificationVisitor<T, ISpecification<T>>>,
    protected readonly _id: string = 'rt',
  ) {
  }

  private convertToExpression<TVisitor extends BaseTypeOrmVisitor<T>>(
    spec: ISpecification<T>,
    id: string,
  ) {
    const visitor = new this.type(id) as TVisitor;
    spec.accept(visitor);
    return visitor.brackets;
  }

  get whereExpression(): Brackets {
    return this.brackets;
  }

  protected getChildId(): string {
    return `${this._id}${this.childNum++}`;
  }

  protected baseVisit(spec: ISpecification<T>) {
    switch (true) {
      case spec instanceof AndSpecification:
        this.visitAndSpecification(spec as AndSpecification<T>);
        break;
      case spec instanceof OrSpecification:
        this.visitOrSpecification(spec as OrSpecification<T>);
        break;
      default:
        throw UnhandledSpecificationError;
    }
  }

  protected visitAndSpecification(spec: AndSpecification<T>): void {
    const leftExpression = this.convertToExpression(
      spec.left,
      `${this.getChildId()}`,
    );
    const rightExpression = this.convertToExpression(
      spec.right,
      `${this.getChildId()}`,
    );
    this.brackets = new Brackets(function(qb: WhereExpression) {
      return qb.where(leftExpression).andWhere(rightExpression);
    });
  }

  protected visitOrSpecification(spec: OrSpecification<T>): void {
    const leftExpression = this.convertToExpression(
      spec.left,
      `${this.getChildId()}`,
    );
    const rightExpression = this.convertToExpression(
      spec.right,
      `${this.getChildId()}`,
    );
    this.brackets = new Brackets(function(qb: WhereExpression) {
      return qb.where(leftExpression).orWhere(rightExpression);
    });
  }

  protected in<TValue>(columnName: string, value: TValue) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" IN :..in_${childId}`, {
        [`in_${childId}`]: value,
      }),
    );
  }

  protected is<TValue>(columnName: string, value: TValue) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" = :is_${childId}`, {
        [`is_${childId}`]: value,
      }),
    );
  }

  protected isNull(columnName: string) {
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" IS NULL`),
    );
  }

  protected contains(columnName: string, value: string) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" LIKE :contains_${childId}`, {
        [`contains_${this.getChildId()}`]: `%${childId}%`,
      }),
    );
  }

  protected lesserThan(columnName: string, value: number | Date) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" < :lt_${childId}`, {
        [`lt_${childId}`]: value,
      }),
    );
  }

  protected greatherThan(columnName: string, value: number | Date) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" > :gt_${childId}`, {
        [`gt_${childId}`]: value,
      }),
    );
  }

  protected lesserThanEquals(columnName: string, value: number | Date) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" <= :lte_${childId}`, {
        [`lte_${childId}`]: value,
      }),
    );
  }

  protected greatherThanEquals(columnName: string, value: number | Date) {
    const childId = this.getChildId();
    this.brackets = new Brackets((qb: WhereExpression) =>
      qb.where(`"${columnName}" >= :gte_${childId}`, {
        [`gte_${childId}`]: value,
      }),
    );
  }
}
