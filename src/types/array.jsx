import _ from 'lodash'
import React from 'react'
import {ComplexWrapper} from '../other/wrappers'
import {getTitle} from '../utils'

export default class ArrayView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.keyDownBound = this.keyDown.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keyDownBound)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keyDownBound)
  }

  itemIsObject () {
    return this.props.schema.items.type === 'object'
  }
  
  insert () {
    const newIndex = this.props.value.length
    if (this.itemIsObject()) {
      const firstKey = _.keys(this.props.schema.items.properties)[0]
      this.setState({
        writable: {index: newIndex, key: firstKey},
        selection: newIndex
      })
    } else {
      this.setState({
        writable: {index: newIndex},
        selection: newIndex
      })
    }

    const newValue = this.props.utils.confine.normalize(undefined, this.props.schema.items)
    this.props.onChange(this.props.value.concat([newValue]))
  }

  change (index, key, newChildValue) {
    let result
    if (this.itemIsObject()) {
      const newValue = _.assign({}, this.props.value[index], {[key]: newChildValue})
      result = _.assign([], this.props.value, {[index]: newValue})
    } else {
      result = _.assign([], this.props.value, {[index]: newChildValue})
    }
    this.props.onChange(result)
  }

  delete (index) {
    const newValue = _.slice(this.props.value, 0, index).concat(_.slice(this.props.value, index + 1))
    this.props.onChange(newValue)
  }

  dragStart (index, e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('confine/item', JSON.stringify(this.props.value[index]));

    //dummy node
    this.dummyNode = e.currentTarget.cloneNode(true)
    this.dummyNode.style.position = 'absolute'
    this.dummyNode.style.top = '-10000px'
    e.currentTarget.parentNode.appendChild(this.dummyNode)
    e.dataTransfer.setDragImage(this.dummyNode, 0, 0)

    this.setState({dragging: index, selection: null, writable: null})
  }

  dragEnd (e) {
    if (this.state.hoverOver != null) {
      const data = _.clone(this.props.value)
      const from = this.state.dragging
      const to = this.state.hoverOver + (this.state.hoverPosition === 'top' ? 0 : 1)
      const index = from < to ? to - 1 : to
      data.splice(index, 0, data.splice(from, 1)[0])
      this.props.onChange(data)
    }

    this.setState({hoverOver: undefined, dragging: undefined, hoverPosition: undefined})

     //dummy node
    this.dummyNode.remove()
    delete this.dummyNode
  }

  dragOver (index, e) {
    if (this.state.dragging != null) {
      if (this.state.dragging === index) {
        this.setState({hoverOver: undefined, hoverPosition: undefined})
      } else {
        const rect = e.currentTarget.getBoundingClientRect()
        const position = (e.clientY >= rect.top + (rect.height / 2)) ? 'bottom' : 'top'
        this.setState({hoverOver: index, hoverPosition: position}) 
      }
    }
  }

  makeWritable (index, key) {
    if (this.itemIsObject()) {
      this.setState({writable: {index, key}})
    } else {
      this.setState({writable: {index}})
    }
  }

  checkTab (index, key, event) {
    if (event.keyCode === 9) { // tab
      if (this.itemIsObject()) {
        const keys = _.keys(this.props.schema.items.properties)
        const thisKeyIndex = _.indexOf(keys, key)
        const nextKeyIndex = event.shiftKey ? thisKeyIndex - 1 : thisKeyIndex + 1
        const nextKey = keys[nextKeyIndex]

        if (nextKey == null) {
          this.setState({writable: undefined})
        } else {
          this.setState({writable: {index, key: nextKey}})
        }

      } else {
        this.setState({writable: undefined})
      }
      event.preventDefault()
    } else if (event.keyCode === 13) { 
      this.setState({writable: undefined})
      event.preventDefault()
    }
  }

  select (index, event) {
    if (this.state.selection !== index) {
      this.setState({selection: index, writable: undefined})
    }
  }

  keyDown (event) {
    if (this.state.selection != null) {
      if (event.keyCode === 38) { // up
        this.select(Math.max(this.state.selection - 1, 0))
        event.preventDefault()
      } else if (event.keyCode === 40) { // down
        this.select(Math.min(this.state.selection + 1, this.props.value.length - 1))
        event.preventDefault()
      }
    }
  }

  render () {
    const trueValue = _.isArray(this.props.value) ? this.props.value : []
    const items = _.map(trueValue, (value, i) => {
      let liChildren
      if (this.props.schema.items.type === 'object') {
        liChildren = _.map(this.props.schema.items.properties, (prop, key) => {
          return <this.props.utils.Element schema={prop} key={i + key}
            events={{
              onDoubleClick: this.makeWritable.bind(this, i, key),
              onKeyDown: this.checkTab.bind(this, i, key)
            }}
            value={value[key]} onChange={this.change.bind(this, i, key)}
            label={false}
            readOnly={!_.isEqual(this.state.writable, {index: i, key})}
            utils={this.props.utils} />
        })
      } else {
        liChildren = <this.props.utils.Element
          schema={this.props.schema.items}
          events={{
            onDoubleClick: this.makeWritable.bind(this, i, null),
            onKeyDown: this.checkTab.bind(this, i, null)
          }}
          value={value}
          onChange={this.change.bind(this, i, null)}
          label={false}
          readOnly={!_.isEqual(this.state.writable, {index: i})}
          utils={this.props.utils} />
      }
      return (
        <li key={i}
          className={`array-item${this.state.selection === i ? ' selected' : ''}${this.state.hoverOver === i ? ` hover-${this.state.hoverPosition}` : ''}`}
          onClick={this.select.bind(this, i)}
          draggable onDragStart={this.dragStart.bind(this, i)}
          onDragEnd={this.dragEnd.bind(this)} onDragOver={this.dragOver.bind(this, i)}>
          {liChildren}
        </li>
      )
    })

    let headers
    if (this.props.schema.items.type === 'object') {
      headers = _.map(this.props.schema.items.properties, (val, key) => {
        return <div className='array-header' key={key} style={{width: `${val.size}%`}}>{getTitle(val, key)}</div>
      })
    } else {
      headers = <div className='array-header'>{this.props.schema.items.title}</div>
    } 

    return (
      <ComplexWrapper title={this.props.title} description={this.props.description} className='array' format={this.props.format} label>
        <div className='array-contents'>
          <div className='array-headers'>{headers}</div>
          <ul className='array-items'>
            {items}
          </ul>
        </div>
        <div className='array-buttons'>
          <button onClick={this.insert.bind(this)} className='array-add-button'>+</button>
          <button onClick={this.delete.bind(this, this.state.selection)} className='array-delete-button' disabled={this.state.selection == null}>−</button>
        </div>
      </ComplexWrapper>
    )
    // } else if (this.props.format === 'table') {
    //   let headers
    //   if (this.props.schema.items.type === 'object') {
    //     headers = _.map(this.props.schema.items.properties, (val, key) => {
    //       return <th>{key}</th>
    //     })
    //   } else {
    //     headers = <th>{this.props.schema.items.title}</th>
    //   }

    //   return (
    //     <ComplexWrapper title={this.props.title} description={this.props.description} className='array' format={this.props.format}>
    //       <table>
    //         <thead>
    //           {headers}
    //         </thead>
    //         <tbody>
    //           {itemComponents}
    //         </tbody>
    //       </table>
    //       <button onClick={this.deleteSelection.bind(this)} className='array-delete-button'>+</button>
    //       <button onClick={this.insert.bind(this)} className='array-add-button'>+</button>
    //     </ComplexWrapper>
    //   )
    // }
  }
}
