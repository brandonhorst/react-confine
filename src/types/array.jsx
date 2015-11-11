var _ = require('lodash')
var React = require('react')
import {ComplexWrapper} from '../other/wrappers'

export default class ArrayView extends React.Component {
  insert () {
    var newValue = this.props.utils.confine.normalize(undefined, this.props.schema.items)
    var trueValue = _.isArray(this.props.value) ? this.props.value : []
    this.props.onChange(trueValue.concat([newValue]))
  }

  render () {
    var trueValue = _.isArray(this.props.value) ? this.props.value : []

    var itemComponents = _.chain(0).range(trueValue.length).map(i => {
      const onChange = newChildValue => {
        const newValue = _.assign([], trueValue, {[i]: newChildValue})
        this.props.onChange(newValue)
      }

      const onDelete = () => {
        const newValue = _.slice(trueValue, 0, i).concat(_.slice(trueValue, i+1))
        this.props.onChange(newValue)
      }

      return (
        <div key={i}>
          <this.props.utils.Element schema={this.props.schema.items}
            value={trueValue[i]} onChange={onChange}
            utils={this.props.utils} />
          <button onClick={onDelete} className='close-button'>×</button>
        </div>
      )
    }).value()

    return (
      <ComplexWrapper title={this.props.title} description={this.props.description}>
        {itemComponents}
        <button onClick={this.insert.bind(this)} className='add-button'>+</button>
      </ComplexWrapper>
    )
  }
}
