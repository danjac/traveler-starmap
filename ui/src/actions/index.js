import fetch from 'isomorphic-fetch';

export const API_URL = 'http://localhost:5000/';


export function selectWorld(world) {
  return {
    type: 'WORLD_SELECTED',
    payload: world,
  };
}

const createSubsector = apiCall => {
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
      });
    }, err => {
      dispatch({
        type: 'NEW_SUBSECTOR_FAILURE',
        error: err,
      });
    });
  };
};

export function getRandomSubsector() {
  return createSubsector(fetch(API_URL + 'random/'));
}


export function newSubsector() {
  const apiCall = fetch(API_URL, {
    mode: 'cors',
    method: 'POST',
  });
  return createSubsector(apiCall);
}
