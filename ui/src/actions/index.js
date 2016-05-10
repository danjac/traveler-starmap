import fetch from 'isomorphic-fetch';

export const API_URL = 'http://localhost:5000/';


export function selectWorld(world) {
  return {
    type: 'WORLD_SELECTED',
    payload: world,
  };
}


const fetchSubsector = (apiCall, world) => {
  return dispatch => {
    dispatch(selectWorld(null));
    dispatch({ type: 'NEW_SUBSECTOR_REQUEST' });
    apiCall
    .then(result => {
      result.json()
      .then(payload => {
        dispatch({
          type: 'NEW_SUBSECTOR_SUCCESS',
          payload,
        });
        if (world) {
          dispatch(selectWorld(world));
        }
      });
    }, err => {
      dispatch({
        type: 'NEW_SUBSECTOR_FAILURE',
        error: err,
      });
    });
  };
};


export function search(query) {
  return dispatch => {
    dispatch({ type: 'SEARCH_RESULTS_REQUEST', payload: query });
    if (query) {
      fetch(API_URL + 'search/?q=' + query)
      .then(result => {
        result.json()
        .then(payload => {
          dispatch({
            type: 'SEARCH_RESULTS_SUCCESS',
            payload: payload.results,
          });
        }, err => {
          dispatch({
            type: 'SEARCH_RESULTS_FAILURE',
            error: err,
          });
        });
      });
    }
  };
}

export function clearSearch() {
  return {
    type: 'CLEAR_SEARCH',
  };
}
export function getRandomSubsector() {
  return fetchSubsector(fetch(API_URL + 'random/'));
}

export function newSubsector() {
  const apiCall = fetch(API_URL, {
    mode: 'cors',
    method: 'POST',
  });
  return fetchSubsector(apiCall);
}

export function jumpTo(searchResult) {
  return dispatch => {
    dispatch(clearSearch());
    const apiCall = fetch(API_URL + searchResult.subsector.id + '/');
    dispatch(fetchSubsector(apiCall, searchResult.world));
  };
}
