import {PageParamsDto} from '../../../shared/core/PaginatorParams';

export type ProductPaginatedDto = {
    pageParams: PageParamsDto;
    filter: Record<string, any>;
};
