/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_KO_PLAYER_LIST_BY_TOURNAMENT,
  SEND_KO_USER_NOTIFICATION,
  REMOVE_KO_USER_FROM_TOURNAMENT,
  PAUSE_KO_TOURNAMENT,
  GET_KO_BATTLE_DETAILS,
  CHANGE_KO_MATCH_WINNER,
  DECLARE_LIVE_BATTLE_WINNER,
  RELEASE_WINNING_FOR_KO_TOURNAMENT,
  REPLACE_USERS_IN_KO_ROUND
} from '../shared/actionTypes';

export function getKoPlayerListByTournament(data) {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/tournament/live-ko/get-ko-player-list-by-tournament',
      {
        params: data
      }
    );
    dispatch(getKoPlayerListByTournamentSuccess(result.data.payload));
  };
}
export const getKoPlayerListByTournamentSuccess = res => ({
  type: GET_KO_PLAYER_LIST_BY_TOURNAMENT,
  res
});

export function sendKoUserNotification(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/send-ko-user-notification',
      data
    );
    dispatch(sendKoUserNotificationSuccess(result.data.payload));
  };
}
export const sendKoUserNotificationSuccess = res => ({
  type: SEND_KO_USER_NOTIFICATION,
  res
});

export function removeKoUserFromTournament(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/remove-ko-user-from-tournament',
      data
    );
    dispatch(removeKoUserFromTournamentSuccess(result.data.payload));
  };
}
export const removeKoUserFromTournamentSuccess = res => ({
  type: REMOVE_KO_USER_FROM_TOURNAMENT,
  res
});

export function pauseKoTournament(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/pause-ko-tournament',
      data
    );
    dispatch(pauseKoTournamentSuccess(result.data.payload));
  };
}
export const pauseKoTournamentSuccess = res => ({
  type: PAUSE_KO_TOURNAMENT,
  res
});

export function getKoBattleDetails(data) {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/tournament/live-ko/get-ko-battle-details',
      {
        params: data
      }
    );
    dispatch(getKoBattleDetailsSuccess(result.data.payload));
  };
}
export const getKoBattleDetailsSuccess = res => ({
  type: GET_KO_BATTLE_DETAILS,
  res
});

export function changeKoMatchWinner(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/change-ko-match-winner',
      data
    );
    dispatch(changeKoMatchWinnerSuccess(result.data.payload));
  };
}
export const changeKoMatchWinnerSuccess = res => ({
  type: CHANGE_KO_MATCH_WINNER,
  res
});

export function declareLiveBattleWinner(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/declare-live-battle-winner',
      data
    );
    dispatch(declareLiveBattleWinnerSuccess(result.data.payload));
  };
}
export const declareLiveBattleWinnerSuccess = res => ({
  type: DECLARE_LIVE_BATTLE_WINNER,
  res
});

export function releaseWinningForKoTournament(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/release-winning-for-ko-tournament',
      data
    );
    dispatch(releaseWinningForKoTournamentSuccess(result.data.payload));
  };
}

export const releaseWinningForKoTournamentSuccess = res => ({
  type: RELEASE_WINNING_FOR_KO_TOURNAMENT,
  res
});

export function replaceUsersinKoRound(data) {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/tournament/live-ko/replace-users-in-ko',
      data
    );
    dispatch(replaceUsersinKoRoundSuccess(result.data.payload));
  };
}

export const replaceUsersinKoRoundSuccess = res => ({
  type: REPLACE_USERS_IN_KO_ROUND,
  res
});
