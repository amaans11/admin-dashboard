import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function limiterReducer(state = initialState.limiter, action) {
  switch (action.type) {
    case types.CREATE_LIMITER_SUCCESS:
      return { ...state };
    case types.GET_LIMITER_LIST_SUCCESS:
      return { ...state, list: action.res };
    case types.UPDATE_LIMITER_SUCCESS:
      return { ...state };

    default:
      return state;
  }
}
