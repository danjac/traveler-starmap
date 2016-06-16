import fetch from 'isomorphic-fetch';

export const API_URL = process.env.API_URL || 'http://localhost:5000/';

function createAction(type, payload) {
  if (payload instanceof Error) {
    return { type, error: payload };
  }
  return { type, payload };
}

export const selectWorld = world => createAction('WORLD_SELECTED', world);

const fetchSubsector = (apiCall, world) => {
  return dispatch => {
    dispatch(selectWorld(null));
    dispatch(createAction('NEW_SUBSECTOR_REQUEST'));
    apiCall
    .then(result => {
      result.json()
      .then(payload => {
        dispatch(createAction('NEW_SUBSECTOR_SUCCESS', payload));
        if (world) {
          dispatch(selectWorld(world));
        }
      });
    }, err => {
      dispatch('NEW_SUBSECTOR_FAILURE', err);
    });
  };
};


export function search(query) {
  return dispatch => {
    dispatch(createAction('SEARCH_RESULTS_REQUEST', query));
    if (query) {
      fetch(API_URL + 'search/?q=' + query)
      .then(result => {
        result.json()
        .then(payload => {
          dispatch(createAction('SEARCH_RESULTS_SUCCESS', payload.results));
        }, err => {
          dispatch(createAction('SEARCH_RESULTS_FAILURE', err));
        });
      });
    }
  };
}

export const clearSearch = () => createAction('CLEAR_SEARCH');

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
