import { combineReducers } from 'redux';

import search from './search';
import subsector from './subsector';

export default combineReducers({
  search,
  subsector,
});
