var React = require('react')

export class SimpleWrapper extends React.Component {
  render () {
    return (
      <label>
        {this.props.title ? <span className='title'>{this.props.title}</span> : null}
        {(this.props.title && this.props.description) ? <span className='description'>{this.props.description}</span> : null}
        {this.props.children}
      </label>
    )
  }
}

export class ComplexWrapper extends React.Component {
  render () {
    return (
      <fieldset>
        {this.props.title ? <legend className='title'>{this.props.title}</legend> : null}
        {(this.props.title && this.props.description) ? <span className='description'>{this.props.description}</span> : null}
        {this.props.children}
      </fieldset>
    )
  }
}
