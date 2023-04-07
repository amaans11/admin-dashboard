import * as types from '../shared/actionTypes';

export default function i18nReducer(state = {}, action) {
  switch (action.type) {
    case types.CREATE_SERVICE_CONFIG_SUCCESS:
      return { ...state, createServiceConfigResponse: action.res };
    case types.GET_COUNTRY_LIST_SUCCESS:
      return { ...state, countryListResponse: action.res };
    case types.GET_SERVICE_CONFIGS_LIST_SUCCESS:
      return { ...state, configsListResponse: action.res };
    case types.GET_CONFIG_LISTS_BY_PATH_SUCCESS:
      return { ...state, configsByPathResponse: action.res };
    case types.CLONE_SERVICE_CONFIG:
      return { ...state, ...action };
    case types.CLEAR_SERVICE_CONFIG:
      return { ...state, cloneConfig: undefined, editType: undefined };
    case types.GET_SERVICE_CONFIG_SUCCESS:
      return { ...state, getServiceConfigResponse: action.res };
    case types.SERVICE_CONFIG_UPDATE_REQUEST_SUCCESS:
      return { ...state, requestUpdateResponse: action.res };
    case types.SERVICE_CONFIG_PR_LIST_SUCCESS:
      return { ...state, pendingRequestsResponse: action.res };
    case types.SERVICE_CONFIG_PR_UPDATE_SUCCESS:
      return { ...state, approveRequestsResponse: action.res };
    case types.SERVICE_CONFIGS_COUNTRY_SPECIFIC_LIST_SUCCESS:
      return { ...state, countrySpecificListResponse: action.res };
    case types.SEARCH_SERVICE_CONFIGS_SUCCESS:
      return { ...state, searchConfigsResponse: action.res };
    case types.GET_MISSING_COUNTRY_CONFIGS_SUCCESS:
      return { ...state, missingConfigsResponse: action.res };
    case types.EDIT_CONFIG_METADATA_SUCCESS:
      return { ...state, editMetaDataResponse: action.res };
    case types.UPDATE_MISSING_COUNTRY:
      return { ...state, missingCountryCode: action.countryCode };
    case types.RESET_MISSING_COUNTRY:
      return { ...state, missingCountryCode: undefined };
    default:
      return state;
  }
}
