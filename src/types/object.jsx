import _ from 'lodash'
import React from 'react'
import {ComplexWrapper} from '../other/wrappers'

export default class ObjectView extends React.Component {
  onChange (propName, newChildValue) {
    const newValue = _.assign({}, this.props.value, {[propName]: newChildValue})

    this.props.onChange(newValue)

  }

  render () {
    var trueValue = _.isPlainObject(this.props.value) ? this.props.value : {}
    var propComponents = _.map(this.props.schema.properties, (schema, propName) => {
      return (
        <div className='object-property' key={propName}>
          <this.props.utils.Element schema={schema} label={this.props.label} readOnly={this.props.readOnly}
            value={trueValue[propName]} onChange={this.onChange.bind(this, propName)}
            propName={propName} utils={this.props.utils} />
        </div>
      )
    })

    return (

      <ComplexWrapper title={this.props.title} className='object' description={this.props.description} format={this.props.format} label={this.props.label}>
        <div className='object-properties'>
          {propComponents}
        </div>
      </ComplexWrapper>
    )
  }
}
