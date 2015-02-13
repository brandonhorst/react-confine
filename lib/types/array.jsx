var _ = require('lodash')
var React = require('react/addons')

var ArrayView = React.createClass({
  insert: function () {
    var newValue = this.props.utils.confine.getDefault(this.props.schema.items)
    this.props.onChange(this.props.value.concat([newValue]))
  },
  render: function () {
    var self = this

    var itemComponents = _.chain(0).range(this.props.value.length).map(function (i) {
      function onChange(newChildValue) {
        var updater = {$splice: [[i, 1, newChildValue]]}
        var newValue = React.addons.update(self.props.value, updater)
        self.props.onChange(newValue)
      }

      function onDelete() {
        var updater = {$splice: [[i, 1]]}
        var newValue = React.addons.update(self.props.value, updater)
        self.props.onChange(newValue)
      }

      return (
        <div key={i}>
          <self.props.utils.Element schema={self.props.schema.items}
            value={self.props.value[i]} onChange={onChange}
            utils={self.props.utils} />
          <button onClick={onDelete} className='close-button'>×</button>
        </div>
      )
    }).value()

    return (
      <fieldset className='items'>
        <legend>{this.props.title}</legend>
        {itemComponents}
        <button onClick={this.insert} className='add-button'>+</button>
      </fieldset>
    )
  }
})

module.exports = ArrayView
