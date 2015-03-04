/*eslint-env mocha*/
var _ = require('lodash')
var chai = require('chai')
var Confine = require('confine')
var expect = chai.expect
var jsdom = require('jsdom')
var ReactConfine = require('..')

describe('react-confine', function () {
  var React, TestUtils
  var confine = new Confine()

  global.document = jsdom.jsdom()
  global.window = global.document.parentWindow
  global.navigator = global.window.navigator

  React = require('react/addons')
  TestUtils = React.addons.TestUtils

  describe('element', function () {
    it('outputs a node of the appropriate class', function () {
      var schema = {type: 'string'}
      var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
      expect(node.getDOMNode().className).to.match(/\bstring\b/)
      expect(node.getDOMNode().className).to.not.match(/\binvalid\b/)
    })
    it('marks a node invalid', function () {
      var schema = {type: 'string', regex: /a/}
      var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} defaultValue='b' />)
      expect(node.getDOMNode().className).to.match(/\binvalid\b/)
    })
  })

  describe('basic values', function () {
    var types = ['string', 'number', 'integer', 'boolean']

    it('prints no title or description', function () {
      _.forEach(types, function (type) {
        var schema = {type: type}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var titles = TestUtils.scryRenderedDOMComponentsWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(titles).to.have.length(0)
        expect(descriptions).to.have.length(0)
      })
    })
    it('prints a title but no description', function () {
      _.forEach(types, function (type) {
        var schema = {type: type, title: 'my string'}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var title = TestUtils.findRenderedDOMComponentWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(title.getDOMNode().textContent).to.equal('my string')
        expect(descriptions).to.have.length(0)
      })
    })
    it('will not print a description with no title', function () {
      _.forEach(types, function (type) {
        var schema = {type: type, description: 'my desc'}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var titles = TestUtils.scryRenderedDOMComponentsWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(titles).to.have.length(0)
        expect(descriptions).to.have.length(0)
      })
    })
    it('will print a description and title', function () {
      _.forEach(types, function (type) {
        var schema = {type: type, title: 'my string', description: 'my desc'}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var title = TestUtils.findRenderedDOMComponentWithClass(node, 'title')
        var description = TestUtils.findRenderedDOMComponentWithClass(node, 'description')
        expect(title.getDOMNode().textContent).to.equal('my string')
        expect(description.getDOMNode().textContent).to.equal('my desc')
      })
    })

    describe('array', function () {
      it('prints no title or description', function () {
        var schema = {type: 'array', items: {type: 'string'}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var titles = TestUtils.scryRenderedDOMComponentsWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(titles).to.have.length(0)
        expect(descriptions).to.have.length(0)
      })
      it('prints a title but no description', function () {
        var schema = {type: 'array', title: 'my string', items: {type: 'string'}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var title = TestUtils.findRenderedDOMComponentWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(title.getDOMNode().textContent).to.equal('my string')
        expect(descriptions).to.have.length(0)
      })
      it('will not print a description with no title', function () {
        var schema = {type: 'array', description: 'my desc', items: {type: 'string'}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var titles = TestUtils.scryRenderedDOMComponentsWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(titles).to.have.length(0)
        expect(descriptions).to.have.length(0)
      })
      it('will print a description and title', function () {
        var schema = {type: 'array', title: 'my string', description: 'my desc', items: {type: 'string'}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var title = TestUtils.findRenderedDOMComponentWithClass(node, 'title')
        var description = TestUtils.findRenderedDOMComponentWithClass(node, 'description')
        expect(title.getDOMNode().textContent).to.equal('my string')
        expect(description.getDOMNode().textContent).to.equal('my desc')
      })
    })
    describe('object', function () {
      it('prints no title or description, but does for child props', function () {
        var schema = {type: 'object', properties: {myStr: {type: 'string'}}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var title = TestUtils.findRenderedDOMComponentWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(title.getDOMNode().textContent).to.equal('My Str')
        expect(descriptions).to.have.length(0)
      })
      it('prints a title but no description', function () {
        var schema = {type: 'object', title: 'my string', properties: {myStr: {type: 'string'}}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var titles = TestUtils.scryRenderedDOMComponentsWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(titles).to.have.length(2)
        expect(titles[0].getDOMNode().textContent).to.equal('my string')
        expect(titles[1].getDOMNode().textContent).to.equal('My Str')
        expect(descriptions).to.have.length(0)
      })
      it('will not print a description with no title', function () {
        var schema = {type: 'object', description: 'my desc', properties: {myStr: {type: 'string'}}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var title = TestUtils.findRenderedDOMComponentWithClass(node, 'title')
        var descriptions = TestUtils.scryRenderedDOMComponentsWithClass(node, 'description')
        expect(title.getDOMNode().textContent).to.equal('My Str')
        expect(descriptions).to.have.length(0)
      })
      it('will print a description and title', function () {
        var schema = {type: 'object', title: 'my string', description: 'my desc', properties: {myStr: {type: 'string'}}}
        var node = TestUtils.renderIntoDocument(<ReactConfine schema={schema} confine={confine} />)
        var titles = TestUtils.scryRenderedDOMComponentsWithClass(node, 'title')
        var description = TestUtils.findRenderedDOMComponentWithClass(node, 'description')
        expect(titles).to.have.length(2)
        expect(titles[0].getDOMNode().textContent).to.equal('my string')
        expect(titles[1].getDOMNode().textContent).to.equal('My Str')
        expect(description.getDOMNode().textContent).to.equal('my desc')
      })
    })
  })
})
