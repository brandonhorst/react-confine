import React from 'react'

export class SimpleWrapper extends React.Component {
  render () {
    if (this.props.label) {
      return (
        <label {...this.props.events} className={`${this.props.className} format-${this.props.format}`}>
          {this.props.title ? <div className='title'>{this.props.title}</div> : null}
          {this.props.children}
          {(this.props.title && this.props.description) ? <div className='description'>{this.props.description}</div> : null}
          {this.props.separatorBelow ? <hr /> : null}
        </label>
      )
    } else {
      return (
        <div {...this.props.events}>
          {this.props.children}
          {this.props.separatorBelow ? <hr /> : null}
        </div>
      )
    }
  }
}

export class ComplexWrapper extends React.Component {
  render () {
    if (this.props.label) {
      return (
        <fieldset className={`${this.props.className} format-${this.props.format}`}>
          {this.props.title ? <legend className='title'>{this.props.title}</legend> : null}
          {(this.props.title && this.props.description)
            ? <div className='description'>{this.props.description}</div>
            : null}
          {this.props.children}
        </fieldset>
      )
    } else {
      return <div className={this.props.className}>{this.props.children}</div>
    }
  }
}
