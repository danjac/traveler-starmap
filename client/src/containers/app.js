import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as bs from 'react-bootstrap';
import { normalizeUrl } from '../api';

import {
  selectWorld,
  newSubsector,
  getRandomSubsector,
  jumpTo,
} from '../modules/subsector';

import { search } from '../modules/search';

import Search from '../components/search';
import Starmap from '../components/starmap';
import WorldDetail from '../components/world-detail';
import WorldList from '../components/world-list';

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

    const pngUrl = normalizeUrl(`${subsector.id}/map/`);
    const csvUrl = normalizeUrl(`${subsector.id}/csv/`);

    return (
      <bs.Grid>
        <h2>{subsector.name} Subsector</h2>
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
  const { subsector, selected } = state.subsector;
  const { searchResults, searchQuery } = state.search;

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
      dispatch(selectWorld(null));
    },
    onSelectWorld(world) {
      dispatch(selectWorld(world));
    },
    onNewSubsector() {
      dispatch(newSubsector());
    },
    onRandomSubsector() {
      dispatch(getRandomSubsector());
    },
    onSearch(value) {
      dispatch(search(value));
    },
    onSearchSelect(value) {
      dispatch(jumpTo(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
