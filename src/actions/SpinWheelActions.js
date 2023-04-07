/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  SET_SPIN_WHEEL_CONFIG_SUCCESS,
  GET_SPIN_WHEEL_CONFIG_SUCCESS,
  GET_GOLDEN_SPIN_WHEEL_CONFIG_SUCCESS,
  SET_GOLDEN_SPIN_WHEEL_CONFIG_SUCCESS,
  GET_MAIN_SPIN_WHEEL_CONFIG_SUCCESS,
  SET_MAIN_SPIN_WHEEL_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function setSpinWheelConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/spin-wheel/update', data)
      .then(result => {
        dispatch(setSpinWheelConfigSuccess(result.data.payload));
      });
  };
}
export const setSpinWheelConfigSuccess = res => ({
  type: SET_SPIN_WHEEL_CONFIG_SUCCESS,
  res
});

export function getSpinWheelConfigs(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/spin-wheel', { params: data })
      .then(result => {
        dispatch(getSpinWheelConfigsSuccess(result.data.payload));
      });
  };
}

export const getSpinWheelConfigsSuccess = res => ({
  type: GET_SPIN_WHEEL_CONFIG_SUCCESS,
  res
});

export function setGoldenSpinWheelConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/spin-wheel/update-golden-spin-wheel', data)
      .then(result => {
        dispatch(setGoldenSpinWheelConfigSuccess(result.data.payload));
      });
  };
}
export const setGoldenSpinWheelConfigSuccess = res => ({
  type: SET_GOLDEN_SPIN_WHEEL_CONFIG_SUCCESS,
  res
});

export function getGoldenSpinWheelConfigs(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/spin-wheel/golden-spin-wheel', { params: data })
      .then(result => {
        dispatch(getGoldenSpinWheelConfigsSuccess(result.data.payload));
      });
  };
}

export const getGoldenSpinWheelConfigsSuccess = res => ({
  type: GET_GOLDEN_SPIN_WHEEL_CONFIG_SUCCESS,
  res
});

export function setMainSpinWheelConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/spin-wheel/update-main-spin-wheel', data)
      .then(result => {
        dispatch(setMainSpinWheelConfigSuccess(result.data.payload));
      });
  };
}
export const setMainSpinWheelConfigSuccess = res => ({
  type: SET_MAIN_SPIN_WHEEL_CONFIG_SUCCESS,
  res
});

export function getMainSpinWheelConfigs(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/spin-wheel/main-spin-wheel', { params: data })
      .then(result => {
        dispatch(getMainSpinWheelConfigsSuccess(result.data.payload));
      });
  };
}

export const getMainSpinWheelConfigsSuccess = res => ({
  type: GET_MAIN_SPIN_WHEEL_CONFIG_SUCCESS,
  res
});
