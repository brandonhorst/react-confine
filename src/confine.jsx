var _ = require('lodash')
var Confine = require('confine')
var React = require('react/addons')
var ElementView = require('./element')

var ConfineView = React.createClass({
  getDefaultProps: function () {
    return {customTypes: {}}
  },
  change: function (newValue) {
    this.props.onChange(this.props.confine.normalize(newValue, this.props.schema))
  },
  render: function () {
    if (this.props.confine.validateSchema(this.props.schema)) {
      return <ElementView schema={this.props.schema} value={this.props.value}
        onChange={this.change} utils={{confine: this.props.confine, Element: ElementView}} />
    } else {
      return <div>'Invalid Schema'</div>
    }
  }
})

module.exports = ConfineView
