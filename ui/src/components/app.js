import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as bs from 'react-bootstrap';
import * as actions from '../actions';

import Search from './search';
import Starmap from './starmap';
import WorldDetail from './world-detail';
import WorldList from './world-list';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');


export class App extends React.Component {

  static propTypes = {
    selected: PropTypes.object,
    subsector: PropTypes.object,
    searchResults: PropTypes.array,
    searchQuery: PropTypes.string,
    onRandomSubsector: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchSelect: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    onSelectWorld: PropTypes.func.isRequired,
    onNewSubsector: PropTypes.func.isRequired,
  };


  render() {
    const {
      subsector,
      selected,
      searchResults,
      searchQuery,
      onSearch,
      onSearchSelect,
      onSelectWorld,
      onNewSubsector,
      onRandomSubsector,
      onSelectAll,
    } = this.props;

    if (!subsector) {
      return (
        <div className="container">
          <div className="text-center" style={{ marginTop: '30%' }}>
            <h1>Loading...</h1>
          </div>
        </div>
      );
    }

    const { worlds } = subsector;

    const pngUrl = `${actions.API_URL}${subsector.id}/map/`;
    const csvUrl = `${actions.API_URL}${subsector.id}/csv/`;

    return (
      <bs.Grid>
        <h2>{subsector.name} Subsector </h2>
        <bs.Row>
          <bs.Col md={8}>
            <bs.ButtonGroup>
              {selected ?
              <bs.Button onClick={onSelectAll} title="See all worlds in subsector">
                <bs.Glyphicon glyph="list" />
              </bs.Button> : ''}
              <bs.Button onClick={onNewSubsector} title="Create new subsector">
                <bs.Glyphicon glyph="plus" />
              </bs.Button>
              <bs.Button onClick={onRandomSubsector} title="Get random subsector">
                <bs.Glyphicon glyph="random" />
              </bs.Button>
              <a className="btn btn-default" href={csvUrl} title="Download CSV">
                <bs.Glyphicon glyph="download" />
              </a>
              <a className="btn btn-default" href={pngUrl} title="Download map (PNG)">
                <bs.Glyphicon glyph="map-marker" />
              </a>
            </bs.ButtonGroup>
          </bs.Col>
          <bs.Col md={4}>
            <Search
              searchResults={searchResults}
              searchQuery={searchQuery}
              onSearchSelect={onSearchSelect}
              onSearch={onSearch}
            />
          </bs.Col>
        </bs.Row>
        <bs.Row>
          <bs.Col md={8}>
            {selected ?
            <WorldDetail world={selected} /> :
            <WorldList worlds={worlds} onSelectWorld={onSelectWorld} />
            }
          </bs.Col>
          <bs.Col md={4}>
            <Starmap
              worlds={worlds}
              selected={selected}
              onSelectWorld={onSelectWorld}
            />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

const mapStateToProps = state => {
  const { subsector, selected, searchResults, searchQuery } = state;
  return {
    subsector,
    selected,
    searchResults,
    searchQuery,
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onSelectAll() {
      dispatch(actions.selectWorld(null));
    },
    onSelectWorld(world) {
      dispatch(actions.selectWorld(world));
    },
    onNewSubsector() {
      dispatch(actions.newSubsector());
    },
    onRandomSubsector() {
      dispatch(actions.getRandomSubsector());
    },
    onSearch(value) {
      dispatch(actions.search(value));
    },
    onSearchSelect(value) {
      dispatch(actions.jumpTo(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
