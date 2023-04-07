import axios from 'axios';
import {
  INT_API_URL,
  CREATE_SERVICE_CONFIG_SUCCESS,
  GET_COUNTRY_LIST_SUCCESS,
  GET_SERVICE_CONFIGS_LIST_SUCCESS,
  GET_CONFIG_LISTS_BY_PATH_SUCCESS,
  CLONE_SERVICE_CONFIG,
  CLEAR_SERVICE_CONFIG,
  GET_SERVICE_CONFIG_SUCCESS,
  SERVICE_CONFIG_UPDATE_REQUEST_SUCCESS,
  SERVICE_CONFIG_PR_LIST_SUCCESS,
  SERVICE_CONFIG_PR_UPDATE_SUCCESS,
  SERVICE_CONFIGS_COUNTRY_SPECIFIC_LIST_SUCCESS,
  SEARCH_SERVICE_CONFIGS_SUCCESS,
  GET_MISSING_COUNTRY_CONFIGS_SUCCESS,
  EDIT_CONFIG_METADATA_SUCCESS,
  UPDATE_MISSING_COUNTRY,
  RESET_MISSING_COUNTRY
} from '../shared/actionTypes';

export function createServiceConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/config-ms/config', data)
      .then(result => {
        dispatch(createServiceConfigSuccess(result.data.payload));
      });
  };
}

export const createServiceConfigSuccess = res => ({
  type: CREATE_SERVICE_CONFIG_SUCCESS,
  res
});

export function getCountryList() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/country-list')
      .then(result => {
        dispatch(getCountryListSuccess(result.data.payload));
      });
  };
}

export const getCountryListSuccess = res => ({
  type: GET_COUNTRY_LIST_SUCCESS,
  res
});

export function getServiceConfigsList() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/config-paths')
      .then(result => {
        dispatch(getServiceConfigsListSuccess(result.data.payload));
      });
  };
}

export const getServiceConfigsListSuccess = res => ({
  type: GET_SERVICE_CONFIGS_LIST_SUCCESS,
  res
});

export function getConfigsByPath(configPath) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/configs-by-path', {
        params: { configPath }
      })
      .then(result => {
        dispatch(getConfigsByPathSuccess(result.data.payload));
      });
  };
}

export const getConfigsByPathSuccess = res => ({
  type: GET_CONFIG_LISTS_BY_PATH_SUCCESS,
  res
});

export const cloneZkConfig = (cloneConfig, editType) => ({
  type: CLONE_SERVICE_CONFIG,
  cloneConfig,
  editType
});

export const clearZkConfigCloneData = () => ({
  type: CLEAR_SERVICE_CONFIG
});

export function getServiceConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/config', { params: data })
      .then(result => dispatch(getServiceConfigSuccess(result.data.payload)));
  };
}

export const getServiceConfigSuccess = res => ({
  type: GET_SERVICE_CONFIG_SUCCESS,
  res
});

export function requestUpdate(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/config-ms/request-update', data)
      .then(result => dispatch(requestUpdateSuccess(result.data.payload)));
  };
}

export const requestUpdateSuccess = res => ({
  type: SERVICE_CONFIG_UPDATE_REQUEST_SUCCESS,
  res
});

export function getPendingRequests() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/pending-approvals')
      .then(result => dispatch(getPendingRequestsSuccess(result.data.payload)));
  };
}

export const getPendingRequestsSuccess = res => ({
  type: SERVICE_CONFIG_PR_LIST_SUCCESS,
  res
});

export function updateRequest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/config-ms/approve-update', data)
      .then(result => {
        dispatch(updateRequestSuccess(result.data.payload));
      });
  };
}

export const updateRequestSuccess = res => ({
  type: SERVICE_CONFIG_PR_UPDATE_SUCCESS,
  res
});

export function getCountrySpecificConfigs() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/country-specific-configs')
      .then(result => {
        dispatch(getCountrySpecificConfigsSuccess(result.data.payload));
      });
  };
}

export const getCountrySpecificConfigsSuccess = res => ({
  type: SERVICE_CONFIGS_COUNTRY_SPECIFIC_LIST_SUCCESS,
  res
});

export function searchConfigByData(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/search-config', {
        params: data
      })
      .then(result => {
        dispatch(searchConfigByDataSuccess(result.data.payload));
      });
  };
}

export const searchConfigByDataSuccess = res => ({
  type: SEARCH_SERVICE_CONFIGS_SUCCESS,
  res
});

export function getMissingCountryConfigs(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/config-ms/missings-country-configs', {
        params: data
      })
      .then(result => {
        dispatch(getMissingCountryConfigsSuccess(result.data.payload));
      });
  };
}

export const getMissingCountryConfigsSuccess = res => ({
  type: GET_MISSING_COUNTRY_CONFIGS_SUCCESS,
  res
});

export function editConfigMetaData(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/config-ms/edit-config-meta', data)
      .then(result => {
        dispatch(editConfigMetaDataSuccess(result.data.payload));
      });
  };
}

export const editConfigMetaDataSuccess = res => ({
  type: EDIT_CONFIG_METADATA_SUCCESS,
  res
});

export const updateMissingCountry = countryCode => ({
  type: UPDATE_MISSING_COUNTRY,
  countryCode
});

export const resetMissingCountry = () => ({
  type: RESET_MISSING_COUNTRY
});
