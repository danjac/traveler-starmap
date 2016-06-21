import * as api from '../api';

function createAction(type, payload) {
  if (payload instanceof Error) {
    return { type, error: payload };
  }
  return { type, payload };
}

export const selectWorld = world => createAction('WORLD_SELECTED', world);

const fetchSubsector = (fn, world) => {
  return dispatch => {
    dispatch(selectWorld(null));
    dispatch(createAction('NEW_SUBSECTOR_REQUEST'));
    fn()
    .then(payload => {
      dispatch(createAction('NEW_SUBSECTOR_SUCCESS', payload));
      if (world) {
        dispatch(selectWorld(world));
      }
    }, err => {
      dispatch('NEW_SUBSECTOR_FAILURE', err);
    });
  };
};


export function search(query) {
  return dispatch => {
    dispatch(createAction('SEARCH_RESULTS_REQUEST', query));
    if (query) {
      api.get('search/?q=' + query)
      .then(payload => {
        dispatch(createAction('SEARCH_RESULTS_SUCCESS', payload.results));
      }, err => {
        dispatch(createAction('SEARCH_RESULTS_FAILURE', err));
      });
    }
  };
}

export const clearSearch = () => createAction('CLEAR_SEARCH');

export function getRandomSubsector() {
  return fetchSubsector(() => api.get('random/'));
}

export function newSubsector() {
  return fetchSubsector(() => api.post(''));
}

export function jumpTo(searchResult) {
  return dispatch => {
    dispatch(clearSearch());
    const url = searchResult.subsector.id + '/';
    dispatch(fetchSubsector(() => api.get(url), searchResult.world));
  };
}
