var _ = require('lodash')
var React = require('react')

// Cannot yet handle custom types
export default class ElementView extends React.Component {
  validate () {
    return (
      (this.props.schema.default && _.isUndefined(this.props.value)) ||
      this.props.utils.confine.validate(this.props.value, this.props.schema)
    )
  }

  render () {
    if (!this.props.utils.confine.validateSchema(this.props.schema)) {
      return <div className="invalid">Invalid Schema</div>
    }

    var TypeComponent = this.props.utils.types[this.props.schema.type]
    var title = this.props.schema.title || _.startCase(this.props.propName)
    var valid = this.validate()

    return (
      <div className={this.props.schema.type + (valid ? '' : ' invalid')}>
          <TypeComponent schema={this.props.schema} valid={valid} title={title}
            description={this.props.schema.description}
            onChange={this.props.onChange} value={this.props.value}
            utils={this.props.utils}/>
      </div>
    )
  }
}
