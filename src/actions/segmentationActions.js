import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function createCustomSegment(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/segmentation/create-segment', data)
      .then(result => {
        dispatch(createCustomSegmentSuccess(result.data.payload));
      });
  };
}
export const createCustomSegmentSuccess = res => ({
  type: actionTypes.CREATE_CUSTOM_SEGMENT_SUCCESS,
  res
});

export function getCustomSegmentList() {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/segmentation/get-all-segments')
      .then(result => {
        dispatch(getCustomSegmentListSuccess(result.data.payload));
      });
  };
}

export const getCustomSegmentListSuccess = res => ({
  type: actionTypes.GET_CUSTOM_SEGMENT_LIST_SUCCESS,
  res
});

export function uploadCustomSegment(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/segmentation/upload-segment', data)
      .then(result => {
        dispatch(uploadCustomSegmentSuccess(result.data.payload));
      });
  };
}
export const uploadCustomSegmentSuccess = res => ({
  type: actionTypes.UPLOAD_CUSTOM_SEGMENT_SUCCESS,
  res
});

export const editUploadCustomSegment = (record, actionType) => ({
  type: actionTypes.EDIT_UPLOAD_CUSTOM_SEGMENT,
  record,
  actionType
});

export function getCustomSegmentUploadUrl(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/storage/segmentation-url', data)
      .then(result => {
        dispatch(getCustomSegmentUploadUrlSuccess(result.data.payload));
      });
  };
}
export const getCustomSegmentUploadUrlSuccess = res => ({
  type: actionTypes.GET_CUSTOM_SEGMENT_UPLOAD_URL_SUCCESS,
  res
});

export function deleteCustomSegment(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/segmentation/delete-segment', data)
      .then(result => {
        dispatch(deleteCustomSegmentSuccess(result.data.payload));
      });
  };
}
export const deleteCustomSegmentSuccess = res => ({
  type: actionTypes.DELETE_CUSTOM_SEGMENT_SUCCESS,
  res
});

export function getUserCountSegment(data) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL + 'api/segmentation/get-user-count-segment',
        { params: data }
      )
      .then(result => {
        dispatch(getUserCountSegmentSuccess(result.data.payload));
      });
  };
}
export const getUserCountSegmentSuccess = res => ({
  type: actionTypes.GET_USER_COUNT_SEGMENT_SUCCESS,
  res
});

export function updateCustomSegment(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/segmentation/update-segment', data)
      .then(result => {
        dispatch(updateCustomSegmentSuccess(result.data.payload));
      });
  };
}
export const updateCustomSegmentSuccess = res => ({
  type: actionTypes.UPDATE_CUSTOM_SEGMENT_SUCCESS,
  res
});

export const clearForm = () => ({
  type: actionTypes.CLEAR_CUSTOM_SEGMENT_FORM
});

export function updateSegmentPriorities(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/segmentation/update-priorities',
        data
      )
      .then(result => {
        dispatch(updateSegmentPrioritiesSuccess(result.data.payload));
      });
  };
}
export const updateSegmentPrioritiesSuccess = res => ({
  type: actionTypes.UPDATE_SEGMENT_PRIORITIES_SUCCESS,
  res
});

export function getCurrentHomeConfig(data) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/segmentation/current-home-config', {
        params: data
      })
      .then(result => {
        dispatch(getCurrentHomeConfigSuccess(result.data.payload));
      });
  };
}
export const getCurrentHomeConfigSuccess = res => ({
  type: actionTypes.GET_CURRENT_HOME_CONFIG_SUCCESS,
  res
});

export function updateSegmentHomeConfig(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/segmentation/save-home-config', data)
      .then(result => {
        dispatch(updateSegmentHomeConfigSuccess(result.data.payload));
      });
  };
}
export const updateSegmentHomeConfigSuccess = res => ({
  type: actionTypes.UPDATE_SEGMENT_HOME_CONFIG_SUCCESS,
  res
});

export function getCurrentFeaturedConfig(data) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL + 'api/segmentation/current-featured-config',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getCurrentFeaturedConfigSuccess(result.data.payload));
      });
  };
}
export const getCurrentFeaturedConfigSuccess = res => ({
  type: actionTypes.GET_CURRENT_FEATURED_CONFIG_SUCCESS,
  res
});

export function updateFeaturedConfig(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/segmentation/save-featured-config',
        data
      )
      .then(result => {
        dispatch(updateFeaturedConfigSuccess(result.data.payload));
      });
  };
}
export const updateFeaturedConfigSuccess = res => ({
  type: actionTypes.UPDATE_FEATURED_CONFIG_SUCCESS,
  res
});

export function addGameToAllCustomSegment(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/segmentation/update-game-home-config',
        data
      )
      .then(result => {
        dispatch(addGameToAllCustomSegmentSuccess(result.data.payload));
      });
  };
}
export const addGameToAllCustomSegmentSuccess = res => ({
  type: actionTypes.ADD_GAME_TO_ALL_CUSTOM_SEGMENT_SUCCESS,
  res
});

export function getUserSegments(data) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/segmentation/get-user-segments', {
        params: data
      })
      .then(result => {
        dispatch(getUserSegmentsSuccess(result.data.payload));
      });
  };
}
export const getUserSegmentsSuccess = res => ({
  type: actionTypes.GET_USER_SEGMENTS_SUCCESS,
  res
});

export function updateFeaturedConfigMultiple(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL +
          'api/segmentation/save-featured-config-multiple',
        data
      )
      .then(result => {
        dispatch(updateFeaturedConfigMultipleSuccess(result.data.payload));
      });
  };
}
export const updateFeaturedConfigMultipleSuccess = res => ({
  type: actionTypes.UPDATE_FEATURED_CONFIG_MULTIPLE_SUCCESS,
  res
});

export function getDayWiseUserSegmentConfig(data) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL +
          'api/segmentation/get-day-wise-user-segment-config',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getDayWiseUserSegmentConfigSuccess(result.data.payload));
      });
  };
}
export const getDayWiseUserSegmentConfigSuccess = res => ({
  type: actionTypes.GET_DAY_WISE_USER_SEGMENT_CONFIG_SUCCESS,
  res
});

export function setDayWiseUserSegmentConfig(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL +
          'api/segmentation/save-day-wise-user-segment-config',
        data
      )
      .then(result => {
        dispatch(setDayWiseUserSegmentConfigSuccess(result.data.payload));
      });
  };
}
export const setDayWiseUserSegmentConfigSuccess = res => ({
  type: actionTypes.SET_DAY_WISE_USER_SEGMENT_CONFIG_SUCCESS,
  res
});
