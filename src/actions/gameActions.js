/* eslint-disable semi */
import axios from 'axios';
import {
  FETCH_GAMES_SUCCESS,
  INT_API_URL,
  GET_CONSOLE_CONFIG_SUCCESS,
  SET_FIRST_GAME_SUCCESS,
  SET_GAME_ORDER_SUCCESS,
  GET_GAME_ORDER_SUCCESS,
  UPDATE_GAME_SUCCESS,
  GET_ALL_GAMES_SUCCESS,
  UPDATE_GAME_DESCRIPTION_SUCCESS,
  UPDATE_GAME_ICONS_SUCCESS,
  UPLOAD_GAME_ASSET_SUCCESS,
  GET_PERCENT_GAME_WISE_CONFIG_SUCCESS,
  POST_PERCENT_GAME_WISE_CONFIG_SUCCESS
} from '../shared/actionTypes';
export function fetchGames() {
  return dispatch => {
    return (
      axios
        .get(INT_API_URL + 'api/tournament/game/list')
        // return fetch(API_URL + "/games/all")
        // .then(result => result.json())
        .then(result => {
          dispatch(fetchGamesSuccess(result.data.payload.gameInfo));
        })
        .catch(error => {

        })
    );
  };
}

export const fetchGamesSuccess = games => ({
  type: FETCH_GAMES_SUCCESS,
  games
});

export function getConsoleConfig() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/game/consoleconfig')
      .then(result => {
        dispatch(getConsoleConfigSuccess(result.data.payload));
      });
  };
}

export const getConsoleConfigSuccess = res => ({
  type: GET_CONSOLE_CONFIG_SUCCESS,
  res
});
export function setConsoleConfig(currentCount) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tournament/game/setactive', { currentCount })
      .then(result => {
        dispatch(setConsoleConfigSuccess(result.data.payload));
      });
  };
}
export const setConsoleConfigSuccess = res => ({
  type: SET_FIRST_GAME_SUCCESS,
  res
});

export function getGameOrder(gameType, countryCode = '') {
  return dispatch => {
    return axios
      .get(INT_API_URL + `api/tournament/game/order/${gameType}`, {
        params: { countryCode }
      })
      .then(result => {
        dispatch(getGameOrderSuccess(result.data.payload));
      });
  };
}

export const getGameOrderSuccess = res => ({
  type: GET_GAME_ORDER_SUCCESS,
  res
});

export function setGameOrder(data, gameType, countryCode = '') {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/game/order/${gameType}`, {
        data,
        countryCode
      })
      .then(result => {
        dispatch(setGameOrderSuccess(result.data.payload));
      });
  };
}
export const setGameOrderSuccess = res => ({
  type: SET_GAME_ORDER_SUCCESS,
  res
});
// Update Game
export function updateGame(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/game/update`, data)
      .then(result => {
        dispatch(updateGameSuccess(result.data.payload));
      });
  };
}

export const updateGameSuccess = res => ({
  type: UPDATE_GAME_SUCCESS,
  res
});

// Get all games v2
export function getAllGames(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/game/list-v2', { params: data })
      .then(result => {
        dispatch(getAllGamesSuccess(result.data.payload));
      });
  };
}

export const getAllGamesSuccess = res => ({
  type: GET_ALL_GAMES_SUCCESS,
  res
});
// Update game description
export function updateGameDescription(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/game/update-game`, data)
      .then(result => {
        dispatch(updateGameDescriptionSuccess(result.data.payload));
      });
  };
}

export const updateGameDescriptionSuccess = res => ({
  type: UPDATE_GAME_DESCRIPTION_SUCCESS,
  res
});

export function updateGameIcons(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/tournament/game/update-game', data)
      .then(result => {
        dispatch(updateGameIconsSuccess(result.data.payload));
      });
  };
}

export const updateGameIconsSuccess = res => ({
  type: UPDATE_GAME_ICONS_SUCCESS,
  res
});

export function uploadGameAsset(data) {
  return dispatch => {
    return axios({
      method: 'post',
      url: INT_API_URL + 'api/tournament/game/upload-asset',
      data: data
      // headers: { 'content-type': 'multipart/form-data; boundary=something' }
    }).then(result => {
      dispatch(uploadGameAssetSuccess(result.data));
    });
  };
}

export const uploadGameAssetSuccess = res => ({
  type: UPLOAD_GAME_ASSET_SUCCESS,
  res
});

export function getPercentGameWiseConfig(gameId) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL +
        `api/tournament/percent-game-config/config-by-game/${gameId}`
      )
      .then(result => {
        dispatch(getPercentGameWiseConfigSuccess(result.data.payload));
      });
  };
}

export const getPercentGameWiseConfigSuccess = res => ({
  type: GET_PERCENT_GAME_WISE_CONFIG_SUCCESS,
  res
});

export function postPercentGameWiseConfig({ gameId, gameConfig }) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL +
        `api/tournament/percent-game-config/config-by-game/${gameId}`,
        { gameConfig }
      )
      .then(result => {
        dispatch(postPercentGameWiseConfigSuccess(result.data.payload));
      });
  };
}

export const postPercentGameWiseConfigSuccess = res => ({
  type: POST_PERCENT_GAME_WISE_CONFIG_SUCCESS,
  res
});
