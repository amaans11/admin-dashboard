/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  PROCESS_RUMMY_WINNINGS_SUCCESS,
  GET_USER_TRANSACTIONS_SUCCESS,
  GET_USER_TRANSACTION_LIST_SUCCESS,
  PROCESS_TRANSACTION_REFUND_SUCCESS,
  PROCESS_REFUND_FAILED,
  BULK_TRANSACTION_REFUND_RESPONSE,
  GET_REFUND_CONFIG,
  PROCESS_POKER_WINNINGS_RESPONSE,
  PROCESS_POKER_RESPONSE,
  GET_USER_REFUND_DETAILS_SUCCESS,
  PROCESS_PROMO_DEPOSITS_SUCCESS,
  GET_USER_PRIME_TRANSACTION_HISTORY,
  DEBIT_MONEY,
  CONVERT_MONEY
} from '../shared/actionTypes';

export function processRummyWinnings(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/accounts/process-rummy-winnings', data)
      .then(result => {
        dispatch(processRummyWinningsSuccess(result.data.payload));
      });
  };
}

export const processRummyWinningsSuccess = res => ({
  type: PROCESS_RUMMY_WINNINGS_SUCCESS,
  res
});

export function getUserTransactions(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/accounts/user-latest-transactions', {
        params: data
      })
      .then(result => {
        dispatch(getUserTransactionsSuccess(result.data.payload));
      });
  };
}
export const getUserTransactionsSuccess = res => ({
  type: GET_USER_TRANSACTIONS_SUCCESS,
  res
});

export function getUserTransactionList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/accounts/get-user-transaction-details', {
        params: data
      })
      .then(result => {
        dispatch(getUserTransactionListSuccess(result.data.payload));
      });
  };
}
export const getUserTransactionListSuccess = res => ({
  type: GET_USER_TRANSACTION_LIST_SUCCESS,
  res
});

export function processTransactionRefund(data, type) {
  return async (dispatch, getState) => {
    return axios
      .post(INT_API_URL + 'api/accounts/process-transaction-refund', data)
      .then(result => {
        dispatch(processTransactionRefundSuccess(result.data.payload));
      });
  };
}
export const processTransactionRefundSuccess = res => ({
  type: PROCESS_TRANSACTION_REFUND_SUCCESS,
  res
});
export function processBulkTransactionsRefund(data) {
  return async (dispatch, getState) => {
    return axios
      .post(INT_API_URL + 'api/accounts/process-transaction-refund', data)
      .then(result => {
        if (!result.data.payload || result.data.payload.error) {
          let uniqueId = data.referenceId.split('_')
            ? data.referenceId.split('_')[1]
            : '';
          const failedRefund = [
            {
              userId: data.userId,
              referenceId: data.referenceId,
              uniqueId: uniqueId,
              reason: result.data.payload.error
                ? result.data.payload.error.message
                : 'Refund already processed for this reference Id'
            }
          ];
          dispatch(processRefundFailed(failedRefund));
        }
      });
  };
}

export const processRefundFailed = res => ({
  type: PROCESS_REFUND_FAILED,
  res
});

export function refundFailed(failedRefunds) {
  return dispatch => {
    dispatch(processRefundFailed(failedRefunds));
  };
}

export function bulkTransactionRefundRequest() {
  return (dispatch, getState) => {
    dispatch(bulkTransactionRefundResponse());
  };
}
export const bulkTransactionRefundResponse = () => ({
  type: BULK_TRANSACTION_REFUND_RESPONSE
});

export function getRefundConfig() {
  return async (dispatch, getState) => {
    return axios
      .get(INT_API_URL + 'api/accounts/check-refund-config')
      .then(result => {
        dispatch(getRefundConfigSuccess(result.data.payload));
      });
  };
}

export const getRefundConfigSuccess = res => ({
  type: GET_REFUND_CONFIG,
  res
});

export function procesPokerWinnings(data) {
  return async (dispatch, getState) => {
    return axios
      .post(INT_API_URL + 'api/accounts/process-poker-winnings', data)
      .then(result => {
        if (result.data.payload && result.data.payload.error) {
          const userId = Object.keys(data.userAmount)[0]
            ? Object.keys(data.userAmount)[0]
            : '';
          const amount = Object.values(data.userAmount)[0]
            ? Object.values(data.userAmount)[0]
            : '';

          let response = {
            userId: userId,
            amount: amount,
            accountType: data.moneyType,
            failedReason: result.data.payload.error.message
              ? result.data.payload.error.message
              : 'Something went wrong'
          };
          dispatch(procesPokerWinningsResponse(response));
        }
      });
  };
}
export function getUserRefundDetails(data) {
  return async (dispatch, getState) => {
    return axios
      .get(INT_API_URL + 'api/accounts/get-user-refund-details', {
        params: data
      })
      .then(result => {
        dispatch(getUserRefundDetailsSuccess(result.data.payload));
      });
  };
}

export const procesPokerWinningsResponse = res => ({
  type: PROCESS_POKER_WINNINGS_RESPONSE,
  res
});

export function processPokerRequest() {
  return async (dispatch, getState) => {
    dispatch(procesPokerResponse());
  };
}

export const procesPokerResponse = () => ({
  type: PROCESS_POKER_RESPONSE
});
export const getUserRefundDetailsSuccess = res => ({
  type: GET_USER_REFUND_DETAILS_SUCCESS,
  res
});

export function processPromoDeposits(data, type) {
  return async (dispatch, getState) => {
    return axios
      .post(INT_API_URL + 'api/accounts/process-promo-deposits', data)
      .then(result => {
        dispatch(processPromoDepositsSuccess(result.data.payload));
      });
  };
}
export const processPromoDepositsSuccess = res => ({
  type: PROCESS_PROMO_DEPOSITS_SUCCESS,
  res
});

export function getUserPrimeTransactionHistory(data) {
  return async (dispatch, getState) => {
    return axios
      .get(INT_API_URL + 'api/accounts/get-user-prime-transaction-history', {
        params: data
      })
      .then(result => {
        dispatch(getUserPrimeTransactionHistorySuccess(result.data.payload));
      });
  };
}
export const getUserPrimeTransactionHistorySuccess = res => ({
  type: GET_USER_PRIME_TRANSACTION_HISTORY,
  res
});

export function debitMoney(data) {
  return async dispatch => {
    return axios
      .post(INT_API_URL + 'api/accounts/process-refunds', data)
      .then(result => {
        dispatch(debitMoneySuccess(result.data.payload));
      });
  };
}
export const debitMoneySuccess = res => ({
  type: DEBIT_MONEY
});
export function convertMoney(data) {
  return async (dispatch, getState) => {
    return axios
      .post(INT_API_URL + 'api/accounts/convert-money', data)
      .then(result => {
        dispatch(convertMoneySuccess(result.data.payload));
      });
  };
}
export const convertMoneySuccess = res => ({
  type: CONVERT_MONEY,
  res
});
