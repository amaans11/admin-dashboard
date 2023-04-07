/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  SET_SEARCH_CONFIG_SUCCESS,
  SET_SEARCH_CUSTOM_CONFIG_SUCCESS,
  GET_SEARCH_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getSearchConfig() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/search-config/search-config')
      .then(result => {
        dispatch(getSearchConfigSuccess(result.data.payload));
      });
  };
}

export const getSearchConfigSuccess = res => ({
  type: GET_SEARCH_CONFIG_SUCCESS,
  res
});

export function setSearchConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/search-config/search-config-hero', data)
      .then(result => {
        dispatch(setSearchConfigSuccess(result.data.payload));
      });
  };
}
export const setSearchConfigSuccess = res => ({
  type: SET_SEARCH_CONFIG_SUCCESS,
  res
});

export function setSearchCustomConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/search-config/search-custom-config', data)
      .then(result => {
        dispatch(setSearchCustomConfigSuccess(result.data.payload));
      });
  };
}
export const setSearchCustomConfigSuccess = res => ({
  type: SET_SEARCH_CUSTOM_CONFIG_SUCCESS,
  res
});
