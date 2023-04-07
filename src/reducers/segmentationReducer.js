import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function segmentationReducer(state = {}, action) {
  switch (action.type) {
    case types.CREATE_CUSTOM_SEGMENT_SUCCESS:
      return { ...state, createCustomSegmentResponse: action.res };
    case types.GET_CUSTOM_SEGMENT_LIST_SUCCESS:
      return { ...state, getCustomSegmentListResponse: action.res };
    case types.UPLOAD_CUSTOM_SEGMENT_SUCCESS:
      return { ...state, uploadCustomSegmentResponse: action.res };
    case types.EDIT_UPLOAD_CUSTOM_SEGMENT:
      return {
        ...state,
        customSegmentDetails: {
          record: action.record,
          actionType: action.actionType
        }
      };
    case types.GET_CUSTOM_SEGMENT_UPLOAD_URL_SUCCESS:
      return { ...state, getCustomSegmentUploadUrlResponse: action.res };
    case types.DELETE_CUSTOM_SEGMENT_SUCCESS:
      return { ...state, deleteCustomSegmentResponse: action.res };
    case types.GET_USER_COUNT_SEGMENT_SUCCESS:
      return { ...state, getUserCountSegmentResponse: action.res };
    case types.UPDATE_CUSTOM_SEGMENT_SUCCESS:
      return { ...state, updateCustomSegmentResponse: action.res };
    case types.CLEAR_CUSTOM_SEGMENT_FORM:
      return { ...state, customSegmentDetails: null };
    case types.UPDATE_SEGMENT_PRIORITIES_SUCCESS:
      return { ...state, updateSegmentPrioritiesResponse: action.res };
    case types.GET_CURRENT_HOME_CONFIG_SUCCESS:
      return { ...state, getCurrentHomeConfigResponse: action.res };
    case types.UPDATE_SEGMENT_HOME_CONFIG_SUCCESS:
      return { ...state, updateSegmentHomeConfigResponse: action.res };
    case types.GET_CURRENT_FEATURED_CONFIG_SUCCESS:
      return { ...state, getCurrentFeaturedConfigResponse: action.res };
    case types.UPDATE_FEATURED_CONFIG_SUCCESS:
      return { ...state, updateFeaturedConfigResponse: action.res };
    case types.ADD_GAME_TO_ALL_CUSTOM_SEGMENT_SUCCESS:
      return { ...state, addGameToAllCustomSegmentResponse: action.res };
    case types.GET_USER_SEGMENTS_SUCCESS:
      return { ...state, getUserSegmentsResponse: action.res };
    case types.UPDATE_FEATURED_CONFIG_MULTIPLE_SUCCESS:
      return { ...state, updateFeaturedConfigMultipleResponse: action.res };
    case types.GET_DAY_WISE_USER_SEGMENT_CONFIG_SUCCESS:
      return { ...state, getDayWiseUserSegmentConfigResponse: action.res };
    case types.SET_DAY_WISE_USER_SEGMENT_CONFIG_SUCCESS:
      return { ...state, setDayWiseUserSegmentConfigResponse: action.res };
    default:
      return state;
  }
}
