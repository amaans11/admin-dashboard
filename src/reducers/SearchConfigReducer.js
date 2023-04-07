import * as types from '../shared/actionTypes';

export default function searchConfigReducer(state = {}, action) {
  switch (action.type) {
    case types.SET_SEARCH_CONFIG_SUCCESS:
      return { ...state, setSearchConfigResponse: action.res };
    case types.SET_SEARCH_CUSTOM_CONFIG_SUCCESS:
      return { ...state, setSearchCustomConfigResponse: action.res };
    case types.GET_SEARCH_CONFIG_SUCCESS:
      return { ...state, getSearchConfigResponse: action.res };
    default:
      return state;
  }
}
