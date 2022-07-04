/* eslint-disable @typescript-eslint/no-empty-function */
import { IRepository, IRepositoryFactory } from '../interfaces/IRepository';
import { MockType } from './MockType';

export const repositoryMockFactory: <T>() => MockType<IRepository<T>> = jest.fn(
  () => ({
    save: jest.fn(() => {
    }),
    update: jest.fn(() => {
    }),
    drop: jest.fn(() => {
    }),
    findById: jest.fn(() => {
    }),
    findOne: jest.fn(() => {
    }),
    getOrmName: jest.fn(() => {
    }),
  }),
);

export const repositoryFactoryMockFactory: <T>() => MockType<IRepositoryFactory<T, IRepository<T>>> = jest.fn(() => ({
  build: jest.fn(() => {
    return repositoryMockFactory();
  }),
  getOrmName: jest.fn(() => {
  }),
}));
