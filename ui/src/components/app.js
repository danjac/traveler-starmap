import React, { PropTypes } from 'react';
import * as bs from 'react-bootstrap';

import Starmap from './starmap';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

const worlds = [
  {
    name: 'Meresankh',
    starport: 'C',
    coords: '0208',
    uwp: 'C849BBA-C',
    bases: '',
    notes: 'Hi In',
  },
  {
    name: 'Ushkhakegasas',
    starport: 'C',
    coords: '0101',
    uwp: 'CA365BBA-D',
    bases: 'N T I',
    notes: 'Hi',
  },
  {
    name: 'Aszagin',
    starport: 'F',
    coords: '0602',
    uwp: 'E242358-7',
    bases: '',
    notes: 'Lo Na Po',
  },
];


const WorldDetail = props => {
  const { world } = props;

  const header = (
    <bs.Grid fluid>
      <bs.Row>
        <bs.Col md={9}><h3>{world.name}</h3></bs.Col>
        <bs.Col md={3}>
          <bs.Button onClick={props.onSelectAll}>
            <bs.Glyphicon glyph="list" /> View all
          </bs.Button>
        </bs.Col>
      </bs.Row>
    </bs.Grid>
  );

  return (
    <bs.Panel header={header}>
      <dl className="dl-horizontal">
        <dt>Coordinates</dt>
        <dd>{world.coords}</dd>
        <dt>UWP</dt>
        <dd>{world.uwp}</dd>
        <dt>Starport</dt>
        <dd>{world.starport}</dd>
        <dt>Size</dt>
        <dd>10,000km</dd>
        <dt>Atmosphere</dt>
        <dd>Standard</dd>
        <dt>Hydrographics</dt>
        <dd>60%</dd>
        <dt>Temperature</dt>
        <dd>Temperate</dd>
        <dt>Population</dt>
        <dd>1,000,000</dd>
        <dt>Government</dt>
        <dd>Feudal technocracy</dd>
        <dt>Law level</dt>
        <dd>Shotguns prohibited</dd>
        <dt>Tech level</dt>
        <dd>16</dd>
        <dt>Notes</dt>
        <dd>Rich, Agricultural</dd>
      </dl>
      <h4>Bases and facilities</h4>
      <table className="table table-condensed table-striped">
        <tbody>
          <tr><td>Gas giants</td>
          <td><input type="radio" readOnly checked /></td></tr>
          <tr><td>Naval base</td>
          <td><input type="radio" readOnly checked /></td></tr>
          <tr><td>Scout base</td>
          <td><input type="radio" readOnly checked /></td></tr>
          <tr><td>Research base</td>
          <td><input type="radio" readOnly checked /></td></tr>
          <tr><td>Pirate base</td>
          <td><input type="radio" readOnly checked /></td></tr>
          <tr><td>Traveler's Aid Society</td>
          <td><input type="radio" readOnly checked /></td></tr>
          <tr><td>Imperial Consulate</td>
          <td><input type="radio" readOnly checked /></td></tr>
        </tbody>
      </table>
    </bs.Panel>
  );
};

WorldDetail.propTypes = {
  world: PropTypes.object.isRequired,
  onSelectAll: PropTypes.func.isRequired,
};


const WorldList = (props) => {
  const selectWorld = world => () => {
    props.onSelectWorld(world);
  };

  return (
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
      {props.worlds.map((w) => (
      <tr
        key={w.coords}
        className={w.selected ? 'info' : ''}
        onClick={selectWorld(w)}
      >
          <td>{w.coords}</td>
          <td>{w.name}</td>
          <td>{w.uwp}</td>
          <td>{w.bases}</td>
          <td>{w.notes}</td>
        </tr>
        ))}
      </tbody>
    </table>
  );
};

WorldList.propTypes = {
  onSelectWorld: PropTypes.func.isRequired,
  worlds: PropTypes.array.isRequired,
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { worlds, selected: null };
    this.onSelectWorld = this.onSelectWorld.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
  }

  onSelectAll() {
    this.onSelectWorld(null);
  }

  onSelectWorld(world) {
    const worlds = this.state.worlds;
    let selected = null;

    for (let i = 0; i < worlds.length; i++) {
      if (world && world.coords === worlds[i].coords) {
        worlds[i].selected = true;
        selected = world;
      } else {
        worlds[i].selected = false;
      }
    }
    this.setState({ worlds, selected });
  }

  render() {
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
            {this.state.selected ?
            <WorldDetail world={this.state.selected} onSelectAll={this.onSelectAll}/> :
            <WorldList worlds={this.state.worlds} onSelectWorld={this.onSelectWorld} />
            }
          </bs.Col>
          <bs.Col md={4}>
            <Starmap worlds={this.state.worlds} onSelectWorld={this.onSelectWorld} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default App;
