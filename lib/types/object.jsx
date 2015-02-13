var _ = require('lodash')
var React = require('react/addons')

var ObjectView = React.createClass({
  render: function () {
    var self = this
    var trueValue = _.isPlainObject(this.props.value) ? this.props.value : {}
    var propComponents = _.map(this.props.schema.properties, function (schema, propName) {
      function onChange (newChildValue) {
        var updater = {}
        updater[propName] = {'$set': newChildValue}

        var newValue = React.addons.update(trueValue, updater)
        self.props.onChange(newValue)
      }
      return <self.props.utils.Element key={propName} schema={schema}
        value={trueValue[propName]} onChange={onChange}
        propName={propName} utils={self.props.utils} />
    })

    return (
      <fieldset className='properties'>
        <legend>{this.props.title}</legend>
        {propComponents}
      </fieldset>
    )
  }
})

module.exports = ObjectView
