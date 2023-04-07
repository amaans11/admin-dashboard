import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function getFeaturedEvent(data) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/featured-config/get', {
        params: data
      })
      .then(result => {
        dispatch(getFeaturedEventSuccess(result.data.payload));
      });
  };
}
export const getFeaturedEventSuccess = res => ({
  type: actionTypes.GET_FEATURED_EVENT_SUCCESS,
  res
});

export function updateFeaturedEvent(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/featured-config/update', data)
      .then(result => {
        dispatch(updateFeaturedEventSuccess(result.data.payload));
      });
  };
}
export const updateFeaturedEventSuccess = res => ({
  type: actionTypes.UPDATE_FEATURED_EVENT_SUCCESS,
  res
});
