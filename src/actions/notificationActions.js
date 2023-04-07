/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_BOT_TYPES_SUCCESS,
  SEND_BOT_MESSAGE_SUCCESS
} from '../shared/actionTypes';

export function getBotTypes() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/notification/get-bot-types')
      .then(result => {
        dispatch(getBotTypesSuccess(result.data.payload));
      });
  };
}

export const getBotTypesSuccess = res => ({
  type: GET_BOT_TYPES_SUCCESS,
  res
});

export function sendBotNotification(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/notification/send-notification', data)
      .then(result => {
        dispatch(sendBotNotificationSuccess(result.data.payload));
      });
  };
}
export const sendBotNotificationSuccess = res => ({
  type: SEND_BOT_MESSAGE_SUCCESS,
  res
});
