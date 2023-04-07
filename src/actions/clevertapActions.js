/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_CLEVERTAP_PROFILE_SUCCESS,
  GET_CLEVERTAP_EVENTS_SUCCESS
} from '../shared/actionTypes';

export function getClevertapProfile(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/clevertap/get-profile', data)
      .then(result => {
        dispatch(getClevertapProfileSuccess(result.data.payload));
      });
  };
}

export const getClevertapProfileSuccess = res => ({
  type: GET_CLEVERTAP_PROFILE_SUCCESS,
  res
});

export function getClevertapEvents(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/clevertap/get-events', data)
      .then(result => {
        dispatch(getClevertapEventsSuccess(result.data.payload));
      });
  };
}

export const getClevertapEventsSuccess = res => ({
  type: GET_CLEVERTAP_EVENTS_SUCCESS,
  res
});
