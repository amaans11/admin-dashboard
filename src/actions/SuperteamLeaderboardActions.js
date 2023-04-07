/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  CREATE_DEFAULT_BANNER_SUCCESS,
  EDIT_DEFAULT_BANNER_SUCCESS,
  GET_ALL_DEFAULT_BANNER_SUCCESS,
  EDIT_SL_BANNER,
  GET_SL_ALL_LEAGUE_LIST_SUCCESS,
  GET_SL_ALL_MATCH_LEAGUE_SUCCESS,
  CREATE_LEADERBOARD_SUCCESS,
  EDIT_LEADERBOARD_DETAILS_SUCCESS,
  EDIT_LEADERBOARD_SUCCESS,
  GET_ALL_LEADERBOARD_SUCCESS,
  CLEAR_LEADERBOARD_FORM,
  SL_INITIATE_WINNINGS_SUCCESS,
  GET_LEADERBOARD_MATCH_DETIAL_SUCCESS,
  UPDATE_LEADERBOARD_STATUS_SUCCESS,
  GET_MATCH_LEVEL_MONEY_SUCCESS,
  GET_CONTEST_LEVEL_MONEY_SUCCESS,
  GET_FULL_LEADERBOARD_DETAILS_SUCCESS,
  GET_ST_SEGMENT_LIST_SUCCESS
} from '../shared/actionTypes';

export function createDefaultBanner(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-leaderboard/create-default-banner',
        data
      )
      .then(result => {
        dispatch(createDefaultBannerSuccess(result.data.payload));
      });
  };
}
export const createDefaultBannerSuccess = res => ({
  type: CREATE_DEFAULT_BANNER_SUCCESS,
  res
});

export function editDefaultBanner(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-leaderboard/edit-default-banner', data)
      .then(result => {
        dispatch(editDefaultBannerSuccess(result.data.payload));
      });
  };
}
export const editDefaultBannerSuccess = res => ({
  type: EDIT_DEFAULT_BANNER_SUCCESS,
  res
});

export function getAllDefaultBanner(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-default-banners', {
        params: data
      })
      .then(result => {
        dispatch(getAllDefaultBannerSuccess(result.data.payload));
      });
  };
}
export const getAllDefaultBannerSuccess = res => ({
  type: GET_ALL_DEFAULT_BANNER_SUCCESS,
  res
});

export const editSlBanner = (slBannerDetails, actionType) => ({
  type: EDIT_SL_BANNER,
  data: {
    slBannerDetails: slBannerDetails,
    actionType: actionType
  }
});

export function getAllLeagueList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-all-leagues', {
        params: data
      })
      .then(result => {
        dispatch(getAllLeagueListSuccess(result.data.payload));
      });
  };
}
export const getAllLeagueListSuccess = res => ({
  type: GET_SL_ALL_LEAGUE_LIST_SUCCESS,
  res
});

export function getAllMatchLeague(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-all-match-league', {
        params: data
      })
      .then(result => {
        dispatch(getAllMatchLeagueSuccess(result.data.payload));
      });
  };
}
export const getAllMatchLeagueSuccess = res => ({
  type: GET_SL_ALL_MATCH_LEAGUE_SUCCESS,
  res
});

export const clearLeaderboardForm = () => ({
  type: CLEAR_LEADERBOARD_FORM
});

export function createLeaderboard(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-leaderboard/create-leaderboard', data)
      .then(result => {
        dispatch(createLeaderboardSuccess(result.data.payload));
      });
  };
}
export const createLeaderboardSuccess = res => ({
  type: CREATE_LEADERBOARD_SUCCESS,
  res
});

export function getAllLeaderboard(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-all-leaderboard', {
        params: data
      })
      .then(result => {
        dispatch(getAllLeaderboardSuccess(result.data.payload));
      });
  };
}
export const getAllLeaderboardSuccess = res => ({
  type: GET_ALL_LEADERBOARD_SUCCESS,
  res
});

export const editLeaderboardDetials = (leaderboardDetails, actionType) => ({
  type: EDIT_LEADERBOARD_DETAILS_SUCCESS,
  data: {
    leaderboardDetails: leaderboardDetails,
    actionType: actionType
  }
});

export function getLeaderboardMatchDetail(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/superteam-leaderboard/get-leaderboard-match-detail',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getLeaderboardMatchDetailSuccess(result.data.payload));
      });
  };
}
export const getLeaderboardMatchDetailSuccess = res => ({
  type: GET_LEADERBOARD_MATCH_DETIAL_SUCCESS,
  res
});

export function editLeaderboard(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-leaderboard/edit-leaderboard', data)
      .then(result => {
        dispatch(editLeaderboardSuccess(result.data.payload));
      });
  };
}
export const editLeaderboardSuccess = res => ({
  type: EDIT_LEADERBOARD_SUCCESS,
  res
});

export function initiateWinnings(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-leaderboard/initiate-winnings', data)
      .then(result => {
        dispatch(initiateWinningsSuccess(result.data.payload));
      });
  };
}
export const initiateWinningsSuccess = res => ({
  type: SL_INITIATE_WINNINGS_SUCCESS,
  res
});

export function updateLeaderboardStatus(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-leaderboard/update-leaderboard-status',
        data
      )
      .then(result => {
        dispatch(updateLeaderboardStatusSuccess(result.data.payload));
      });
  };
}
export const updateLeaderboardStatusSuccess = res => ({
  type: UPDATE_LEADERBOARD_STATUS_SUCCESS,
  res
});

export function getMatchLevelMoney(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-match-level-money', {
        params: data
      })
      .then(result => {
        dispatch(getMatchLevelMoneySuccess(result.data.payload));
      });
  };
}
export const getMatchLevelMoneySuccess = res => ({
  type: GET_MATCH_LEVEL_MONEY_SUCCESS,
  res
});

export function getContestLevelMoney(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-contest-level-money', {
        params: data
      })
      .then(result => {
        dispatch(getContestLevelMoneySuccess(result.data.payload));
      });
  };
}
export const getContestLevelMoneySuccess = res => ({
  type: GET_CONTEST_LEVEL_MONEY_SUCCESS,
  res
});

export function getFullLeaderboard(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/superteam-leaderboard/get-full-leaderboard-details',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getFullLeaderboardSuccess(result.data.payload));
      });
  };
}
export const getFullLeaderboardSuccess = res => ({
  type: GET_FULL_LEADERBOARD_DETAILS_SUCCESS,
  res
});

export function getStSegmentList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-leaderboard/get-st-segment-list', {
        params: data
      })
      .then(result => {
        dispatch(getStSegmentListSuccess(result.data.payload));
      });
  };
}
export const getStSegmentListSuccess = res => ({
  type: GET_ST_SEGMENT_LIST_SUCCESS,
  res
});
