import _ from 'lodash'
import React from 'react'
import {SimpleWrapper} from '../other/wrappers'

export default class StringView extends React.Component {
  change (event) {
    this.props.onChange(event.target.value.length
      ? event.target.value
      : undefined
    )
  }

  render () {
    let input
    if (this.props.schema.enum) {
      if (this.props.readOnly) {
        input = <input
          type='text'
          readOnly
          value={this.props.value || ''} />
      } else {
        let options = this.props.schema.default ? [] : [<option key='' value='' />]

        options = options.concat(_.map(this.props.schema.enum, (enumOption) => {
          return <option key={enumOption} value={enumOption}>{enumOption}</option>
        }))
        
        input = <select
          autoFocus
          value={this.props.value}
          onChange={this.change.bind(this)}
          readOnly={this.props.readOnly}>
          {options}
        </select>
      }
    } else {
      // if (this.props.readOnly) {
      //   input = this.props.value
      // } else {
        input = <input
          autoFocus
          type='text'
          placeholder={this.props.schema.default}
          readOnly={this.props.readOnly}
          value={this.props.value || ''}
          onChange={this.change.bind(this)} />
      // }
    }

    return (
      <SimpleWrapper
        title={this.props.title}
        description={this.props.description}
        label={this.props.label}
        format={this.props.format}
        events={this.props.events}
        className={`string ${this.props.readOnly ? 'readonly' : ''} ${this.props.valid ? 'valid' : 'invalid'}`}>
        {input}
      </SimpleWrapper>
    )
  }
}
