import _ from 'lodash'
import React from 'react'
import ReactMarkdown from 'react-markdown'

import convert from 'convert-lacona-example'

export class SimpleWrapper extends React.Component {
  render () {
    const examplesMD = this.props.examples || []
    const examplesHTML = _.chain(examplesMD)
      .map(example => convert(example, this.props.utils.relativePath))
      .join('')
      .value()

    if (this.props.label) {
      const Element = this.props.buttonMode ? 'div' : 'label'

      return (
        <Element {...this.props.events} className={`${this.props.className || ''} format-${this.props.format} big-label`}>
          {this.props.title ? <div className={`title ${examplesHTML ? 'has-examples' : ''}`}>{this.props.title}</div> : <div className='title-placeholder' />}
          {examplesHTML ? <div className='examples' dangerouslySetInnerHTML={{__html: examplesHTML}} /> : null}
          {this.props.children}
          {this.props.description ? <ReactMarkdown
            source={this.props.description}
            className='description'
            disallowedTypes={['HtmlInline', 'HtmlBlock', 'Paragraph', 'Heading', 'Softbreak', 'Hardbreak', 'CodeBlock', 'BlockQuote', 'ThematicBreak']}
            unwrapDisallowed /> : null}
          {this.props.separatorBelow ? <hr /> : null}
        </Element>
      )
    } else {
      return (
        <div {...this.props.events} className={this.props.className}>
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
          {this.props.description ? <ReactMarkdown
            source={this.props.description}
            className='description'
            disallowedTypes={['HtmlInline', 'HtmlBlock', 'Paragraph', 'Heading', 'Softbreak', 'Hardbreak', 'CodeBlock', 'BlockQuote', 'ThematicBreak']}
            unwrapDisallowed /> : null}
          {this.props.children}
        </fieldset>
      )
    } else {
      return <div className={this.props.className}>{this.props.children}</div>
    }
  }
}
