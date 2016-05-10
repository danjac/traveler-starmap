import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';


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

export default Search;
