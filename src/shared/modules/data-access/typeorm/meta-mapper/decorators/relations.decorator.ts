import { MetaMapper } from '../meta-mapper.abstract-class'

export function RelationMapper<T>(constructor: new () => MetaMapper<T>) {
  return new constructor()
}
