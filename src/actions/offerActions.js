/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  CREATE_GLOBAL_COUPON_SUCCESS,
  GET_GLOBAL_COUPON_LIST_SUCCESS,
  UPDATE_GLOBAL_COUPON_SUCCESS,
  EDIT_OFFERS,
  CREATE_TICKET_SUCCESS,
  FETCH_TICKETS_SUCCESS,
  CREATE_USER_TICKET_SUCCESS,
  CREATE_BULK_COUPON_SUCCESS,
  GET_USER_PRIME_HISTORY
} from '../shared/actionTypes';

export function createGlobalCoupon(data) {
  return dispatch => {
    return axios.post(INT_API_URL + 'api/offers/create', data).then(result => {
      dispatch(createGlobalCouponSuccess(result.data.payload));
    });
  };
}
export const createGlobalCouponSuccess = res => ({
  type: CREATE_GLOBAL_COUPON_SUCCESS,
  res
});

export function getGlobalCouponList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/offers/get-list', { params: data })
      .then(result => {
        dispatch(getGlobalCouponListSuccess(result.data.payload));
      });
  };
}

export const getGlobalCouponListSuccess = res => ({
  type: GET_GLOBAL_COUPON_LIST_SUCCESS,
  res
});

export function updateGlobalCoupon(data) {
  return dispatch => {
    return axios.post(INT_API_URL + 'api/offers/update', data).then(result => {
      dispatch(updateGlobalCouponSuccess(result.data.payload));
    });
  };
}
export const updateGlobalCouponSuccess = res => ({
  type: UPDATE_GLOBAL_COUPON_SUCCESS,
  res
});

export const editOffers = record => ({
  type: EDIT_OFFERS,
  record
});

export function createTicket(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/offers/create-tournament-tickets', data)
      .then(result => {
        dispatch(createTicketSuccess(result.data.payload));
      });
  };
}
export const createTicketSuccess = res => ({
  type: CREATE_TICKET_SUCCESS,
  res
});

export function fetchTickets(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/offers/get-tournament-tickets', {
        params: data
      })
      .then(result => {
        dispatch(fetchTicketsSuccess(result.data.payload));
      });
  };
}
export const fetchTicketsSuccess = res => ({
  type: FETCH_TICKETS_SUCCESS,
  res
});

export function createUserTournamentTicket(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/offers/create-user-tournament-tickets', data)
      .then(result => {
        dispatch(createUserTournamentTicketSuccess(result.data.payload));
      });
  };
}
export const createUserTournamentTicketSuccess = res => ({
  type: CREATE_USER_TICKET_SUCCESS,
  res
});
export function createBulkCoupon(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/offers/create-bulk-cashback-coupon', data)
      .then(result => {
        dispatch(createBulkCouponSuccess(result.data.payload));
      });
  };
}
export const createBulkCouponSuccess = res => ({
  type: CREATE_BULK_COUPON_SUCCESS,
  res
});
export function getUserPrimeTicketHistory(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/offers/get-user-prime-ticket-history', {
        params: data
      })
      .then(result => {
        dispatch(getUserPrimeTicketHistorySuccess(result.data.payload));
      });
  };
}
export const getUserPrimeTicketHistorySuccess = res => ({
  type: GET_USER_PRIME_HISTORY,
  res
});
