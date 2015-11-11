import _ from 'lodash'
import React from 'react'
import {SimpleWrapper} from '../other/wrappers'

export default class StringView extends React.Component {
  change (event) {
    this.props.onChange(event.target.value.length ? event.target.value : undefined)
  }

  render () {
    var input
    if (this.props.schema.enum) {
      var options = this.props.schema.default ? [] : [<option key='' value='' />]

      options = options.concat(_.map(this.props.schema.enum, (enumOption) => {
        return <option key={enumOption} value={enumOption}>{enumOption}</option>
      }))
      input = <select value={this.props.value} onChange={this.change.bind(this)}>{options}</select>
    } else {
      input = <input type='text' placeholder={this.props.schema.default} value={this.props.value} onChange={this.change.bind(this)} />
    }

    return (
      <SimpleWrapper title={this.props.title} description={this.props.description}>
        {input}
      </SimpleWrapper>
    )
  }
}
