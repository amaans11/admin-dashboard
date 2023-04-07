/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_FANTASY_CONFIG_SUCCESS,
  SET_FANTASY_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getFantasyConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy-customer/get-fantasy-config', {
        params: data
      })
      .then(result => {
        dispatch(getFantasyConfigSuccess(result.data.payload));
      });
  };
}

export const getFantasyConfigSuccess = res => ({
  type: GET_FANTASY_CONFIG_SUCCESS,
  res
});

export function setFantasyConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy-customer/set-fantasy-config', data)
      .then(result => {
        dispatch(setFantasyConfigSuccess(result.data.payload));
      });
  };
}
export const setFantasyConfigSuccess = res => ({
  type: SET_FANTASY_CONFIG_SUCCESS,
  res
});
