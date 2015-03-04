var _ = require('lodash')
var React = require('react/addons')

var typeComponents = {
  array: require('./types/array'),
  boolean: require('./types/boolean'),
  integer: require('./types/number'),
  number: require('./types/number'),
  object: require('./types/object'),
  string: require('./types/string')
}

// Cannot yet handle custom types
var ElementView = React.createClass({
  validate: function () {
    return (
      (this.props.schema.default && _.isUndefined(this.props.value)) ||
      this.props.utils.confine.validate(this.props.value, this.props.schema)
    )
  },
  render: function () {
    if (!this.props.utils.confine.validateSchema(this.props.schema)) {
      return <div className="invalid">Invalid Schema</div>
    }

    var TypeComponent = typeComponents[this.props.schema.type]
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
})

module.exports = ElementView
