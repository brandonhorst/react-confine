import _ from 'lodash'
import Confine from 'confine'
import React from 'react'
import ElementView from './element'

var typeComponents = {
  array: require('./types/array').default,
  boolean: require('./types/boolean').default,
  integer: require('./types/number').default,
  number: require('./types/number').default,
  object: require('./types/object').default,
  string: require('./types/string').default
}

export class ConfineView extends React.Component {
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

export {SimpleWrapper, ComplexWrapper} from './other/wrappers'
