var _ = require('lodash')
var React = require('react/addons')
var SimpleWrapper = require('../other/wrappers').Simple

function filterFloat (value) {
  if (/^(\-|\+)?([0-9]+?(\.[0-9]+)?(e(\-|\+)[0-9]+)?)$/.test(value)) return Number(value)
  return NaN;
}

function filterInt (value) {
  if (/^(\-|\+)?([0-9]+)$/.test(value)) return Number(value)
  return NaN;
}

var NumberView = React.createClass({
  change: function (event) {
    var filter = this.props.schema.type === 'integer' ? filterInt : filterFloat
    var numVal = filter(event.target.value)

    if (Number.isNaN(numVal)) {
      this.props.onChange(event.target.value)
    } else {
      this.props.onChange(numVal)
    }
  },
  render: function () {
    return (
      <SimpleWrapper title={this.props.title} description={this.props.description}>
        <input type='number' min={this.props.schema.min} max={this.props.schema.max} value={this.props.value} onChange={this.change} placeholder={this.props.schema.default} />
      </SimpleWrapper>
    )
  }
})

module.exports = NumberView
