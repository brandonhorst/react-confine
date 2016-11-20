import _ from 'lodash'
import React from 'react'
import {SimpleWrapper} from '../other/wrappers'

export default class BooleanView extends React.Component {
  change (event) {
    this.props.onChange(event.target.checked)
  }

  render () {
    // const examplesMD = this.props.schema.examples || []
    // const examplesHTML = _.chain(examplesMD)
    //   .map(example => convert(example))
    //   .join('')
    //   .value()

    // if (this.props.format === 'feature-enable') {
    //   return (
    //     <SimpleWrapper
    //       title={this.props.title}
    //       description={this.props.description}
    //       className='boolean'
    //       format={this.props.format}
    //       label={this.props.label}
    //       separatorBelow={this.props.schema.separatorBelow}>
    //       <div className='checkbox-with-example'>
    //         <input type='checkbox'
    //           checked={this.props.value != null ? this.props.value : this.props.schema.default}
    //           onChange={this.change.bind(this)} />
    //         <div className='addon-examples' dangerouslySetInnerHTML={{__html: examplesHTML}} />
    //       </div>
    //     </SimpleWrapper>
    //   )
    // } else {
      return (
        <SimpleWrapper
          title={this.props.schema.label}
          description={this.props.description}
          className='boolean'
          format={this.props.format}
          label={this.props.label}
          examples={this.props.schema.examples}
          utils={this.props.utils}
          separatorBelow={this.props.schema.separatorBelow}>
          <input type='checkbox'
            checked={this.props.value != null ? this.props.value : this.props.schema.default}
            onChange={this.change.bind(this)} />
          {this.props.title ? <div className='label'>{this.props.title}</div> : null}
        </SimpleWrapper>
      )
    // }
  }
}
