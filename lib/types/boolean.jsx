var React = require('react/addons')

var BooleanView = React.createClass({
  change: function (event) {
    this.props.onChange(event.target.checked)
  },
  render: function () {
    return (
      <label>
        {this.props.title}
        <input type='checkbox' checked={this.props.value != null ? this.props.value : this.props.schema.default} onChange={this.change} />
      </label>
    )
  }
})

module.exports = BooleanView
