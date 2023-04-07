import * as types from '../shared/actionTypes';

export default function tierWidgetReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_CURRENT_CONFIG_SUCCESS:
      return { ...state, getCurrentConfigSuccess: action.res };
    case types.SET_TIER_WIDGET_CONFIG_SUCCESS:
      return { ...state, setTierWidgetConfigResponse: action.res };
    case types.DELETE_TIER_WIDGET_CONFIG_SUCCESS:
      return { ...state, deleteTierWidgetConfigResponse: action.res };
    case types.GET_HOME_MANAGEMENT_CONFIG_SUCCESS:
      return { ...state, getHomeManagementConfigResponse: action.res };
    case types.SET_HOME_MANAGEMENT_CONFIG_SUCCESS:
      return { ...state, setHomeManagementConfigResponse: action.res };
    default:
      return state;
  }
}
