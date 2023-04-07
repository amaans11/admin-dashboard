import * as types from '../shared/actionTypes';

export default function userGeneratedReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_UGT_CONFIG_SUCCESS:
      return { ...state, getUgtConfigResponse: action.res };
    case types.SET_UGT_CONFIG_SUCCESS:
      return { ...state, setUgtConfigResponse: action.res };
    case types.GET_UGC_CONFIG_SUCCESS:
      return { ...state, getUgcConfigResponse: action.res };
    case types.SET_UGC_CONFIG_SUCCESS:
      return { ...state, setUgcConfigResponse: action.res };
    default:
      return state;
  }
}
