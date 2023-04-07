/* eslint-disable semi */
import axios from 'axios';
import { INT_API_URL } from '../shared/actionTypes';

import {
  GET_REFERRAL_DETAILS_SUCCESS,
  GET_REFERRAL_USER_DETAILS_SUCCESS
} from '../shared/actionTypes';

export function getReferralDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral/get-referral-details', { params: data })
      .then(result => {
        dispatch(getReferralDetailsSuccess(result.data.payload));
      });
  };
}

export const getReferralDetailsSuccess = res => ({
  type: GET_REFERRAL_DETAILS_SUCCESS,
  res
});
export function getReferredUserDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral/get-referred-user-details', {
        params: data
      })
      .then(result => {
        dispatch(getReferredUserDetailsSuccess(result.data.payload));
      });
  };
}

export const getReferredUserDetailsSuccess = res => ({
  type: GET_REFERRAL_USER_DETAILS_SUCCESS,
  res
});
