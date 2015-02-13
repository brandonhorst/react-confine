var _ = require('lodash')
var React = require('react/addons')

var StringView = React.createClass({
  change: function (event) {
    this.props.onChange(event.target.value.length ? event.target.value : null)
  },
  render: function () {
    var self = this
    var input
    if (this.props.schema.enum) {
      var options = this.props.schema.default ? [] : [<option key='' value='' />]

      options = options.concat(_.map(this.props.schema.enum, function (enumOption) {
        return <option key={enumOption} value={enumOption}>{enumOption}</option>
      }))
      input = <select value={this.props.value} onChange={this.change}>{options}</select>
    } else {
      input = <input type='text' placeholder={this.props.schema.default} value={this.props.value} onChange={this.change} />
    }

    return (
      <label>
        {this.props.title}
        {input}
      </label>
    )
  }
})

module.exports = StringView
