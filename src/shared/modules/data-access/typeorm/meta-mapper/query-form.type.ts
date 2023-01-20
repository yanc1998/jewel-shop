import { QueryBuilder } from 'typeorm'

export class QueryForm {
  attributes?: string[]
  relations?: Record<string, QueryForm>
  filter?: Record<any, any>
  order?: string
  queryBuilder?: QueryBuilder<any>
}
