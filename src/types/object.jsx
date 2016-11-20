import _ from 'lodash'
import React from 'react'
import {SimpleWrapper, ComplexWrapper} from '../other/wrappers'

export default class ObjectView extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  onChange (propName, newChildValue) {
    const newValue = _.assign({}, this.props.value, {[propName]: newChildValue})

    this.props.onChange(newValue)
  }

  openSheet () {
    this.setState({sheetVisible: true})
    this.props.utils.extras.disable()
  }

  closeSheet () {
    this.setState({sheetVisible: false})
    this.props.utils.extras.reenable()
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

    if (this.props.schema.sheet) {
      let buttonTitle = `${this.props.title}...`
      let buttonLabel = ''
      if (this.props.schema.buttonFormat === 'edit') {
        buttonTitle = 'Edit...'
        buttonLabel = this.props.title
      }

      return (
        <div>
          <div className={`sheet ${this.state.sheetVisible ? 'visible' : ''}`}>
            <div className='object-properties'>
              {propComponents}
            </div>
            <button className='sheet-close-button' onClick={this.closeSheet.bind(this)}>Done</button>
          </div>
          <SimpleWrapper
            buttonMode
            utils={this.props.utils}
            description={this.props.schema.buttonDescription}
            className='sheet-button'
            label={this.props.label}
            title={buttonLabel}
            separatorBelow={this.props.schema.separatorBelow}>
            <button className='sheet-button' onClick={this.openSheet.bind(this)}>{buttonTitle}</button>
          </SimpleWrapper>
        </div>
      )
    }

    return (
      <ComplexWrapper
        title={this.props.title}
        className='object'
        description={this.props.description}
        format={this.props.format}
        utils={this.props.utils}
        label={this.props.label}>
        <div className='object-properties'>
          {propComponents}
        </div>
      </ComplexWrapper>
    )
  }
}
