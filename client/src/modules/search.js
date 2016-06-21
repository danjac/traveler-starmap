import * as api from '../api';
import { createAction } from './utils';

const SEARCH_RESULTS_REQUEST = 'traveler-starmap/search/SEARCH_RESULTS_REQUEST';
const SEARCH_RESULTS_SUCCESS = 'traveler-starmap/search/SEARCH_RESULTS_SUCCESS';
const SEARCH_RESULTS_FAILURE = 'traveler-starmap/search/SEARCH_RESULTS_FAILURE';
const CLEAR_SEARCH = 'traveler-starmap/search/CLEAR_SEARCH';

export function search(query) {
  return dispatch => {
    dispatch(createAction(SEARCH_RESULTS_REQUEST, query));
    if (query) {
      api.get('search/?q=' + query)
      .then(payload => {
        dispatch(createAction(SEARCH_RESULTS_SUCCESS, payload.results));
      }, err => {
        dispatch(createAction(SEARCH_RESULTS_FAILURE, err));
      });
    }
  };
}

export const clearSearch = () => createAction(CLEAR_SEARCH);

const initialState = {
  searchResults: [],
  searchQuery: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_SEARCH:
      return { ...state, searchResults: [], searchQuery: '' };
    case SEARCH_RESULTS_REQUEST:
      return { ...state, searchResults: [], searchQuery: action.payload };
    case SEARCH_RESULTS_SUCCESS:
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
}
