import * as types from '../shared/actionTypes';

export default function productInfraReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_PROD_INFRA_CLIENT_CONFIGS:
      return { ...state, getProdInfraClientConfigsResponse: action.res };
    case types.SET_PROD_INFRA_CLIENT_CONFIGS:
      return { ...state, setProdInfraClientConfigsResponse: action.res };
    case types.GET_PROD_INFRA_COUNTRY_HOME_MANAGEMENT_CONFIGS:
      return {
        ...state,
        getProdInfraCountryHomeManagementConfigResponse: action.res
      };
    case types.GET_PROD_INFRA_HOME_MANAGEMENT_CONFIGS:
      return { ...state, getProdInfraHomeManagementConfigResponse: action.res };
    case types.SET_PROD_INFRA_MASTER_CONFIGS:
      return { ...state, setProdInfraMasterConfigResponse: action.res };
    case types.SET_PROD_INFRA_PROGRESSIONS:
      return { ...state, setProdInfraProgressionsResponse: action.res };
    case types.SET_PROD_INFRA_PRIME_WIDGET_DATA:
      return { ...state, setProdInfraPrimeWidgetDataResponse: action.res };
    case types.GET_PROD_INFRA_HAMBURGER_CONFIG:
      return { ...state, getProdInfraHamburgerConfigResponse: action.res };
    case types.SET_PROD_INFRA_HAMBURGER_CONFIG:
      return { ...state, setProdInfraHamburgerConfigResponse: action.res };
    default:
      return state;
  }
}
