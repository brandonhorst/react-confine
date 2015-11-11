var _ = require('lodash')
var React = require('react')
import {ComplexWrapper} from '../other/wrappers'

export default class ObjectView extends React.Component {
  render () {
    var trueValue = _.isPlainObject(this.props.value) ? this.props.value : {}
    var propComponents = _.map(this.props.schema.properties, (schema, propName) => {
      const onChange = newChildValue => {
        const newValue = _.assign({}, trueValue, {[propName]: newChildValue})

        this.props.onChange(newValue)
      }

      return <this.props.utils.Element key={propName} schema={schema}
        value={trueValue[propName]} onChange={onChange}
        propName={propName} utils={this.props.utils} />
    })

    return (
      <ComplexWrapper title={this.props.title} description={this.props.description}>
        {propComponents}
      </ComplexWrapper>
    )
  }
}
