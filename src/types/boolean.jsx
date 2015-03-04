var React = require('react/addons')
var SimpleWrapper = require('../other/wrappers').Simple

var BooleanView = React.createClass({
  change: function (event) {
    this.props.onChange(event.target.checked)
  },
  render: function () {
    return (
      <SimpleWrapper title={this.props.title} description={this.props.description}>
        <input type='checkbox' checked={this.props.value != null ? this.props.value : this.props.schema.default} onChange={this.change} />
      </SimpleWrapper>
    )
  }
})

module.exports = BooleanView
