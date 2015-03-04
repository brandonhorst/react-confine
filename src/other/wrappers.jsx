var React = require('react/addons')

var SimpleWrapper = React.createClass({
  render: function () {
    return (
      <label>
        {this.props.title ? <span className='title'>{this.props.title}</span> : null}
        {(this.props.title && this.props.description) ? <span className='description'>{this.props.description}</span> : null}
        {this.props.children}
      </label>
    )
  }
})

var ComplexWrapper = React.createClass({
  render: function () {
    return (
      <fieldset>
        {this.props.title ? <legend className='title'>{this.props.title}</legend> : null}
        {(this.props.title && this.props.description) ? <span className='description'>{this.props.description}</span> : null}
        {this.props.children}
      </fieldset>
    )
  }
})

module.exports = {
  Simple: SimpleWrapper,
  Complex: ComplexWrapper
}
