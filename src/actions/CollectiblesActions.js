import axios from 'axios';
import {
  INT_API_URL,
  GET_COLLECTIBLES_REDEMPTION,
  GET_COLLECTIBLES_CARD_RESPONSE,
  UPDATE_COLLECTIBLE_REDEMPTION,
  GET_USER_COLLECTIBLE_CARDS,
  GET_USER_COLLECTIBLE_TASK_RESPONSE,
  GET_USER_COLLECTIBLE_TRANSACTION_RESPONSE,
  CREDIT_USER_CARD_RESPONSE
} from '../shared/actionTypes';

export function getCollectiblesRedemption() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/collectibles/collectibles-redemption-data')
      .then(result => {
        dispatch(getCollectiblesRedemptionSuccess(result.data.payload));
      });
  };
}

export const getCollectiblesRedemptionSuccess = res => ({
  type: GET_COLLECTIBLES_REDEMPTION,
  res
});
export function getCollectibleCards() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/collectibles/get-collectible-card')
      .then(result => {
        console.log('result>>', result);
        dispatch(getCollectiblesCardResponse(result.data.payload));
      });
  };
}

export const getCollectiblesCardResponse = res => ({
  type: GET_COLLECTIBLES_CARD_RESPONSE,
  res
});
export function updateColectibleRedemption(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/collectibles/update-collectible-redemption',
        data
      )
      .then(result => {
        dispatch(updateCollectibleRedemptionResponse(result.data.payload));
      });
  };
}

export const updateCollectibleRedemptionResponse = res => ({
  type: UPDATE_COLLECTIBLE_REDEMPTION,
  res
});

export function getCollectibleUserCards(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/collectibles/get-user-collectible-cards', {
        params: data
      })
      .then(result => {
        dispatch(getCollectibleUserCardsResponse(result.data.payload));
      });
  };
}

export const getCollectibleUserCardsResponse = res => ({
  type: GET_USER_COLLECTIBLE_CARDS,
  res
});

export function getUserCollectibleTransaction(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/collectibles/get-user-collectible-transactions', {
        params: data
      })
      .then(result => {
        dispatch(getUserCollectibleTransactionResponse(result.data.payload));
      });
  };
}

export const getUserCollectibleTransactionResponse = res => ({
  type: GET_USER_COLLECTIBLE_TRANSACTION_RESPONSE,
  res
});

export function getUserCollectibleTask(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/collectibles/get-user-collectibles-tasks', {
        params: data
      })
      .then(result => {
        dispatch(getUserCollectibleTaskResponse(result.data.payload));
      });
  };
}

export const getUserCollectibleTaskResponse = res => ({
  type: GET_USER_COLLECTIBLE_TASK_RESPONSE,
  res
});

export function creditUserCard(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/collectibles/credit-collectible-card', data)
      .then(result => {
        dispatch(creditUserCardResponse(result.data.payload));
      });
  };
}

export const creditUserCardResponse = res => ({
  type: CREDIT_USER_CARD_RESPONSE,
  res
});
