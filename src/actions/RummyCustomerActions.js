/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_RUMMY_ROUNDS_BY_USER_SUCCESS,
  GET_RUMMY_ROUNDS_BY_TABLE_SUCCESS,
  GET_TURN_DETAILS_SUCCESS,
  GET_ROUNDS_PLAYED_BY_MOBILE_SUCCESS,
  GET_TURNS_BY_ROUND_ID_SUCCESS,
  BULK_FAILED_REFUNDS,
  VALIDATE_UNIQUE_IDS_SUCCESS,
  BULK_TRANSACTION_RUMMY_REFUND_REQUEST,
  PROCESS_REFUND_FAILED
} from '../shared/actionTypes';

export function getRummyRoundsByUser(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/rummy-customer/get-rounds-by-user', {
        params: data
      })
      .then(result => {
        dispatch(getRummyRoundsByUserSuccess(result.data.payload));
      });
  };
}

export const getRummyRoundsByUserSuccess = res => ({
  type: GET_RUMMY_ROUNDS_BY_USER_SUCCESS,
  res
});

export function getRummyRoundsByTable(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/rummy-customer/get-rounds-by-table', {
        params: data
      })
      .then(result => {
        dispatch(getRummyRoundsByTableSuccess(result.data.payload));
      });
  };
}

export const getRummyRoundsByTableSuccess = res => ({
  type: GET_RUMMY_ROUNDS_BY_TABLE_SUCCESS,
  res
});

export function getTurnDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/rummy-customer/get-turn-details', {
        params: data
      })
      .then(result => {
        dispatch(getTurnDetailsSuccess(result.data.payload));
      });
  };
}

export const getTurnDetailsSuccess = res => ({
  type: GET_TURN_DETAILS_SUCCESS,
  res
});

export function getRoundsPlayedByMobile(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/rummy-ops/rounds-played-by-user', {
        params: data
      })
      .then(result => {
        dispatch(getRoundsPlayedByMobileSuccess(result.data.payload));
      });
  };
}

export const getRoundsPlayedByMobileSuccess = res => ({
  type: GET_ROUNDS_PLAYED_BY_MOBILE_SUCCESS,
  res
});

export function getTurnsByRoundId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/rummy-ops/turns-by-round-id', {
        params: data
      })
      .then(result => {
        dispatch(getTurnsByRoundIdSuccess(result.data.payload));
      });
  };
}

export const getTurnsByRoundIdSuccess = res => ({
  type: GET_TURNS_BY_ROUND_ID_SUCCESS,
  res
});

export function validateUniqueIds(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/rummy-ops/validate-unique-ids', data)
      .then(result => {
        const response = result.data.payload;
        if (response.invalidCombos && response.invalidCombos.length > 0) {
          const invalidResults = response.invalidCombos.map(element => ({
            ...element,
            status: 'Failed',
            reason: 'Invalid UserId/Unique Id Combination'
          }));
          dispatch(bulkFailedRefunds(invalidResults));
        }
        dispatch(validateUniqueIdsSuccess(response.validCombos));
      });
  };
}

export const bulkFailedRefunds = res => ({
  type: PROCESS_REFUND_FAILED,
  res
});

export const validateUniqueIdsSuccess = res => ({
  type: VALIDATE_UNIQUE_IDS_SUCCESS,
  res
});

export function bulkTransactionRummyRefundRequest() {
  return (dispatch, getState) => {
    dispatch({ type: BULK_TRANSACTION_RUMMY_REFUND_REQUEST });
  };
}
