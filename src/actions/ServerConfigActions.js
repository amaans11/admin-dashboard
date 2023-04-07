/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_SERVER_CONFIG_SUCCESS,
  GET_SERVER_CONFIG_URL_SUCCESS,
  SET_SERVER_CONSOLE_CONFIG_SUCCESS,
  GET_CONFIGS_SUCCESS
} from '../shared/actionTypes';

export function getServerConfigs() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/server-config/server-config')
      .then(result => {
        dispatch(getConsoleConfigSuccess(result.data.payload));
      });
  };
}

export const getConsoleConfigSuccess = res => ({
  type: GET_SERVER_CONFIG_SUCCESS,
  res
});

export function getConsoleConfigFromUrl(url) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/server-config/server-config-url', {
        params: { url: url }
      })
      .then(result => {
        dispatch(getConsoleConfigFromUrlSuccess(result.data.payload));
      });
  };
}

export const getConsoleConfigFromUrlSuccess = res => ({
  type: GET_SERVER_CONFIG_URL_SUCCESS,
  res
});

export function getConfigs(url) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/server-config/general-config', {
        params: { url: url }
      })
      .then(result => {
        dispatch(getConfigsSuccess(result.data.payload));
      });
  };
}

export const getConfigsSuccess = res => ({
  type: GET_CONFIGS_SUCCESS,
  res
});

export function setServerConsoleConfig(data) {
  return dispatch => {
    console.log('data', data);
    return axios
      .post(
        INT_API_URL + 'api/tournament/server-config/server-config-url',
        data
      )
      .then(result => {
        dispatch(setServerConsoleConfigSuccess(result.data.payload));
      });
  };
}
export const setServerConsoleConfigSuccess = res => ({
  type: SET_SERVER_CONSOLE_CONFIG_SUCCESS,
  res
});
