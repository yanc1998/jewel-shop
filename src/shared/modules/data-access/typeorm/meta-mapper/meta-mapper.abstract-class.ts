import {getConnection, QueryBuilder, Repository, SelectQueryBuilder} from 'typeorm'
import {QueryForm} from './query-form.type'
import {prepareQueryForMetaMapper} from './queryPreparationForMetaMapper'
import {ForbiddenException} from '@nestjs/common'
import {isUndefined} from '@nestjs/common/utils/shared.utils'
import {v4 as uuid} from 'uuid'

export abstract class MetaMapper<T> {
    _createQuery(form: QueryForm | string, repo: Repository<T>): SelectQueryBuilder<T> {
        let queryBuilder = repo.createQueryBuilder('c')
        if (!form) {
            // console.log(queryBuilder.getParameters())
            // console.log(queryBuilder.getQuery())

            return queryBuilder
        }
        if (typeof form === 'string') form = JSON.parse(form as any) as QueryForm

        if (form?.filter) {
            const filterQuery = prepareQueryForMetaMapper(repo, form.filter)

            queryBuilder.setParameters(filterQuery.getParameters())
            queryBuilder = queryBuilder.where(`c.id IN (${filterQuery.getQuery()})`)
        }

        const order = form.order
        if (order) {
            if (Array.isArray(order)) {
                order.map((o) => {
                    addOrder(o)
                })
            } else {
                addOrder(order)
            }
        }
        queryBuilder = queryBuilder.addOrderBy('c.id')

        if (form?.attributes && !form.attributes.includes('*')) {
            console.log(form?.attributes?.map((attr) => `c.${attr}`).join(', '))
            queryBuilder = queryBuilder.select(form?.attributes?.map((attr) => `c.${attr}`))
        } else {
            queryBuilder = queryBuilder.select()
        }

        if (form?.relations) {
            mapQueryBuilders(repo, form)
            const relationList = generateRelationList(form, 'c')
            relationList.map((rel) => {
                //extract parameters from subquery for joining STI entities
                const parameters = rel.queryBuilder.getParameters()
                queryBuilder.setParameters(parameters)

                if (isUndefined(rel.attrs) || rel.attrs.includes('*')) {
                    queryBuilder.leftJoinAndSelect(
                        rel.key,
                        rel.alias,
                        `${rel.alias}.id IN (${rel.queryBuilder.getQuery()})`,
                    )
                } else {
                    queryBuilder.leftJoin(
                        rel.key,
                        rel.alias,
                        `${rel.alias}.id IN (${rel.queryBuilder.getQuery()})`,
                    )
                    queryBuilder.addSelect(rel.attrs.map((at) => `${rel.alias}.${at}`))
                }
                if (rel.order) {
                    if (Array.isArray(rel.order)) {
                        rel.order.map((o) => {
                            addOrder(o, rel.alias)
                        })
                    } else {
                        addOrder(rel.order, rel.alias)
                    }
                }
            })
        }

        return queryBuilder

        //inner functions
        function addOrder(o, alias?: string) {
            let direction: 'ASC' | 'DESC' = 'ASC'
            let column = o
            if (column.startsWith('-')) {
                column = column.substr(1)
                direction = 'DESC'
            }
            queryBuilder = queryBuilder.addOrderBy(`${alias || 'c'}.${column}`, direction)
        }
    }

    _validateJson(form: QueryForm) {
        const newForm: QueryForm = {
            attributes: [],
        }

        if (form?.attributes && !form.attributes.includes('*')) {
            newForm.attributes = form.attributes
            const thisAttrList = form.attributes.map((attr) => this[attr])
            if (thisAttrList.includes(undefined))
                throw new ForbiddenException('requested field not public or defined')
        } else {
            newForm.attributes = Object.keys(this).filter((keys) => {
                console.log(keys)
                return keys[0] !== '_' && keys[0] !== keys[0].toUpperCase()
            })
        }
        if (form?.relations) {
            newForm.relations = {}
            Object.keys(form.relations).forEach((keys) => {
                if (!this[keys]) throw new ForbiddenException('requested relation not public or defined')
                newForm.relations[keys] = this[keys]._validateJson(form.relations[keys])
            })
        }

        return newForm
    }
}

function generateRelationList(form: QueryForm, rootKey = undefined) {
    let list: {
        key: string
        attrs: string[]
        queryBuilder: QueryBuilder<any>
        order: string | string[]
        alias: string
    }[] = []

    for (const key in form.relations) {
        const node = form.relations[key]
        const theKey = []
        if (rootKey) theKey.push(rootKey)
        const currAlias = uuid()
        theKey.push(key)
        list.push({
            key: `${theKey.slice(0, theKey.length - 1)}.${theKey[theKey.length - 1]}`,
            alias: currAlias,
            attrs: node.attributes,
            queryBuilder: node.queryBuilder,
            order: node.order,
        })
        if (node?.relations) {
            list = list.concat(generateRelationList(node, currAlias))
        }
    }

    return list
}

function mapQueryBuilders(repo: Repository<any>, form: QueryForm) {
    Object.keys(form.relations).map((key) => {
        const relation = repo.metadata.relations.find((rel) => rel.propertyName === key)
        const currentRepo = getConnection().manager.getRepository(relation.type)
        const node = form.relations[key]
        node.queryBuilder = prepareQueryForMetaMapper(currentRepo, node.filter)
        if (node.relations) {
            mapQueryBuilders(currentRepo, node)
        }
    })
}
