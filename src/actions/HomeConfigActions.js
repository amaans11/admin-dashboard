/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_CONFIGURABLE_HOME_CONFIG_SUCCESS,
  SET_CONFIGURABLE_HOME_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getConfigurableHomeConfig() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/home-config/current-config')
      .then(result => {
        dispatch(getConfigurableHomeConfigSuccess(result.data.payload));
      });
  };
}

export const getConfigurableHomeConfigSuccess = res => ({
  type: GET_CONFIGURABLE_HOME_CONFIG_SUCCESS,
  res
});

export function setConfigurableHomeConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/home-config/save-config', data)
      .then(result => {
        dispatch(setConfigurableHomeConfigSuccess(result.data.payload));
      });
  };
}
export const setConfigurableHomeConfigSuccess = res => ({
  type: SET_CONFIGURABLE_HOME_CONFIG_SUCCESS,
  res
});
