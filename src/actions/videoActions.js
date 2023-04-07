import * as actiontypes from '../shared/actionTypes';
import axios from 'axios';
export function addFeaturedVideo(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/video/addfeatured', data)
      .then(result => {
        dispatch(addFeaturedVideoSuccess(result.data.payload));
      });
  };
}
export const addFeaturedVideoSuccess = res => ({
  type: actiontypes.ADD_FEATURED_VIDEO_SUCCESS,
  res
});

export function getVideoLeaderboard() {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/leaderboard/video-leaderboard')
      .then(result => {
        dispatch(getVideoLeaderboardSuccess(result.data.payload));
      });
  };
}

export const getVideoLeaderboardSuccess = res => ({
  type: actiontypes.GET_VIDEO_LEADERBOARD_SUCCESS,
  res
});

export function getTrendingVideoLeaderboard() {
  return dispatch => {
    return axios
      .get(
        actiontypes.INT_API_URL + 'api/leaderboard/trending-video-leaderboard'
      )
      .then(result => {
        dispatch(getTrendingVideoLeaderboardSuccess(result.data.payload));
      });
  };
}

export const getTrendingVideoLeaderboardSuccess = res => ({
  type: actiontypes.GET_TRENDING_LEADERBORAD_SUCCESS,
  res
});

export function getFeaturedVideos() {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/video/featuredboard')
      .then(result => {
        dispatch(getFeaturedVideosSuccess(result.data.payload));
      });
  };
}

export const getFeaturedVideosSuccess = res => ({
  type: actiontypes.GET_FEATURED_BOARD_SUCCESS,
  res
});

export const addFeaturedVideoAction = (video, videoAction) => ({
  type: actiontypes.ADD_FEATURED_VIDEO,
  video,
  videoAction
});

export function addGameplayToFeaturedVideo(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/video/add-gameplay', data)
      .then(result => {
        dispatch(addGameplayToFeaturedVideoSuccess(result.data.payload));
      });
  };
}
export const addGameplayToFeaturedVideoSuccess = res => ({
  type: actiontypes.ADD_GAMEPLAY_TO_FEATUREDBOARD_SUCCESS,
  res
});

export function changeStatus(status, id, videoType, boardType) {
  var data = {
    status,
    id,
    videoType,
    boardType
  };
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/video/change-status', data)
      .then(result => {
        dispatch(changeStatusSuccess(result.data.payload));
      });
  };
}
export const changeStatusSuccess = res => ({
  type: actiontypes.VIDEO_STATUS_CHANGE_SUCCESS,
  res
});

export function getGameplayVideoByGame(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/video/boardbygame', data)
      .then(result => {
        dispatch(getGameplayVideoByGameSuccess(result.data.payload));
      });
  };
}
export const getGameplayVideoByGameSuccess = res => ({
  type: actiontypes.GET_VIDEO_LEADERBOARD_BY_GAME_SUCCESS,
  res
});
