const initialState = {
  subsector: null,
  selected: null,
  searchResults: [],
  searchQuery: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'WORLD_SELECTED':
      return Object.assign({}, state, {
        selected: action.payload,
      });
    case 'NEW_SUBSECTOR_SUCCESS':
      return Object.assign({}, state, {
        subsector: action.payload,
      });
    case 'CLEAR_SEARCH':
      return Object.assign({}, state, {
        searchResults: [],
        searchQuery: '',
      });
    case 'SEARCH_RESULTS_REQUEST':
      return Object.assign({}, state, {
        searchResults: [],
        searchQuery: action.payload,
      });
    case 'SEARCH_RESULTS_SUCCESS':
      return Object.assign({}, state, {
        searchResults: action.payload,
      });
    default:
      return state;

  }
}
