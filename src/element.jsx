import React from 'react'
import { getTitle } from './utils'

export default class ElementView extends React.Component {
  validate () {
    return (
      (!_.isUndefined(this.props.schema.default) && this.props.value == null) ||
      this.props.utils.confine.validate(this.props.value, this.props.schema)
    )
  }

  render () {
    if (!this.props.utils.confine.validateSchema(this.props.schema)) {
      return <div className="invalid">Invalid Schema</div>
    }

    var TypeComponent = this.props.utils.types[this.props.schema.type]
    var title = getTitle(this.props.schema, this.props.propName)
    var valid = this.validate()
    
    return <TypeComponent
      value={this.props.value}
      events={this.props.events}
      label={this.props.label}
      utils={this.props.utils}
      schema={this.props.schema}
      title={title}
      description={this.props.schema.description}
      valid={valid}
      readOnly={this.props.readOnly}
      onChange={this.props.onChange}
      format={this.props.schema.format || 'default'} />
  }
}

ElementView.defaultProps = {
  label: true,
  readOnly: false,
  events: {}
}
