import _ from 'lodash'
import React from 'react'
import {SimpleWrapper, ComplexWrapper} from '../other/wrappers'
import {findDOMNode} from 'react-dom'
import {getTitle} from '../utils'

export default class ArrayView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.keyDownBound = this.keyDown.bind(this)
  }

  componentDidMount () {
    if (!window.__react_confine_arrays__) {
      window.__react_confine_arrays__ = []
    }
    window.__react_confine_arrays__.push(this)
    document.addEventListener('keydown', this.keyDownBound)
  }

  componentWillUnmount () {
    _.pull(window.__react_confine_arrays__, this)
    document.removeEventListener('keydown', this.keyDownBound)
  }

  unfocus () {
    this.setState({selection: null})
  }

  handleFocus (e) {
    const target = e.target
    setTimeout(() => {
      target.select()
    }, 0)
  }

  itemIsObject () {
    return this.props.schema.items.type === 'object'
  }

  trueValue () {
    return this.props.value || this.props.schema.default || []
  }
  
  insert () {
    const value = this.trueValue()
    const newIndex = value.length

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

    // The map with identity converts array-like objects into actual arrays
    const newValue = _.chain(value).map(_.identity).concat(undefined).value()
    this.props.onChange(newValue)
  }

  change (index, key, newChildValue) {
    let result
    const value = this.trueValue()
    if (this.itemIsObject()) {
      const newValue = _.assign({}, value[index], {[key]: newChildValue})
      result = _.assign([], value, {[index]: newValue})
    } else {
      result = _.assign([], value, {[index]: newChildValue})
    }
    this.props.onChange(result)
  }

  delete (index) {
    const value = this.trueValue()
    const newValue = _.slice(value, 0, index).concat(_.slice(value, index + 1))
    this.props.onChange(newValue)
  }

  dragStart (index, e) {
    const value = this.trueValue()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('confine/item', JSON.stringify(value[index]))

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
      const value = this.trueValue()
      const data = _.clone(value)
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
      this.setState({writable: {index, key}, shouldSelectWritable: true})
    } else {
      this.setState({writable: {index}, shouldSelectWritable: false})
    }
  }

  openSheet () {
    this.setState({sheetVisible: true})
    this.props.utils.extras.disable()
  }

  closeSheet () {
    this.setState({sheetVisible: false})
    this.props.utils.extras.reenable()
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
    const allArrays = _.without(window.__react_confine_arrays__, this)
    _.forEach(allArrays, array => array.unfocus())

    if (this.state.selection !== index) {
      this.setState({selection: index, writable: undefined})
    }
  }

  keyDown (event) {
    const value = this.trueValue()
    if (this.state.selection != null) {
      if (event.keyCode === 38) { // up
        this.select(Math.max(this.state.selection - 1, 0))
        event.preventDefault()
      } else if (event.keyCode === 40) { // down
        this.select(Math.min(this.state.selection + 1, value.length - 1))
        event.preventDefault()
      }
    }

    if (this.state.sheetVisible && event.keyCode === 27) { //esc
      this.closeSheet()
      event.preventDefault()
    }
  }

  render () {
    const trueValue = this.trueValue()
    let items
    if (trueValue.length === 0) {
      items = (
        <li className='array-item'>
          No Entries...
        </li>
      )
    } else {
      items = _.map(trueValue, (value, i) => {
        let liChildren
        if (this.props.schema.items.type === 'object') {
          liChildren = _.map(this.props.schema.items.properties, (prop, key) => {
            const events={
              onClick: this.state.selection === i
                ? this.makeWritable.bind(this, i, key)
                : undefined,
              onFocus: this.handleFocus.bind(this),
              onKeyDown: this.checkTab.bind(this, i, key)
            }
            const writable = _.isEqual(this.state.writable, {index: i, key})
            return <this.props.utils.Element
              schema={prop}
              key={i + key}
              className={`array-item-width-${prop.size}`}
              events={events}
              value={value ? value[key] : undefined}
              onChange={this.change.bind(this, i, key)}
              label={false}
              readOnly={!writable}
              utils={this.props.utils} />
          })
        } else {
          let ref
          const events={
            onClick: this.state.selection === i
              ? this.makeWritable.bind(this, i, null)
              : undefined,
            onFocus: this.handleFocus.bind(this),
            onKeyDown: this.checkTab.bind(this, i, null)
          }
          const writable = _.isEqual(this.state.writable, {index: i})
          liChildren = <this.props.utils.Element
            schema={this.props.schema.items}
            events={events}
            className='array-item-width-16'
            value={value}
            onChange={this.change.bind(this, i, null)}
            label={false}
            readOnly={!writable}
            utils={this.props.utils} />
        }
        return (
          <li key={i}
            className={`array-item${this.state.selection === i ? ' selected' : ''}${this.state.hoverOver === i ? ` hover-${this.state.hoverPosition}` : ''}`}
            onClick={this.select.bind(this, i)}
            draggable
            onDragStart={this.dragStart.bind(this, i)}
            onDragEnd={this.dragEnd.bind(this)}
            onDragOver={this.dragOver.bind(this, i)}>
            {liChildren}
          </li>
        )
      })
    }

    let headers
    if (this.props.schema.items.type === 'object') {
      headers = _.map(this.props.schema.items.properties, (val, key) => {
        return <div className={`array-header array-item-width-${val.size}`} key={key}>{getTitle(val, key)}</div>
      })
    } else {
      headers = <div className='array-header array-item-width-16'>{this.props.schema.items.title}</div>
    } 

    const fullArray = (
      <ComplexWrapper
        title={this.props.title}
        description={this.props.description}
        className='array'
        utils={this.props.utils}
        format={this.props.format}
        label>
        <div className='array-contents'>
          <div className='array-headers'>{headers}</div>
          <ul className='array-items'>{items}</ul>
        </div>
        <div className='array-buttons'>
          <button onClick={this.insert.bind(this)} className='array-add-button'>＋</button>
          <button onClick={this.delete.bind(this, this.state.selection)} className='array-delete-button' disabled={this.state.selection == null}>－</button>
        </div>
      </ComplexWrapper>
    )

    if (this.props.schema.sheet) {
      let buttonTitle = `${this.props.title}...`
      let buttonLabel = ''
      if (this.props.schema.buttonFormat === 'count') {
        const count = trueValue.length
        buttonTitle = count === 1 ? '1 Item...' : `${count} Items...`
        buttonLabel = this.props.title
      }
      return (
        <div>
          <div className={`sheet ${this.state.sheetVisible ? 'visible' : ''}`}>
            {fullArray}
            <button className='sheet-close-button' onClick={this.closeSheet.bind(this)}>Done</button>
          </div>
          <SimpleWrapper
            buttonMode
            description={this.props.schema.buttonDescription}
            utils={this.props.utils}
            className='sheet-button'
            label={this.props.label}
            title={buttonLabel}
            separatorBelow={this.props.schema.separatorBelow}>
            <button className='sheet-button' onClick={this.openSheet.bind(this)}>{buttonTitle}</button>
          </SimpleWrapper>
        </div>
      )
    } else {
      return fullArray
    }
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
