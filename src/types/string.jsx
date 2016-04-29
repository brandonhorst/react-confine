import _ from 'lodash'
import React from 'react'
import {SimpleWrapper} from '../other/wrappers'

export default class StringView extends React.Component {
  change (event) {
    this.props.onChange(event.target.value.length
      ? event.target.value
      : this.props.schema.default
    )
  }

  render () {
    var input
    if (this.props.readOnly) {
      input = this.props.value
    } else {
      if (this.props.schema.enum) {
        var options = this.props.schema.default ? [] : [<option key='' value='' />]

        options = options.concat(_.map(this.props.schema.enum, (enumOption) => {
          return <option key={enumOption} value={enumOption}>{enumOption}</option>
        }))
        input = <select autoFocus value={this.props.value} onChange={this.change.bind(this)}>{options}</select>
      } else {
        input = <input
          autoFocus
          type='text'
          placeholder={this.props.schema.default}
          value={this.props.value}
          onInput={this.change.bind(this)} />
      }
    }

    return (
      <SimpleWrapper
        title={this.props.title}
        description={this.props.description}
        label={this.props.label}
        format={this.props.format}
        events={this.props.events}
        className={`string ${this.props.readOnly ? ' readonly' : ''}`}>
        {input}
      </SimpleWrapper>
    )
  }
}
