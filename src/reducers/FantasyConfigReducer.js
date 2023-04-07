import * as types from '../shared/actionTypes';

export default function fantasyConfigReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_FANTASY_CONFIG_SUCCESS:
      return { ...state, getFantasyResponse: action.res };
    case types.SET_FANTASY_CONFIG_SUCCESS:
      return { ...state, setFantasyResponse: action.res };
    default:
      return state;
  }
}
