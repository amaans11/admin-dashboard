/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_AUDIO_ROOM_LIST_SUCCESS,
  CLOSE_AUDIO_ROOM_SUCCESS,
  GET_AUDIO_ROOM_TOPICS_SUCCESS,
  SET_AUDIO_ROOM_TOPICS_SUCCESS,
  SET_AUDIO_ROOM_FILTER_ORDER_SUCCESS,
  SET_AUDIO_ROOM_TOPICS_PS_SUCCESS,
  SET_AUDIO_ROOM_FILTER_ORDER_PS_SUCCESS
} from '../shared/actionTypes';

export function getAudioRoomList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/audio-chat-room/get-room-list', { params: data })
      .then(result => {
        dispatch(getAudioRoomListSuccess(result.data.payload));
      });
  };
}

export const getAudioRoomListSuccess = res => ({
  type: GET_AUDIO_ROOM_LIST_SUCCESS,
  res
});

export function closeAudioRoom(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/audio-chat-room/close-room', data)
      .then(result => {
        dispatch(closeAudioRoomSuccess(result.data.payload));
      });
  };
}
export const closeAudioRoomSuccess = res => ({
  type: CLOSE_AUDIO_ROOM_SUCCESS,
  res
});

export function getAudioRoomTopics() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/audio-room/get-existing-topics')
      .then(result => {
        dispatch(getAudioRoomTopicsSuccess(result.data.payload));
      });
  };
}

export const getAudioRoomTopicsSuccess = res => ({
  type: GET_AUDIO_ROOM_TOPICS_SUCCESS,
  res
});

export function setAudioRoomTopics(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/audio-room/set-topics-filter-cash', data)
      .then(result => {
        dispatch(setAudioRoomTopicsSuccess(result.data.payload));
      });
  };
}
export const setAudioRoomTopicsSuccess = res => ({
  type: SET_AUDIO_ROOM_TOPICS_SUCCESS,
  res
});

export function setAudioRoomFilterOrder(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/audio-room/set-filter-order-cash', data)
      .then(result => {
        dispatch(setAudioRoomFilterOrderSuccess(result.data.payload));
      });
  };
}
export const setAudioRoomFilterOrderSuccess = res => ({
  type: SET_AUDIO_ROOM_FILTER_ORDER_SUCCESS,
  res
});

export function setAudioRoomTopicsPs(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/audio-room/set-topics-filter-ps', data)
      .then(result => {
        dispatch(setAudioRoomTopicsPsSuccess(result.data.payload));
      });
  };
}
export const setAudioRoomTopicsPsSuccess = res => ({
  type: SET_AUDIO_ROOM_TOPICS_SUCCESS,
  res
});

export function setAudioRoomFilterOrderPs(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/audio-room/set-filter-order-ps', data)
      .then(result => {
        dispatch(setAudioRoomFilterOrderPsSuccess(result.data.payload));
      });
  };
}
export const setAudioRoomFilterOrderPsSuccess = res => ({
  type: SET_AUDIO_ROOM_FILTER_ORDER_SUCCESS,
  res
});
