import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_BOT_TYPES_SUCCESS:
      return { ...state, getBotTypesResponse: action.res };
    case actionTypes.GET_BOT_IMAGE_UPLOAD_URL_SUCCESS:
      return { ...state, getBotImageUploadUrlResponse: action.res };
    case actionTypes.SEND_BOT_MESSAGE_SUCCESS:
      return { ...state, sendBotMessageResponse: action.res };
    default:
      return state;
  }
}
