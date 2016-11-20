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
        const value = this.props.value == null ? this.props.schema.default : this.props.value

        const display = this.props.schema.enumDisplay
          ? (this.props.schema.enumDisplay[_.indexOf(this.props.schema.enum, value)] || '')
          : value
          
        input = display
      } else {
        let options = this.props.schema.default
          ? []
          : [<option key='' value='' />]

        options = options.concat(_.map(this.props.schema.enum, (enumOption, i) => {
          const display = this.props.schema.enumDisplay
            ? this.props.schema.enumDisplay[i]
            : enumOption

          return <option key={enumOption} value={enumOption}>{display}</option>
        }))
        
        input = <select
          autoFocus
          value={this.props.value || this.props.schema.default}
          onFocus={this.props.events.onFocus}
          onChange={this.change.bind(this)}
          disabled={this.props.readOnly}>
          {options}
        </select>
      }
    } else {
      if (this.props.readOnly) {
        input = this.props.value
      } else {
        input = <input
          autoFocus
          type='text'
          placeholder={this.props.schema.default}
          value={this.props.value || ''}
          onFocus={this.props.events.onFocus}
          onChange={this.change.bind(this)} />
      }
    }
    // disabled={this.props.readOnly}

    return (
      <SimpleWrapper
        title={this.props.title}
        utils={this.props.utils}
        description={this.props.description}
        label={this.props.label}
        format={this.props.format}
        events={_.omit(this.props.events, ['onFocus'])}
        className={`string ${this.props.readOnly ? 'readonly' : ''} ${this.props.valid ? 'valid' : 'invalid'} ${this.props.className || ''}`}
        separatorBelow={this.props.schema.separatorBelow}>
        {input}
      </SimpleWrapper>
    )
  }
}
