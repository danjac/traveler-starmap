import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import * as bs from 'react-bootstrap';
import * as actions from '../actions';

import Starmap from './starmap';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');
require('./autosuggest.css');

const Search = props => {
  const getSuggestionValue = suggestion => {
    return suggestion;
  };

  const renderSuggestion = suggestion => {
    let name;
    if (suggestion.world) {
      name = `${suggestion.world.name}/${suggestion.subsector.name}`;
    } else {
      name = `${suggestion.subsector.name} Subsector`;
    }
    return <span>{name}</span>;
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    if (typeof suggestion === 'object') {
      props.onSearchSelect(suggestion);
    }
  };

  const onChange = (event, { newValue }) => {
    if (newValue && typeof newValue === 'string') {
      props.onSearch(newValue);
    }
  };

  const shouldRenderSuggestions = () => {
    return props.searchResults.length > 0;
  };

  return (
    <bs.FormGroup>
      <bs.InputGroup>
        <bs.InputGroup.Addon>
          <bs.Glyphicon glyph="search" />
        </bs.InputGroup.Addon>
        <Autosuggest
          inputProps={{
            onChange,
            placeholder: 'Find subsector or world...',
            className: 'form-control',
            value: props.searchQuery,
          }}
          suggestions={props.searchResults}
          shouldRenderSuggestions={shouldRenderSuggestions}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
          onSuggestionSelected={onSuggestionSelected}
        />
      </bs.InputGroup>
      <bs.FormControl.Feedback />
    </bs.FormGroup>
  );
};

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSearchSelect: PropTypes.func.isRequired,
  isSearchLoading: PropTypes.bool,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.array,
};

const WorldDetail = props => {
  const { world } = props;

  const header = <h3>{world.name}</h3>;

  return (
    <bs.Panel header={header}>
      <dl className="dl-horizontal">
        <dt>Coordinates</dt>
        <dd>{world.coords}</dd>
        <dt>UWP</dt>
        <dd>{world.uwp}</dd>
        <dt>Travel code</dt>
        <dd>{world.travel_zone}</dd>
        <dt>Starport</dt>
        <dd>{world.starport}</dd>
        <dt>Size</dt>
        <dd>{world.size}</dd>
        <dt>Atmosphere</dt>
        <dd>{world.atmosphere}</dd>
        <dt>Hydrographics</dt>
        <dd>{world.hydrographics}</dd>
        <dt>Temperature</dt>
        <dd>{world.temperature}</dd>
        <dt>Population</dt>
        <dd>{world.population}</dd>
        <dt>Government</dt>
        <dd>{world.government}</dd>
        <dt>Law level</dt>
        <dd>{world.law_level}</dd>
        <dt>Tech level</dt>
        <dd>{world.tech_level}</dd>
        <dt>Notes</dt>
        <dd>{world.long_trade_codes}</dd>
      </dl>
      <h4>Bases and facilities</h4>
      <table className="table table-condensed table-striped">
        <tbody>
          <tr><td>Gas giants</td>
          <td><input type="radio" readOnly checked={world.is_gas_giant} /></td></tr>
          <tr><td>Naval base</td>
          <td><input type="radio" readOnly checked={world.is_naval_base} /></td></tr>
          <tr><td>Scout base</td>
          <td><input type="radio" readOnly checked={world.is_scout_base} /></td></tr>
          <tr><td>Research base</td>
          <td><input type="radio" readOnly checked={world.is_research_base} /></td></tr>
          <tr><td>Pirate base</td>
          <td><input type="radio" readOnly checked={world.is_pirate_base} /></td></tr>
          <tr><td>Traveler's Aid Society</td>
          <td><input type="radio" readOnly checked={world.is_tas} /></td></tr>
          <tr><td>Imperial Consulate</td>
          <td><input type="radio" readOnly checked={world.is_consulate} /></td></tr>
        </tbody>
      </table>
    </bs.Panel>
  );
};

WorldDetail.propTypes = {
  world: PropTypes.object.isRequired,
};


const WorldList = (props) => {
  const onSelectWorld = world => () => {
    props.onSelectWorld(world);
  };

  return (
    <table className="table table-striped table-condensed table-hover">
      <thead>
        <tr>
          <th>Coords</th>
          <th>Name</th>
          <th>UWP</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
      {props.worlds.map((w) => (
      <tr key={w.coords} onClick={onSelectWorld(w)}>
          <td>{w.coords}</td>
          <td>{w.name}</td>
          <td>{w.uwp}</td>
          <td>{w.short_trade_codes}</td>
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
      return <div>No subsector selected</div>;
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
