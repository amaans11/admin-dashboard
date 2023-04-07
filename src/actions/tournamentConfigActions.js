import * as actions from '../shared/actionTypes.js';
import axios from 'axios';
export function gameConfig(gameData) {
  return {
    type: actions.CREATE_GAME_CONFIG_SUCCESS,
    gameData
  };
}
export function durationConfig(durationData) {
  return {
    type: actions.CREATE_DURATION_CONFIG_SUCCESS,
    durationData
  };
}
export function createTournamentConfig(data) {
  return dispatch => {
    return axios
      .post(actions.INT_API_URL + 'api/tournament/config/create', data)
      .then(result => {
        if (result.data.status) {
          if (result.data.status.code !== 200) {
            localStorage.setItem('createConfig', JSON.stringify(data));
          }
          dispatch(createTournamentConfigSuccess(result.data));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}
export function createTournamentConfigSuccess(res) {
  return { type: actions.CREATE_TOURNAMENT_CONFIG_SUCCESS, res };
}
export function validatePooledRewards(data) {
  return dispatch => {
    return axios
      .post(actions.INT_API_URL + 'api/tournament/config/validate-pool', data)
      .then(result => {
        dispatch(validatePooledRewardsSuccess(result.data.payload));
      });
  };
}
export const validatePooledRewardsSuccess = res => ({
  type: actions.VALIDATE_POOLED_REWARDS,
  res
});

export function getZkRummyConfig(data) {
  return dispatch => {
    return axios
      .get(actions.INT_API_URL + 'api/rummy-configs/get-rummy-config', {
        params: data
      })
      .then(result => {
        dispatch(getZkRummyConfigSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}
// export function getZkRummyConfigSuccess(val) {
//   return { type: actions.GET_ZK_RUMMY_CONFIGS, val };
// }

export const getZkRummyConfigSuccess = res => ({
  type: actions.GET_ZK_RUMMY_CONFIGS,
  res
});
