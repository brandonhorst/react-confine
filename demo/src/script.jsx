var Confine = require('confine')
var React = require('react/addons')
var ReactConfine = require('../..')

var schema = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    age: {type: 'integer', min: 0, max: 120},
    income: {type: 'number', min: 0},
    universe: {type: 'string', enum: ['Marvel', 'DC']},
    identity: {type: 'string', enum: ['secret', 'public', 'complicated'], default: 'secret'},
    living: {type: 'boolean', default: true},
    alterEgos: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    teams: {
      type: 'array',
      items: {
        type: 'string',
        default: 'The Avengers'
      }
    },
    powers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          rarity: {type: 'string', enum: ['very', 'moderately', 'not'], default: 'moderately'}
        }
      }
    },
    location: {
      type: 'object',
      properties: {
        city: {type: 'string', default: 'New York'},
        state: {type: 'string', regex: /^[A-Z]{2}$/, default: 'NY'}
      }
    }
  }
}

var object = {
  name: 'Peter Parker',
  age: 17,
  income: 38123.52,
  alterEgos: ['Spider-Man'],
  universe: 'Marvel',
  powers: [
    {name: 'Super Strength', rarity: 'not'},
    {name: 'Spidey-sense', rarity: 'very'}
  ]
}

var confine = new Confine()

var JSONView = React.createClass({
  render: function () {
    return <textarea readOnly='true' value={JSON.stringify(this.props.value, null, 2)} />
  }
})

var Page = React.createClass({
  getInitialState: function () {
    return {value: this.props.value}
  },
  change: function (newValue) {
    this.setState({
      value: newValue
    })
  },
  render: function () {
    return (
      <div className='page'>
        <ReactConfine confine={confine} schema={this.props.schema} value={this.state.value} onChange={this.change} />
        <JSONView value={this.state.value} />
      </div>
    )
  }
})

React.render(<Page value={object} schema={schema} />, document.body)
