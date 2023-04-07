import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function getLeaderboardHome() {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/leaderboard/boards')
      .then(result => {
        dispatch(getLeaderboardHomeSuccess(result.data.payload));
      });
  };
}

export const getLeaderboardHomeSuccess = res => ({
  type: actionTypes.GET_LEADERBOARD_HOME_SUCCESS,
  res
});
export function getCashLeaderboard() {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/leaderboard/cashboard')
      .then(result => {
        dispatch(getCashLeaderboardSuccess(result.data.payload));
      });
  };
}

export const getCashLeaderboardSuccess = res => ({
  type: actionTypes.GET_CASH_LEADERBOARD_SUCCESS,
  res
});

export function getLeaderboardByGame(data, gameIndex) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/leaderboard/boards/bygame', data)
      .then(result => {
        dispatch(getLeaderboardByGameSuccess(result.data.payload, gameIndex));
      });
  };
}
export const getLeaderboardByGameSuccess = (res, gameIndex) => ({
  type: actionTypes.GET_LEADERBOARD_BY_GAME_SUCCESS,
  res,
  gameIndex
});

export function blockUser(userId, tournamentId, type, blockReason, gameId) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL +
          `api/leaderboard/block?userId=${userId}&tId=${tournamentId}&type=${type}&blockReason=${blockReason}&gameId=${gameId}`
      )
      .then(result => {
        dispatch(blockUserSuserIduccess(result.data.payload));
      });
  };
}

export function unBlockUser(mobile) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + `api/leaderboard/unblock?mn=${mobile}`)
      .then(result => {
        dispatch(unBlockUserSuccess(result.data.payload));
      });
  };
}
export const unBlockUserSuccess = res => ({
  type: actionTypes.UNBLOCK_USER_SUCCESS,
  res
});

export const blockUserSuserIduccess = res => ({
  type: actionTypes.BLOCK_USER_SUCCESS,
  res
});

export function getUserProfile(userId) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + `api/leaderboard/getuser?userId=${userId}`)
      .then(result => {
        dispatch(getUserProfileSuccess(result.data.payload));
      });
  };
}

export const getUserProfileSuccess = res => ({
  type: actionTypes.GET_USER_PROFILE_SUCCESS,
  res
});

export function getUserGamePlay(record) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL +
          `api/leaderboard/getgameplay?uId=${record.userId}&tId=${record.tournament.tournamentId}`
      )
      .then(result => {
        dispatch(getUserGamePlaySuccess(result.data.payload));
      });
  };
}

export const getUserGamePlaySuccess = res => ({
  type: actionTypes.GET_USER_GAMEPLAY_SUCCESS,
  res
});

export function getLeaderboardById(tId) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + `api/leaderboard/getlb?tId=${tId}`)
      .then(result => {
        dispatch(getLeaderboardByIdStIduccess(result.data.payload));
      });
  };
}

export const getLeaderboardByIdStIduccess = res => ({
  type: actionTypes.GET_LEADEBOARD_BY_ID_SUCCESS,
  res
});

export function getLobbyById(tId) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + `api/leaderboard/get-lobby?lobbyId=${tId}`)
      .then(result => {
        dispatch(getLobbyByIdSuccess(result.data.payload));
      });
  };
}

export const getLobbyByIdSuccess = res => ({
  type: actionTypes.GET_LOBBY_BY_ID_SUCCESS,
  res
});

export function getLobbyLeaderboard(tId) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL +
          `api/leaderboard/get-lobby-leaderboard?lobbyId=${tId}`
      )
      .then(result => {
        dispatch(getLobbyLeaderboardSuccess(result.data.payload));
      });
  };
}

export const getLobbyLeaderboardSuccess = res => ({
  type: actionTypes.GET_LOBBY_LEADERBOARD_SUCCESS,
  res
});

export function markTournament(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/leaderboard/mark-tournament', data)
      .then(result => {
        dispatch(markTournamentSuccess(result.data.payload));
      });
  };
}
export const markTournamentSuccess = res => ({
  type: actionTypes.MARK_TOURNAMENT_SUCCESS,
  res
});

export function getAllFinishableTournaments(data) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + 'api/leaderboard/finishable-tournament', {
        params: data
      })
      .then(result => {
        dispatch(getAllFinishableTournamentsSuccess(result.data.payload));
      });
  };
}

export const getAllFinishableTournamentsSuccess = res => ({
  type: actionTypes.GET_ALL_FINISHABLE_TOURNAMENT_SUCCESS,
  res
});

export function blockUserDevice(userId, deviceId, blockReason) {
  return dispatch => {
    return axios
      .get(
        actionTypes.INT_API_URL +
          `api/leaderboard/block?userId=${userId}&deviceId=${deviceId}&blockReason=${blockReason}`
      )
      .then(result => {
        dispatch(blockUserDeviceSuccess(result.data.payload));
      });
  };
}

export const blockUserDeviceSuccess = res => ({
  type: actionTypes.BLOCK_USER_DEVICE_SUCCESS,
  res
});

export function kickUser(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/leaderboard/kick-user', data)
      .then(result => {
        dispatch(kickUserSuccess(result.data.payload));
      });
  };
}
export const kickUserSuccess = res => ({
  type: actionTypes.KICK_USER_SUCCESS,
  res
});

export function unblockUserGame(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/fraud/unblock-user-game', data)
      .then(result => {
        dispatch(unblockUserGameSuccess(result.data.payload));
      });
  };
}
export const unblockUserGameSuccess = res => ({
  type: actionTypes.UNBLOCK_USER_GAME_SUCCESS,
  res
});

export function unblockUserNew(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/fraud/unblock-user', data)
      .then(result => {
        dispatch(unblockUserNewSuccess(result.data.payload));
      });
  };
}
export const unblockUserNewSuccess = res => ({
  type: actionTypes.UNBLOCK_USER_NEW_SUCCESS,
  res
});

export function restoreUserLobby(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/leaderboard/restore-user-lobby',
        data
      )
      .then(result => {
        dispatch(restoreUserLobbySuccess(result.data.payload));
      });
  };
}
export const restoreUserLobbySuccess = res => ({
  type: actionTypes.RESTORE_USER_LOBBY_SUCCESS,
  res
});

export function restoreUserTournament(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/leaderboard/restore-user-tournament',
        data
      )
      .then(result => {
        dispatch(restoreUserTournamentSuccess(result.data.payload));
      });
  };
}
export const restoreUserTournamentSuccess = res => ({
  type: actionTypes.RESTORE_USER_TOURNAMENT_SUCCESS,
  res
});
export const processKickUserRequest = () => ({
  type: actionTypes.PROCESS_KICK_USER_REQUEST
});
export function bulkKickUser(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/leaderboard/kick-user', data)
      .then(result => {
        if (!result.data.payload || !result.data.payload.success) {
          dispatch(kickUserFailed(data));
        }
      });
  };
}
export const kickUserFailed = res => ({
  type: actionTypes.KICK_USER_FAILED,
  res
});

export function finishTournamentDirect(data) {
  return dispatch => {
    return axios
      .post(
        actionTypes.INT_API_URL + 'api/leaderboard/finish-tournament-direct',
        data
      )
      .then(result => {
        dispatch(finishTournamentDirectSuccess(result.data.payload));
      });
  };
}
export const finishTournamentDirectSuccess = res => ({
  type: actionTypes.FINISH_TOURNAMENT_DIRECT,
  res
});
