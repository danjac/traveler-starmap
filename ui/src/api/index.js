import fetch from 'isomorphic-fetch';
import { camelizeKeys } from 'humps';
import { partial } from 'lodash';

function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export function handleRequest(method, url, data) {
  const headers = {
    Accept: 'application/json',
  };

  let body = data;
  if (!(data instanceof window.FormData)) {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

  if (!url.startsWith(__API_URL__)) {
    url = __API_URL__ + url;
  }

  return fetch(url, {
    mode: 'cors',
    method,
    body,
    headers,
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(camelizeKeys);
}

export const get = partial(handleRequest, 'GET');
export const post = partial(handleRequest, 'POST');
export const del = partial(handleRequest, 'DELETE');
export const put = partial(handleRequest, 'PUT');
export const patch = partial(handleRequest, 'PATCH');
