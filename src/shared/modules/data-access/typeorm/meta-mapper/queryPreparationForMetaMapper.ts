import {Repository} from 'typeorm'
import {isString} from '@nestjs/common/utils/shared.utils'

/**
 *
 * @param repo
 * @param filters
 */
export function prepareQueryForMetaMapper(repo: Repository<any>, filters?: Record<string, any>) {
    let queryBuilder = repo.createQueryBuilder('c').select('c.id')

    if (!filters) return queryBuilder

    const flattened = flattenFilters(filters)

    const counts: { key: string; condition: string; value: string }[] = []

    const customFilters: string = flattened
        .map((f) => {
            let value = f[f.length - 1]
            const fields = []
            let preQuery = ''
            let count = false
            let operator = ''
            f.slice(1, f.length - 1).map((fi) => {
                fi = fi.replace(/[\[\]]/g, '')
                if (!fi.startsWith('$')) {
                    fields.push(fi)
                } else {
                    let word = fi.split('$')[1]
                    if (word === 'not') {
                        preQuery += ` ${word}`
                    } else if (word === 'count') {
                        count = true
                    } else {
                        switch (word) {
                            case 'gt': {
                                word = '>'
                                break
                            }
                            case 'lt': {
                                word = '<'
                                break
                            }
                            case 'gte': {
                                word = '>='
                                break
                            }
                            case 'lte': {
                                word = '<='
                                break
                            }
                        }
                        operator = `${operator} ${word}`
                    }
                }
            })
            if (operator.length === 0) {
                operator += ' ='
            }

            let latestKey = null

            if (Array.isArray(value)) {
                operator = 'IN'
                value = `(${value.map((v) => (isString(v) ? `'${v}'` : v)).join(',')})`
            } else if (value && value.toLowerCase() === 'null') {
                operator = 'IS'
            } else {
                value = `'${value}'`
            }

            for (let i = 1; i < fields.length; i++) {
                //load queried relations
                let path = 'c'
                let j
                for (j = 0; j < i; j++) {
                    path = `${path}.${fields[j]}`
                }
                const keys = path.split('.')
                const key = `${keys.slice(0, keys.length - 1).join('_')}.${keys[keys.length - 1]}`
                const alias = path.split('.').join('_')

                //skip existing joints
                if (queryBuilder.getQuery().indexOf(`\`${alias}\` ON \`${alias}\``) === -1) {
                    queryBuilder = queryBuilder.innerJoin(key, alias)
                }
                latestKey = alias
            }

            if (count) {
                if (latestKey) {
                    counts.push({key: latestKey, value: value, condition: operator})
                } else {
                }
                return ''
            } else {
                const _fields = operator.includes("like") ? `LOWER(c.${fields.join('.')})` : `c.${fields.join('.')}`;
                const _value = operator.includes("like") ? value.toLowerCase() : value;
                const query = `${preQuery} ${
                    latestKey ? `${latestKey}.${fields[fields.length - 1]}` : _fields
                } ${operator} ${_value}`

                if (f[0] === '$and') {
                    return `AND ${query}`
                } else if (f[0] === '$or') {
                    return `OR ${query}`
                }
            }
        })
        .join(' ')

    if (customFilters.trim().length > 0) {
        queryBuilder = queryBuilder.andWhere(`(${customFilters.substring(customFilters.indexOf(' '))})`)
    }

    if (counts.length > 0) {
        const havingString = `(${counts
            .map((count) => {
                return `COUNT(\`${count.key}\`.id) ${count.condition} ${count.value}`
            })
            .join(' AND ')})`
        queryBuilder = queryBuilder.groupBy('c.id').having(havingString)
    }

    return queryBuilder
}

/***
 * Split all filters into different queries
 * @param filter Filter object to split
 */
export function flattenFilters(filter) {
    const result = []

    const route = (subObj, path = []) => {
        let keyIndex = 0
        const keys = Object.keys(subObj)
        if (typeof subObj === 'object' && !Array.isArray(subObj) && keys.length > 0) {
            while (keyIndex < keys.length) {
                route(subObj[keys[keyIndex]], [...path, keys[keyIndex]])
                keyIndex++
            }
        } else {
            result.push([...path, subObj])
        }
    }
    route(filter)
    return result
}
