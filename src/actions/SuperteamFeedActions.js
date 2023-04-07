/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_FEEDS_ALL_MATCHES_SUCCESS,
  GET_FEEDS_MATCH_ROSTER_SUCCESS,
  UPDATE_FEEDS_MATCH_ROSTER_SUCCESS,
  GET_FEEDS_ALL_LEAGUE_SUCCESS,
  GET_FEEDS_LEAGUE_MATCHES_SUCCESS,
  GET_FEEDS_EDIT_LEAGUE_SUCCESS,
  GET_FEEDS_FULL_MATCH_DETAIL_SUCCESS,
  EDIT_FOOTBALL_FEED_MATCH_DETAIL,
  UPDATE_FOOTBALL_FEED_MATCH_DETAIL_SUCCESS,
  GET_FEEDS_FULL_MATCH_DETAIL_FEED_SUCCESS,
  UPDATE_FEED_PLAYER_POINT,
  UPDATE_FEED_PLAYING_ELEVEN,
  FEEDS_CREATE_LEAGUE_SUCCESS,
  FEEDS_CREATE_NEW_MATCH_ID,
  MOVE_MATCH_FROM_FINISHED_TO_LIVE
} from '../shared/actionTypes';

export function getAllMatches(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-feeds/get-all-matches', {
        params: data
      })
      .then(result => {
        dispatch(getAllMatchesSuccess(result.data.payload));
      });
  };
}
export const getAllMatchesSuccess = res => ({
  type: GET_FEEDS_ALL_MATCHES_SUCCESS,
  res
});

export function getMatchRoster(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-feeds/get-match-roster', {
        params: data
      })
      .then(result => {
        dispatch(getMatchRosterSuccess(result.data.payload));
      });
  };
}
export const getMatchRosterSuccess = res => ({
  type: GET_FEEDS_MATCH_ROSTER_SUCCESS,
  res
});

export function updateMatchRoster(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/update-match-roster', data)
      .then(result => {
        dispatch(updateMatchRosterSuccess(result.data.payload));
      });
  };
}
export const updateMatchRosterSuccess = res => ({
  type: UPDATE_FEEDS_MATCH_ROSTER_SUCCESS,
  res
});

export function getAllLeague() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-feeds/get-all-leagues')
      .then(result => {
        dispatch(getAllLeagueSuccess(result.data.payload));
      });
  };
}
export const getAllLeagueSuccess = res => ({
  type: GET_FEEDS_ALL_LEAGUE_SUCCESS,
  res
});

export function getAllMatchesOfLeague(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-feeds/get-all-match-league', {
        params: data
      })
      .then(result => {
        dispatch(getAllMatchesOfLeagueSuccess(result.data.payload));
      });
  };
}
export const getAllMatchesOfLeagueSuccess = res => ({
  type: GET_FEEDS_LEAGUE_MATCHES_SUCCESS,
  res
});

export function editLeague(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/edit-league', data)
      .then(result => {
        dispatch(editLeagueSuccess(result.data.payload));
      });
  };
}
export const editLeagueSuccess = res => ({
  type: GET_FEEDS_EDIT_LEAGUE_SUCCESS,
  res
});

export function getFullMatchDetail(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-feeds/get-full-match-detail', {
        params: data
      })
      .then(result => {
        dispatch(getFullMatchDetailSuccess(result.data.payload));
      });
  };
}
export const getFullMatchDetailSuccess = res => ({
  type: GET_FEEDS_FULL_MATCH_DETAIL_SUCCESS,
  res
});

export const editFootballFeedMatchDetail = record => ({
  type: EDIT_FOOTBALL_FEED_MATCH_DETAIL,
  record
});

export function updateFootballFeedMatchDetail(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/update-match-detail', data)
      .then(result => {
        dispatch(updateFootballFeedMatchDetailSuccess(result.data.payload));
      });
  };
}
export const updateFootballFeedMatchDetailSuccess = res => ({
  type: UPDATE_FOOTBALL_FEED_MATCH_DETAIL_SUCCESS,
  res
});

export function getFullMatchDetailFeed(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-feeds/get-full-match-detail-feed', {
        params: data
      })
      .then(result => {
        dispatch(getFullMatchDetailFeedSuccess(result.data.payload));
      });
  };
}
export const getFullMatchDetailFeedSuccess = res => ({
  type: GET_FEEDS_FULL_MATCH_DETAIL_FEED_SUCCESS,
  res
});

export function updateFeedPlayerPoints(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/update-player-points', data)
      .then(result => {
        dispatch(updateFeedPlayerPointsSuccess(result.data.payload));
      });
  };
}
export const updateFeedPlayerPointsSuccess = res => ({
  type: UPDATE_FEED_PLAYER_POINT,
  res
});

export function updateFeedPlayingEleven(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/update-playing-eleven', data)
      .then(result => {
        dispatch(updateFeedPlayingElevenSuccess(result.data.payload));
      });
  };
}
export const updateFeedPlayingElevenSuccess = res => ({
  type: UPDATE_FEED_PLAYING_ELEVEN,
  res
});

export function createLeague(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/create-league', data)
      .then(result => {
        dispatch(createLeagueSuccess(result.data.payload));
      });
  };
}
export const createLeagueSuccess = res => ({
  type: FEEDS_CREATE_LEAGUE_SUCCESS,
  res
});

export function createNewMatchId(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-feeds/create-new-match-id', data)
      .then(result => {
        dispatch(createNewMatchIdSuccess(result.data.payload));
      });
  };
}
export const createNewMatchIdSuccess = res => ({
  type: FEEDS_CREATE_NEW_MATCH_ID,
  res
});

export function moveMatchFromFinishedToLive(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-feeds/move-match-from-finished-to-live',
        data
      )
      .then(result => {
        dispatch(moveMatchFromFinishedToLiveSuccess(result.data.payload));
      });
  };
}
export const moveMatchFromFinishedToLiveSuccess = res => ({
  type: MOVE_MATCH_FROM_FINISHED_TO_LIVE,
  res
});
