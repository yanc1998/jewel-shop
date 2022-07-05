import { CreateFileUseCase } from './file.create.use-case';
import { PaginatedFileUseCase } from './file.paginated.use-case';
import { RemoveFileUseCase } from './file.remove.use-case';
import { UpdateFileUseCase } from './file.update.use-case';
import { FindByIdFileUseCase } from './file.find-by-id.use-case';

export * from './file.create.use-case';
export * from './file.paginated.use-case';
export * from './file.remove.use-case';
export * from './file.update.use-case';
export * from './file.find-by-id.use-case';

export const FileUseCases = [
  CreateFileUseCase,
  PaginatedFileUseCase,
  RemoveFileUseCase,
  UpdateFileUseCase,
  FindByIdFileUseCase,
];
