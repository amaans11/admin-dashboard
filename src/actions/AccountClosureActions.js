/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_USER_DELINKED_STATUS,
  SUBMIT_DELINK_USER_REQUEST,
  UPDATE_DELINKING_STATUS
} from '../shared/actionTypes';

export function getUserDelinkedStatus(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/account-closure/get-user-delinked-status', {
        params: data
      })
      .then(result => {
        dispatch(getUserDelinkedStatusSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const getUserDelinkedStatusSuccess = res => ({
  type: GET_USER_DELINKED_STATUS,
  res
});

export function submitDelinkUserRequest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/account-closure/delink-user', data)
      .then(result => {
        dispatch(submitDelinkUserRequestSuccess(result.data.payload));
      });
  };
}

export const submitDelinkUserRequestSuccess = res => ({
  type: SUBMIT_DELINK_USER_REQUEST,
  res
});

export function updateDelinkingStatus(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/account-closure/update-delinking-status', data)
      .then(result => {
        dispatch(updateDelinkingStatusSuccess(result.data.payload));
      });
  };
}

export const updateDelinkingStatusSuccess = res => ({
  type: UPDATE_DELINKING_STATUS,
  res
});
