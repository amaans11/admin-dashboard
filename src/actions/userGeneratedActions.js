/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_UGT_CONFIG_SUCCESS,
  SET_UGT_CONFIG_SUCCESS,
  GET_UGC_CONFIG_SUCCESS,
  SET_UGC_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getUgtConfigs() {
  return dispatch => {
    return axios.get(INT_API_URL + 'api/ug/ugt').then(result => {
      dispatch(getUgtConfigsSuccess(result.data.payload));
    });
  };
}

export const getUgtConfigsSuccess = res => ({
  type: GET_UGT_CONFIG_SUCCESS,
  res
});

export function setUgtConfigs(data) {
  return dispatch => {
    return axios.post(INT_API_URL + 'api/ug/ugt', data).then(result => {
      dispatch(setUgtConfigsSuccess(result.data.payload));
    });
  };
}
export const setUgtConfigsSuccess = res => ({
  type: SET_UGT_CONFIG_SUCCESS,
  res
});

export function getUgcConfigs(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/ug/ugc', {
        params: data
      })
      .then(result => {
        dispatch(getUgcConfigsSuccess(result.data.payload));
      });
  };
}

export const getUgcConfigsSuccess = res => ({
  type: GET_UGC_CONFIG_SUCCESS,
  res
});

export function setUgcConfigs(data) {
  return dispatch => {
    return axios.post(INT_API_URL + 'api/ug/ugc', data).then(result => {
      dispatch(setUgcConfigsSuccess(result.data.payload));
    });
  };
}
export const setUgcConfigsSuccess = res => ({
  type: SET_UGC_CONFIG_SUCCESS,
  res
});
