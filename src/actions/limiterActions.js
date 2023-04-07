import {
  CREATE_LIMITER_SUCCESS,
  GET_LIMITER_LIST_SUCCESS,
  UPDATE_LIMITER_SUCCESS,
  INT_API_URL
} from '../shared/actionTypes';
import axios from 'axios';

export function createLimiter(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tournament/limiter/create', data)
      .then(result => {
        dispatch(createLimiterSuccess(result.data.payload));
      });
  };
}
export const createLimiterSuccess = res => ({
  type: CREATE_LIMITER_SUCCESS,
  res
});
export function getLimiterList() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/limiter/list')
      .then(result => {
        dispatch(getLimiterListSuccess(result.data.payload));
      });
  };
}

export const getLimiterListSuccess = res => ({
  type: GET_LIMITER_LIST_SUCCESS,
  res
});

export function updateLimiter(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tournament/limiter/update', data)
      .then(result => {
        dispatch(updateLimiterSuccess(result.data.payload));
      });
  };
}
export const updateLimiterSuccess = res => ({
  type: UPDATE_LIMITER_SUCCESS,
  res
});
