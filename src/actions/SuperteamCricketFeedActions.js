/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  CRICKET_GET_FEEDS_ALL_MATCHES_SUCCESS,
  CRICKET_GET_FEEDS_MATCH_ROSTER_SUCCESS,
  CRICKET_UPDATE_FEEDS_MATCH_ROSTER_SUCCESS,
  CRICKET_GET_FEEDS_ALL_LEAGUE_SUCCESS,
  CRICKET_GET_FEEDS_LEAGUE_MATCHES_SUCCESS,
  CRICKET_FEEDS_EDIT_LEAGUE_SUCCESS,
  CRICKET_DELETE_UPDATE_ROSTER_SUCCESS,
  CRICKET_GET_FEEDS_FULL_MATCH_DETAIL_SUCCESS,
  CRICKET_GET_FEEDS_FULL_MATCH_DETAIL_FEED_SUCCESS,
  CRICKET_UPDATE_FEED_PLAYER_POINT,
  CRICKET_UPDATE_FEED_PLAYING_ELEVEN,
  CRICKET_MOVE_MATCH_FROM_FINISHED_TO_LIVE,
  EDIT_CRICKET_FEED_MATCH_DETAIL,
  UPDATE_CRICKET_FEED_MATCH_DETAIL_SUCCESS,
  GET_FANTASY_ASSISTANT_MATCHES_SUCCESS,
  GET_ASSISTANT_MATCH_DETAIL_SUCCESS,
  CREATE_INTERNAL_FANTASY_MATCH_SUCCESS,
  PROCESS_C1_FILE_SUCCESS,
  PROCESS_C40_FILE_SUCCESS
} from '../shared/actionTypes';

export function getAllMatches(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-cricket-feeds/get-all-matches', {
        params: data
      })
      .then(result => {
        dispatch(getAllMatchesSuccess(result.data.payload));
      });
  };
}
export const getAllMatchesSuccess = res => ({
  type: CRICKET_GET_FEEDS_ALL_MATCHES_SUCCESS,
  res
});

export function getMatchRoster(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-cricket-feeds/get-match-roster', {
        params: data
      })
      .then(result => {
        dispatch(getMatchRosterSuccess(result.data.payload));
      });
  };
}
export const getMatchRosterSuccess = res => ({
  type: CRICKET_GET_FEEDS_MATCH_ROSTER_SUCCESS,
  res
});

export function updateMatchRoster(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-cricket-feeds/update-match-roster',
        data
      )
      .then(result => {
        dispatch(updateMatchRosterSuccess(result.data.payload));
      });
  };
}
export const updateMatchRosterSuccess = res => ({
  type: CRICKET_UPDATE_FEEDS_MATCH_ROSTER_SUCCESS,
  res
});

export function getAllLeague() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-cricket-feeds/get-all-leagues')
      .then(result => {
        dispatch(getAllLeagueSuccess(result.data.payload));
      });
  };
}
export const getAllLeagueSuccess = res => ({
  type: CRICKET_GET_FEEDS_ALL_LEAGUE_SUCCESS,
  res
});

export function getAllMatchesOfLeague(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-cricket-feeds/get-all-match-league', {
        params: data
      })
      .then(result => {
        dispatch(getAllMatchesOfLeagueSuccess(result.data.payload));
      });
  };
}
export const getAllMatchesOfLeagueSuccess = res => ({
  type: CRICKET_GET_FEEDS_LEAGUE_MATCHES_SUCCESS,
  res
});

export function editLeague(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/superteam-cricket-feeds/edit-league', data)
      .then(result => {
        dispatch(editLeagueSuccess(result.data.payload));
      });
  };
}
export const editLeagueSuccess = res => ({
  type: CRICKET_FEEDS_EDIT_LEAGUE_SUCCESS,
  res
});

export function deleteUpdateRoster(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-cricket-feeds/delete-update-roster',
        data
      )
      .then(result => {
        dispatch(deleteUpdateRosterSuccess(result.data.payload));
      });
  };
}
export const deleteUpdateRosterSuccess = res => ({
  type: CRICKET_DELETE_UPDATE_ROSTER_SUCCESS,
  res
});

export function getFullMatchDetail(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/superteam-cricket-feeds/get-full-match-detail', {
        params: data
      })
      .then(result => {
        dispatch(getFullMatchDetailSuccess(result.data.payload));
      });
  };
}
export const getFullMatchDetailSuccess = res => ({
  type: CRICKET_GET_FEEDS_FULL_MATCH_DETAIL_SUCCESS,
  res
});

export function getFullMatchDetailFeed(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/superteam-cricket-feeds/get-full-match-detail-feed',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getFullMatchDetailFeedSuccess(result.data.payload));
      });
  };
}
export const getFullMatchDetailFeedSuccess = res => ({
  type: CRICKET_GET_FEEDS_FULL_MATCH_DETAIL_FEED_SUCCESS,
  res
});

export function updateFeedPlayerPoints(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-cricket-feeds/update-player-points',
        data
      )
      .then(result => {
        dispatch(updateFeedPlayerPointsSuccess(result.data.payload));
      });
  };
}
export const updateFeedPlayerPointsSuccess = res => ({
  type: CRICKET_UPDATE_FEED_PLAYER_POINT,
  res
});

export function updateFeedPlayingEleven(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-cricket-feeds/update-playing-eleven',
        data
      )
      .then(result => {
        dispatch(updateFeedPlayingElevenSuccess(result.data.payload));
      });
  };
}
export const updateFeedPlayingElevenSuccess = res => ({
  type: CRICKET_UPDATE_FEED_PLAYING_ELEVEN,
  res
});

export function moveMatchFromFinishedToLive(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL +
          'api/superteam-cricket-feeds/move-match-from-finished-to-live',
        data
      )
      .then(result => {
        dispatch(moveMatchFromFinishedToLiveSuccess(result.data.payload));
      });
  };
}
export const moveMatchFromFinishedToLiveSuccess = res => ({
  type: CRICKET_MOVE_MATCH_FROM_FINISHED_TO_LIVE,
  res
});

export const editCricketFeedMatchDetail = record => ({
  type: EDIT_CRICKET_FEED_MATCH_DETAIL,
  record
});

export function updateCricketFeedMatchDetail(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/superteam-cricket-feeds/update-match-detail',
        data
      )
      .then(result => {
        dispatch(updateCricketFeedMatchDetailSuccess(result.data.payload));
      });
  };
}
export const updateCricketFeedMatchDetailSuccess = res => ({
  type: UPDATE_CRICKET_FEED_MATCH_DETAIL_SUCCESS,
  res
});

export function getFantasyAssistantMatchDetailByDate(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
          'api/superteam-cricket-feeds/get-assistant-match-detail-by-date',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getAssistantMatchesSuccess(result.data.payload));
      });
  };
}

export const getAssistantMatchesSuccess = res => ({
  type: GET_FANTASY_ASSISTANT_MATCHES_SUCCESS,
  res
});

export function getFantasyAssistantMatchDetailById(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
          'api/superteam-cricket-feeds/get-assistant-match-detail-by-id',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getAssistantMatchDetailSuccess(result.data.payload));
      });
  };
}
export const getAssistantMatchDetailSuccess = res => ({
  type: GET_ASSISTANT_MATCH_DETAIL_SUCCESS,
  res
});

export function createInternalFantasyAssistant(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL +
          'api/superteam-cricket-feeds/create-internal-fantasy-assistant',
        data
      )
      .then(result => {
        dispatch(createInternalFantasyAssistantSuccess(result.data.payload));
      });
  };
}
export const createInternalFantasyAssistantSuccess = res => ({
  type: CREATE_INTERNAL_FANTASY_MATCH_SUCCESS,
  res
});

export function processC1FileForAsssistant(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL +
          'api/superteam-cricket-feeds/process-c1-file-for-asssistant',
        data
      )
      .then(result => {
        dispatch(processC1FileForAsssistantSuccess(result.data.payload));
      });
  };
}
export const processC1FileForAsssistantSuccess = res => ({
  type: PROCESS_C1_FILE_SUCCESS,
  res
});
export function processC40FileForAsssistant(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL +
          'api/superteam-cricket-feeds/process-c40-file-for-asssistant',
        data
      )
      .then(result => {
        dispatch(processC40FileForAsssistantSuccess(result.data.payload));
      });
  };
}
export const processC40FileForAsssistantSuccess = res => ({
  type: PROCESS_C40_FILE_SUCCESS,
  res
});
