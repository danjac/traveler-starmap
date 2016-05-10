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


class App extends React.Component {

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
        <h2>Subsector {subsector.name}</h2>
        <bs.Row>
          <bs.Col md={8}>
            <bs.ButtonGroup>
              <bs.Button onClick={onNewSubsector}>
                <bs.Glyphicon glyph="plus" /> New subsector
              </bs.Button>
              <a className="btn btn-default" href={csvUrl}>
                <bs.Glyphicon glyph="download" /> Download CSV
              </a>
              <a className="btn btn-default" href={pngUrl}>
                <bs.Glyphicon glyph="map-marker" /> Download map (PNG)
              </a>
              {selected ?
              <bs.Button onClick={onSelectAll}>
                <bs.Glyphicon glyph="list" /> View all worlds
              </bs.Button> : ''}
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
            <Starmap worlds={worlds} selected={selected} onSelectWorld={onSelectWorld} />
          </bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

App.propTypes = {
  selected: PropTypes.object,
  subsector: PropTypes.object,
  searchResults: PropTypes.array,
  searchQuery: PropTypes.string,
  isSearchLoading: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
  onSearchSelect: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelectWorld: PropTypes.func.isRequired,
  onNewSubsector: PropTypes.func.isRequired,
};


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
    onSearch(value) {
      dispatch(actions.search(value));
    },
    onSearchSelect(value) {
      dispatch(actions.jumpTo(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
