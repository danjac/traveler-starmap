import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as bs from 'react-bootstrap';

import Starmap from './starmap';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

const starmap = require('../starmap.png');

const worlds = [
  {
    name: 'Meresankh',
    coords: '0101',
    uwp: 'C849BBA-C',
    bases: '',
    notes: 'Hi In',
  },
  {
    name: 'Ushkhakegasas',
    coords: '0107',
    uwp: 'CA365BBA-D',
    bases: 'N T I',
    notes: 'Hi',
  },
  {
    name: 'Aszagin',
    coords: '0401',
    uwp: 'E242358-7',
    bases: '',
    notes: 'Lo Na Po',
  },
];


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { rotation: 0 };
//this.tick = this.tick.bind(this);
  }

  componentDidMount() {
//window.requestAnimationFrame(this.tick);
  }

  tick() {
    this.setState({ rotation: this.state.rotation + 0.1 });
    window.requestAnimationFrame(this.tick);
  }

  render() {
    console.log("rendering....");
    return (
      <bs.Grid>
        <h2>Subsector Merenga</h2>
        <bs.Row>
          <bs.Col md={8}>
            <bs.ButtonGroup>
              <bs.Button><bs.Glyphicon glyph="star" /> New subsector</bs.Button>
              <bs.Button><bs.Glyphicon glyph="download" /> Download CSV</bs.Button>
              <bs.Button><bs.Glyphicon glyph="download" /> Download map (PNG)</bs.Button>
            </bs.ButtonGroup>
          </bs.Col>
          <bs.Col md={4}>
            <bs.FormGroup>
              <bs.InputGroup>
                <bs.InputGroup.Addon>
                  <bs.Glyphicon glyph="search" />
                </bs.InputGroup.Addon>
                <bs.FormControl
                  type="search"
                  placeholder="Find world or subsector..."
                />
              </bs.InputGroup>
              <bs.FormControl.Feedback />
            </bs.FormGroup>
          </bs.Col>
        </bs.Row>
        <bs.Row>
          <bs.Col md={8}>
            <table className="table table-striped table-condensed table-hover">
              <thead>
                <tr>
                  <th>Coords</th>
                  <th>Name</th>
                  <th>UWP</th>
                  <th>Bases</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
              {worlds.map((w) => (
                <tr key={w.coords}>
                  <td>{w.coords}</td>
                  <td>{w.name}</td>
                  <td>{w.uwp}</td>
                  <td>{w.bases}</td>
                  <td>{w.notes}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </bs.Col>
          <bs.Col md={4}>
            <Starmap />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default App;
