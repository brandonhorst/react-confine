var _ = require('lodash')
var Confine = require('confine')
var React = require('react/addons')
var ElementView = require('./element.jsx')

var ConfineView = React.createClass({
  getDefaultProps: function () {
    return {customTypes: {}}
  },
  getInitialState: function () {
    return {
      value: this.props.confine.normalize(this.props.defaultValue, this.props.schema)
    }
  },
  change: function (newValue) {
    this.setState({
      value: newValue
    })
    if (this.props.confine.validate(newValue, this.props.schema)) {
      this.props.onChange(this.props.confine.normalize(newValue, this.props.schema))
    }
  },
  render: function () {
    if (this.props.confine.validateSchema(this.props.schema)) {
      return <ElementView schema={this.props.schema} value={this.state.value}
        onChange={this.change} utils={{confine: this.props.confine, Element: ElementView}} />
    } else {
      return 'Invalid Schema'
    }
  }
})

module.exports = ConfineView
