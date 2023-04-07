/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_CURRENT_CONFIG_SUCCESS,
  SET_TIER_WIDGET_CONFIG_SUCCESS,
  DELETE_TIER_WIDGET_CONFIG_SUCCESS,
  GET_HOME_MANAGEMENT_CONFIG_SUCCESS,
  SET_HOME_MANAGEMENT_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getCurrentConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tier-widget/current-config', { params: data })
      .then(result => {
        dispatch(getCurrentConfigSuccess(result.data.payload));
      });
  };
}

export const getCurrentConfigSuccess = res => ({
  type: GET_CURRENT_CONFIG_SUCCESS,
  res
});

export function setTierWidget(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tier-widget/save-tier-widget', data)
      .then(result => {
        dispatch(setTierWidgetSuccess(result.data.payload));
      });
  };
}
export const setTierWidgetSuccess = res => ({
  type: SET_TIER_WIDGET_CONFIG_SUCCESS,
  res
});

export function deleteTierWidgetConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tier-widget/delete-tier-config', data)
      .then(result => {
        dispatch(deleteTierWidgetConfigSuccess(result.data.payload));
      });
  };
}
export const deleteTierWidgetConfigSuccess = res => ({
  type: DELETE_TIER_WIDGET_CONFIG_SUCCESS,
  res
});

export function getHomeManagementConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tier-widget/get-home-management-config', {
        params: data
      })
      .then(result => {
        dispatch(getHomeManagementConfigSuccess(result.data.payload));
      });
  };
}

export const getHomeManagementConfigSuccess = res => ({
  type: GET_HOME_MANAGEMENT_CONFIG_SUCCESS,
  res
});

export function setHomeManagementConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tier-widget/set-home-management-config', data)
      .then(result => {
        dispatch(setHomeManagementConfigSuccess(result.data.payload));
      });
  };
}
export const setHomeManagementConfigSuccess = res => ({
  type: SET_HOME_MANAGEMENT_CONFIG_SUCCESS,
  res
});
