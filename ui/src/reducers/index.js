const initialState = {
  subsector: null,
  selected: null,
  searchResults: [],
  isSearchLoading: false,
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
    case 'SEARCH_RESULTS_REQUEST':
      return Object.assign({}, state, {
//searchResults: [],
        isSearchLoading: true,
      });
    case 'SEARCH_RESULTS_SUCCESS':
      return Object.assign({}, state, {
        searchResults: action.payload,
        isSearchLoading: false,
      });
    default:
      return state;

  }
}
