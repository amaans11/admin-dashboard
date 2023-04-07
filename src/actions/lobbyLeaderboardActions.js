import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function getLobbyLeaderboardHome() {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/lobby-leaderboard/boards')
      .then(result => {
        dispatch(getLobbyLeaderboardHomeSuccess(result.data.payload));
      });
  };
}

export const getLobbyLeaderboardHomeSuccess = res => ({
  type: actionTypes.GET_LOBBY_LEADERBOARD_HOME_SUCCESS,
  res
});

export function getLobbyLeaderboardByGame(data, gameIndex) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/lobby-leaderboard/boards/bygame',
        data
      )
      .then(result => {
        dispatch(
          getLobbyLeaderboardByGameSuccess(result.data.payload, gameIndex)
        );
      });
  };
}
export const getLobbyLeaderboardByGameSuccess = (res, gameIndex) => ({
  type: actionTypes.GET_LOBBY_LEADERBOARD_BY_GAME_SUCCESS,
  res,
  gameIndex
});
