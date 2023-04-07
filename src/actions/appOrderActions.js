import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function getMainOrder(gameId) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + `api/tournament/order/app/${gameId}`)
      .then(result => {
        dispatch(getMainOrderSuccess(result.data.payload));
      });
  };
}

export const getMainOrderSuccess = res => ({
  type: actionTypes.GET_MAIN_ORDER_SUCCESS,
  res
});

export function updateMainOrder(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + `api/tournament/order/app/update`, data)
      .then(result => {
        updateMainOrderSuccess(result.data.payload);
      });
  };
}
export const updateMainOrderSuccess = res => ({
  type: actionTypes.UPDATE_MAIN_ORDER_SUCCESS,
  res
});
