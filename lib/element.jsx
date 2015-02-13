var React = require('react/addons')

var typeComponents = {
  array: require('./types/array.jsx'),
  boolean: require('./types/boolean.jsx'),
  integer: require('./types/number.jsx'),
  number: require('./types/number.jsx'),
  object: require('./types/object.jsx'),
  string: require('./types/string.jsx')
}

function humanize(propName) {
  return propName.replace(/[A-Z]/g, function (match) {
    return ' ' + match
  }).replace(/^\w/, function (match) {
    return match.toUpperCase()
  })
}

// Cannot yet handle custom types
var ElementView = React.createClass({
  validate: function () {
    return this.props.utils.confine.validate(this.props.value, this.props.schema)
  },
  render: function () {
    if (!this.props.utils.confine.validateSchema(this.props.schema)) {
      return <div className="invalid">Invalid Schema</div>
    }

    var TypeComponent = typeComponents[this.props.schema.type]
    var title = this.props.schema.title || humanize(this.props.propName || '')
    var valid = this.validate()

    return (
      <div className={this.props.schema.type + (valid ? '' : ' invalid')}>
          <TypeComponent schema={this.props.schema} valid={valid} title={title}
            onChange={this.props.onChange} value={this.props.value}
            utils={this.props.utils}/>
      </div>
    )
  }
})

module.exports = ElementView
