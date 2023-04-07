import {
  GET_TOURNAMENTS_SUCCESS,
  API_URL,
  GET_TOURNAMENT_CONFIGS_BY_GAME_SUCCESS,
  GET_ALL_CONFIG_SUCCESS,
  CLONE_CONFIG,
  UPDATE_VIDEO_ID_SUCCESS,
  DEACTIVATE_CONFIG_SUCCESS,
  ACTIVATE_CONFIG_SUCCESS,
  EDIT_CONFIG_SUCCESS,
  FINISH_TOURNAMENT_SUCCESS,
  GET_FINISHABLE_TOURNAMENT_SUCCESS,
  GET_STYLES_SUCCESS,
  INT_API_URL,
  FINISH_LOBBY_SUCCESS,
  GET_GAMES_COLLECTIBLES_BY_ID_SUCCESS
} from '../shared/actionTypes';
import axios from 'axios';

export function getTournaments() {
  return dispatch => {
    return axios
      .get(API_URL + 'config/all')
      .then(result => {
        dispatch(getTournamentsSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}
export function getTournamentsSuccess(val) {
  return { type: GET_TOURNAMENTS_SUCCESS, val };
}
export function getTournamentConfigsByGame(gameId, gameType) {
  return dispatch => {
    return axios
      .get(INT_API_URL + `api/tournament/config/list/${gameId}/-1/${gameType}`)
      .then(result => {
        dispatch(
          getTournamentConfigsByGameSuccess(result.data.payload, gameId)
        );
      })
      .catch(error => {
        throw error;
      });
  };
}
export function getTournamentConfigsByGameSuccess(configs, gameId) {
  return { type: GET_TOURNAMENT_CONFIGS_BY_GAME_SUCCESS, configs, gameId };
}

export function getAllConfig() {
  return dispatch => {
    return axios.get(API_URL + '/configs/all').then(result => {
      dispatch(getAllConfigSuccess(result.data.payload));
    });
  };
}

export const getAllConfigSuccess = res => ({
  type: GET_ALL_CONFIG_SUCCESS,
  res
});
export const cloneConfig = (config, editType) => ({
  type: CLONE_CONFIG,
  config,
  editType
});

// export function editConfig(data) {
//   return dispatch => {
//     return axios
//       .post(API_URL + `config/${data.id}/update`, data)
//       .then(result => {
//         dispatch(editConfigSuccess(result.data.payload));
//       });
//   };
// }
// export const editConfigSuccess = res => ({
//   type: DEACTIVATE_CONFIG_SUCCESS,
//   res
// });
export function editTournamentConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/config/update`, data)
      .then(result => {
        dispatch(editTournamentConfigSuccess(result.data.payload));
      });
  };
}
export const editTournamentConfigSuccess = res => ({
  type: EDIT_CONFIG_SUCCESS,
  res
});

export function activateTournamentConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/config/update`, data)
      .then(result => {
        dispatch(activateTournamentConfigSuccess(result.data.payload));
      });
  };
}
export const activateTournamentConfigSuccess = res => ({
  type: ACTIVATE_CONFIG_SUCCESS,
  res
});

export function deactivateTournamentConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/config/deactivate`, data)
      .then(result => {
        dispatch(deactivateTournamentConfigSuccess(result.data.payload));
      });
  };
}
export const deactivateTournamentConfigSuccess = res => ({
  type: DEACTIVATE_CONFIG_SUCCESS,
  res
});
export function getFinishableTournaments(tournamentType) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
          `api/tournament/config/finishable?isEnded=${tournamentType}`
      )
      .then(result => {
        dispatch(getFinishableTournamentsSuccess(result.data.payload));
      });
  };
}

export const getFinishableTournamentsSuccess = res => ({
  type: GET_FINISHABLE_TOURNAMENT_SUCCESS,
  res
});
export function updateVideoId(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/config/update-videoid`, data)
      .then(result => {
        dispatch(updateVideoIdSuccess(result.data.payload));
      });
  };
}
export const updateVideoIdSuccess = res => ({
  type: UPDATE_VIDEO_ID_SUCCESS,
  res
});

export function finishTournament(id) {
  return dispatch => {
    return axios
      .get(INT_API_URL + `api/tournament/config/finish-tournament?tId=${id}`)
      .then(result => {
        dispatch(finishTournamentSuccess(result.data.payload));
      });
  };
}

export const finishTournamentSuccess = res => ({
  type: FINISH_TOURNAMENT_SUCCESS,
  res
});

export function getStyles() {
  return dispatch => {
    return axios
      .get(INT_API_URL + `api/tournament/config/styles/list`)
      .then(result => {
        dispatch(getStylesSuccess(result.data.payload));
      });
  };
}

export const getStylesSuccess = res => ({ type: GET_STYLES_SUCCESS, res });

export function finishLobby(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tournament/config/finish-lobby', data)
      .then(result => {
        dispatch(finishLobbySuccess(result.data.payload));
      });
  };
}

export const finishLobbySuccess = res => ({
  type: FINISH_LOBBY_SUCCESS,
  res
});

export function getCollectiblesForGameId(gameId) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
          `api/tournament/collectibles/get-collectibles?gameId=${gameId}`
      )
      .then(result => {
        dispatch(getCollectiblesForGameIdSuccess(result.data.payload));
      });
  };
}

export const getCollectiblesForGameIdSuccess = res => ({
  type: GET_GAMES_COLLECTIBLES_BY_ID_SUCCESS,
  res
});
