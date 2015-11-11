var React = require('react')
import {SimpleWrapper} from '../other/wrappers'


export default class BooleanView extends React.Component {
  change (event) {
    this.props.onChange(event.target.checked)
  }

  render () {
    return (
      <SimpleWrapper title={this.props.title} description={this.props.description}>
        <input type='checkbox' checked={this.props.value != null ? this.props.value : this.props.schema.default} onChange={this.change.bind(this)} />
      </SimpleWrapper>
    )
  }
}
