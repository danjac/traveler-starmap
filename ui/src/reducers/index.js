const initialState = {
  subsector: null,
  selected: null,
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
    default:
      return state;

  }
}
