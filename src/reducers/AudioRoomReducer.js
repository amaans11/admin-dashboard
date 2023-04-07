import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function AudioRoomReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_AUDIO_ROOM_LIST_SUCCESS:
      return { ...state, getAudioRoomListResponse: action.res };
    case actionTypes.CLOSE_AUDIO_ROOM_SUCCESS:
      return { ...state, closeAudioRoomResponse: action.res };
    case actionTypes.GET_AUDIO_ROOM_TOPICS_SUCCESS:
      return { ...state, getAudioRoomTopicsResponse: action.res };
    case actionTypes.SET_AUDIO_ROOM_TOPICS_SUCCESS:
      return { ...state, setAudioRoomTopicsResponse: action.res };
    case actionTypes.SET_AUDIO_ROOM_FILTER_ORDER_SUCCESS:
      return { ...state, setAudioRoomFilterOrderResponse: action.res };
    case actionTypes.SET_AUDIO_ROOM_TOPICS_PS_SUCCESS:
      return { ...state, setAudioRoomTopicsPsResponse: action.res };
    case actionTypes.SET_AUDIO_ROOM_FILTER_ORDER_PS_SUCCESS:
      return { ...state, setAudioRoomFilterOrderPsResponse: action.res };
    default:
      return state;
  }
}
