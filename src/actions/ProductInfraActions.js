import axios from 'axios';

import {
  INT_API_URL,
  GET_PROD_INFRA_CLIENT_CONFIGS,
  SET_PROD_INFRA_CLIENT_CONFIGS,
  GET_PROD_INFRA_COUNTRY_HOME_MANAGEMENT_CONFIGS,
  GET_PROD_INFRA_HOME_MANAGEMENT_CONFIGS,
  SET_PROD_INFRA_MASTER_CONFIGS,
  SET_PROD_INFRA_PROGRESSIONS,
  SET_PROD_INFRA_PRIME_WIDGET_DATA,
  GET_PROD_INFRA_HAMBURGER_CONFIG,
  SET_PROD_INFRA_HAMBURGER_CONFIG
} from '../shared/actionTypes';

export function getProdInfraClientConfigs(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/prod-infra-configs/get-prod-infra-client-configs',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getProdInfraClientConfigsSuccess(result.data.payload));
      });
  };
}

export const getProdInfraClientConfigsSuccess = res => ({
  type: GET_PROD_INFRA_CLIENT_CONFIGS,
  res
});

export function setProdInfraClientConfigs(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/prod-infra-configs/set-prod-infra-client-configs',
        data
      )
      .then(result => {
        dispatch(setProdInfraClientConfigsSuccess(result.data.payload));
      });
  };
}
export const setProdInfraClientConfigsSuccess = res => ({
  type: SET_PROD_INFRA_CLIENT_CONFIGS,
  res
});

export function getProdInfraCountryHomeManagementConfig(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
          'api/prod-infra-configs/get-prod-infra-country-home-management-config',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(
          getProdInfraCountryHomeManagementConfigSuccess(result.data.payload)
        );
      });
  };
}

export const getProdInfraCountryHomeManagementConfigSuccess = res => ({
  type: GET_PROD_INFRA_COUNTRY_HOME_MANAGEMENT_CONFIGS,
  res
});

export function getProdInfraHomeManagementConfig(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
          'api/prod-infra-configs/get-prod-infra-home-management-config',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getProdInfraHomeManagementConfigSuccess(result.data.payload));
      });
  };
}

export const getProdInfraHomeManagementConfigSuccess = res => ({
  type: GET_PROD_INFRA_HOME_MANAGEMENT_CONFIGS,
  res
});

export function setProdInfraMasterConfig(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/prod-infra-configs/set-prod-infra-master-config',
        data
      )
      .then(result => {
        dispatch(setProdInfraMasterConfigSuccess(result.data.payload));
      });
  };
}
export const setProdInfraMasterConfigSuccess = res => ({
  type: SET_PROD_INFRA_MASTER_CONFIGS,
  res
});

export function setProdInfraProgressions(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/prod-infra-configs/set-prod-infra-progressions',
        data
      )
      .then(result => {
        dispatch(setProdInfraProgressionsSuccess(result.data.payload));
      });
  };
}
export const setProdInfraProgressionsSuccess = res => ({
  type: SET_PROD_INFRA_PROGRESSIONS,
  res
});

export function setProdInfraPrimeWidgetData(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/prod-infra-configs/set-prod-infra-prime-widget-data',
        data
      )
      .then(result => {
        dispatch(setProdInfraPrimeWidgetDataSuccess(result.data.payload));
      });
  };
}
export const setProdInfraPrimeWidgetDataSuccess = res => ({
  type: SET_PROD_INFRA_PRIME_WIDGET_DATA,
  res
});

export function getProdInfraHamburgerConfig(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/prod-infra-configs/get-prod-infra-hamburger-config',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getProdInfraHamburgerConfigSuccess(result.data.payload));
      });
  };
}

export const getProdInfraHamburgerConfigSuccess = res => ({
  type: GET_PROD_INFRA_HAMBURGER_CONFIG,
  res
});

export function setProdInfraHamburgerConfig(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/prod-infra-configs/set-prod-infra-hamburger-config',
        data
      )
      .then(result => {
        dispatch(setProdInfraHamburgerConfigSuccess(result.data.payload));
      });
  };
}
export const setProdInfraHamburgerConfigSuccess = res => ({
  type: SET_PROD_INFRA_HAMBURGER_CONFIG,
  res
});
