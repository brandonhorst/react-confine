var _ = require('lodash')
var React = require('react/addons')
var ComplexWrapper = require('../other/wrappers').Complex

var ArrayView = React.createClass({
  insert: function () {
    var newValue = this.props.utils.confine.normalize(undefined, this.props.schema.items)
    var trueValue = _.isArray(this.props.value) ? this.props.value : []
    this.props.onChange(trueValue.concat([newValue]))
  },
  render: function () {
    var self = this
    var trueValue = _.isArray(this.props.value) ? this.props.value : []

    var itemComponents = _.chain(0).range(trueValue.length).map(function (i) {
      function onChange(newChildValue) {
        var updater = {$splice: [[i, 1, newChildValue]]}
        var newValue = React.addons.update(trueValue, updater)
        self.props.onChange(newValue)
      }

      function onDelete() {
        var updater = {$splice: [[i, 1]]}
        var newValue = React.addons.update(trueValue, updater)
        self.props.onChange(newValue)
      }

      return (
        <div key={i}>
          <self.props.utils.Element schema={self.props.schema.items}
            value={trueValue[i]} onChange={onChange}
            utils={self.props.utils} />
          <button onClick={onDelete} className='close-button'>×</button>
        </div>
      )
    }).value()

    return (
      <ComplexWrapper title={this.props.title} description={this.props.description}>
        {itemComponents}
        <button onClick={this.insert} className='add-button'>+</button>
      </ComplexWrapper>
    )
  }
})

module.exports = ArrayView
