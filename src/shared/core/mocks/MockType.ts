/* eslint-disable @typescript-eslint/no-explicit-any */
export type MockType<T> = {
  [P in keyof T]: jest.Mock<unknown>;
};

export function generateMockTypeFactory<T>(
  keys: Array<string>,
): () => MockType<T> {
  let mockType: unknown = {};
  for (const field of keys) {
    Object.assign(mockType, {
      [field]: jest.fn(async () => {
        throw new Error('Implements me');
      }),
    });
  }
  return jest.fn(() => mockType as MockType<T>);
}
