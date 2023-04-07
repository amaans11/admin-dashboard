import * as types from '../shared/actionTypes';

export default function serverConfigsReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_SERVER_CONFIG_SUCCESS:
      return { ...state, serverConfig: action.res };
    case types.GET_SERVER_CONFIG_URL_SUCCESS:
      return { ...state, serverConfigUrl: action.res };
    case types.SET_SERVER_CONSOLE_CONFIG_SUCCESS:
      return { ...state };
    case types.GET_CONFIGS_SUCCESS:
      return { ...state, generalConfigs: action.res };
    default:
      return state;
  }
}
