import Confine from 'confine'
import React from 'react'
import {render} from 'react-dom'
import ReactConfine from '../..'

const schema = {
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
        type: 'string',
        default: ''
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

const object = {
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

const confine = new Confine()

const JSONView = React.createClass({
  render: function () {
    return <textarea readOnly='true' value={JSON.stringify(this.props.value, null, 2)} />
  }
})

class Page extends React.Component {
  constructor ({value}) {
    super()
    this.state = {value}
  }

  change (value) {
    this.setState({value})
  }

  render () {
    return (
      <div className='page'>
        <ReactConfine confine={confine} schema={this.props.schema} value={this.state.value} onChange={this.change.bind(this)} />
        <JSONView value={this.state.value} />
      </div>
    )
  }
}

render(<Page value={object} schema={schema} />, document.getElementById('demo'))
