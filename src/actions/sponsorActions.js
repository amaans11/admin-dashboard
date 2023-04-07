import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function createSponsor(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/tournament/sponsor/create', data)
      .then(result => {
        dispatch(createSponsorSuccess(result.data.payload));
      });
  };
}
export const createSponsorSuccess = res => ({
  type: actionTypes.CREATE_SPONSOR_SUCCESS,
  res
});
export function getSponsorList(sponsorStatus) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL + `api/tournament/sponsor/list/${sponsorStatus}`
      )
      .then(result => {
        dispatch(getSponsorListSuccess(result.data.payload));
      });
  };
}

export const getSponsorListSuccess = res => ({
  type: actionTypes.GET_SPONSOR_LIST_SUCCESS,
  res
});

export function updateSponsor(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/tournament/sponsor/update', data)
      .then(result => {
        dispatch(updateSponsorSuccess(result.data.payload));
      });
  };
}
export const updateSponsorSuccess = res => ({
  type: actionTypes.UPDATE_SPONSOR_SUCCESS,
  res
});
