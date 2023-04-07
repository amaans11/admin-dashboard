/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_ANNOUNCEMENT_CONFIG_SUCCESS,
  SET_POPUP_ANNOUNCEMENT_CONFIG_SUCCESS,
  SET_NEW_DEPOSITOR_ANNOUNCEMENT_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getAnnouncementConfig() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/announcement/announcement-configs')
      .then(result => {
        dispatch(getAnnouncementConfigSuccess(result.data.payload));
      });
  };
}

export const getAnnouncementConfigSuccess = res => ({
  type: GET_ANNOUNCEMENT_CONFIG_SUCCESS,
  res
});

export function setPopupAnnouncement(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/announcement/set-popup-announcement', data)
      .then(result => {
        dispatch(setPopupAnnouncementSuccess(result.data.payload));
      });
  };
}
export const setPopupAnnouncementSuccess = res => ({
  type: SET_POPUP_ANNOUNCEMENT_CONFIG_SUCCESS,
  res
});

export function setNewDepositAnnouncement(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/announcement/set-depositor-announcement', data)
      .then(result => {
        dispatch(setNewDepositAnnouncementSuccess(result.data.payload));
      });
  };
}
export const setNewDepositAnnouncementSuccess = res => ({
  type: SET_NEW_DEPOSITOR_ANNOUNCEMENT_CONFIG_SUCCESS,
  res
});
