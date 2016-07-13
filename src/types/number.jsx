import _ from 'lodash'
import React from 'react'
import {SimpleWrapper} from '../other/wrappers'

function filterFloat (value) {
  if (/^(\-|\+)?([0-9]+?(\.[0-9]+)?(e(\-|\+)[0-9]+)?)$/.test(value)) return Number(value)
  return NaN;
}

function filterInt (value) {
  if (/^(\-|\+)?([0-9]+)$/.test(value)) return Number(value)
  return NaN;
}

export default class NumberView extends React.Component {
  change (event) {
    var filter = this.props.schema.type === 'integer' ? filterInt : filterFloat
    var numVal = filter(event.target.value)

    if (Number.isNaN(numVal)) {
      this.props.onChange(event.target.value === '' ? undefined : event.target.value)
    } else {
      this.props.onChange(numVal)
    }
  }

  render () {
    return (
      <SimpleWrapper
        title={this.props.title}
        description={this.props.description}
        className={`number ${this.props.readOnly ? 'readonly' : ''} ${this.props.valid ? 'valid' : 'invalid'}`}
        format={this.props.format}
        label={this.props.label}
        separatorBelow={this.props.schema.separatorBelow}>
        <input type='number'
          min={this.props.schema.min}
          max={this.props.schema.max}
          value={this.props.value || ''}
          onChange={this.change.bind(this)}
          placeholder={this.props.schema.default} />
      </SimpleWrapper>
    )
  }
}
