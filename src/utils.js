import _ from 'lodash'

export function getTitle(schema, propName) {
  return schema.title || _.startCase(propName)
}