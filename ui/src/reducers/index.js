const initialState = {
  subsector: null,
  selected: null,
  searchResults: [],
  searchQuery: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'WORLD_SELECTED':
      return { ...state, selected: action.payload };
    case 'NEW_SUBSECTOR_REQUEST':
      return { ...state, subsector: null, selected: null };
    case 'NEW_SUBSECTOR_SUCCESS':
      return { ...state, subsector: action.payload };
    case 'CLEAR_SEARCH':
      return { ...state, searchResults: [], searchQuery: '' };
    case 'SEARCH_RESULTS_REQUEST':
      return { ...state, searchResults: [], searchQuery: action.payload };
    case 'SEARCH_RESULTS_SUCCESS':
      return { ...state, searchResults: action.payload };
    default:
      return state;

  }
}
