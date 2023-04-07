import * as types from '../shared/actionTypes';

export default function homeConfigReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_CONFIGURABLE_HOME_CONFIG_SUCCESS:
      return { ...state, getConfigurableHomeConfigResponse: action.res };
    case types.SET_CONFIGURABLE_HOME_CONFIG_SUCCESS:
      return { ...state, setConfigurableHomeConfigResponse: action.res };
    default:
      return state;
  }
}
