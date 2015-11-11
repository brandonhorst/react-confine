var _ = require('lodash')
var Confine = require('confine')
var React = require('react')
var ElementView = require('./element')

var typeComponents = {
  array: require('./types/array'),
  boolean: require('./types/boolean'),
  integer: require('./types/number'),
  number: require('./types/number'),
  object: require('./types/object'),
  string: require('./types/string')
}

export default class ConfineView extends React.Component {
  change (newValue) {
    this.props.onChange(this.props.confine.normalize(newValue, this.props.schema))
  }

  render () {
    if (this.props.confine.validateSchema(this.props.schema)) {
      var types = _.assign(typeComponents, this.props.customTypes)
      return <ElementView schema={this.props.schema} value={this.props.value}
        onChange={this.change.bind(this)}
        utils={{confine: this.props.confine, Element: ElementView, types: types}} />
    } else {
      return <div>'Invalid Schema'</div>
    }
  }
}

ConfineView.defaultProps = {
  customTypes: {}
}
