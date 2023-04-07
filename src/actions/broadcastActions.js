import axios from 'axios';
import {
  GET_BATTLES_FOR_GB,
  GET_BROADCASTERS_FOR_GB,
  CREATE_BROADCAST_FOR_GB,
  INT_API_URL,
  GET_ZK_CONFIG_FOR_GB,
  GET_GAMES_FOR_GB,
  GET_ALL_STREAMS_FOR_GB,
  GET_BROADCASTER_STREAMS_FOR_GB,
  GET_GAME_SLATES_FOR_GB,
  UPDATE_GAME_SLATES_FOR_GB,
  START_BROADCAST_GB,
  STOP_BROADCAST_GB,
  CREATE_TOURNAMENT_GB,
  GET_TOURNAMENTS_GB,
  SET_LIVE_BROADCAST,
  GET_BROADCAST_DETAILS_GB,
  GET_SENDBIRD_TOKEN_GB,
  CHECK_BROADCASTER_SLOT_GB,
  GET_TOURNAMENT_VOD_GB,
  HIDE_TOURNAMENT_VOD_GB,
  KILL_BROADCAST_SURFACING_GB,
  UPDATE_BROADCAST_FOR_GB,
  CREATE_BROADCASTERS_FOR_GB
} from '../shared/actionTypes';

export const getZKConfigForGB = () => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-zk-config'
    );
    dispatch(getZKConfigForGBSuccess(result.data.payload));
  };
};

export const getZKConfigForGBSuccess = res => ({
  type: GET_ZK_CONFIG_FOR_GB,
  res
});

export const getBattlesForGB = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-battles',
      { params: data }
    );
    dispatch(getBattlesForGBSuccess(result.data.payload));
  };
};

export const getBattlesForGBSuccess = res => ({
  type: GET_BATTLES_FOR_GB,
  res
});

export const getBroadcasters = () => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-broadcasters'
    );
    dispatch(getBroadcastersSuccess(result.data.payload));
  };
};

export const getBroadcastersSuccess = res => ({
  type: GET_BROADCASTERS_FOR_GB,
  res
});

export const createBroadcast = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/create-broadcast',
      data
    );
    dispatch(createBroadcastSuccess(result.data));
  };
};

export const createBroadcastSuccess = res => ({
  type: CREATE_BROADCAST_FOR_GB,
  res
});

export const updateBroadcast = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/update-broadcast',
      data
    );
    dispatch(updateBroadcastSuccess(result.data));
  };
};

export const updateBroadcastSuccess = res => ({
  type: UPDATE_BROADCAST_FOR_GB,
  res
});

export const getGamesForGB = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-supported-games',
      { params: data }
    );
    dispatch(getGamesForGBSuccess(result.data.payload));
  };
};

export const getGamesForGBSuccess = res => ({
  type: GET_GAMES_FOR_GB,
  res
});

export const getGameSlatesForGB = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-game-slates',
      { params: data }
    );
    dispatch(getGameSlatesForGBSuccess(result.data.payload));
  };
};

export const getGameSlatesForGBSuccess = res => ({
  type: GET_GAME_SLATES_FOR_GB,
  res
});

export const updateGameSlatesForGB = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/update-game-slates',
      data
    );
    dispatch(updateGameSlatesForGBSuccess(result.data.payload));
  };
};

export const updateGameSlatesForGBSuccess = res => ({
  type: UPDATE_GAME_SLATES_FOR_GB,
  res
});

export const getAllStreamsForGB = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/get-all-streams',
      data
    );
    dispatch(getAllStreamsForGBSuccess(result.data.payload));
  };
};

export const getAllStreamsForGBSuccess = res => ({
  type: GET_ALL_STREAMS_FOR_GB,
  res
});

export const getBroadcasterStreamsForGB = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/get-broadcaster-streams',
      data
    );
    dispatch(getBroadcasterStreamsForGBSuccess(result.data.payload));
  };
};

export const getBroadcasterStreamsForGBSuccess = res => ({
  type: GET_BROADCASTER_STREAMS_FOR_GB,
  res
});

export const startBroadcastGB = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/start-broadcast',
      data
    );
    dispatch(startBroadcastGBSuccess(result.data.payload));
  };
};

export const startBroadcastGBSuccess = res => ({
  type: START_BROADCAST_GB,
  res
});

export const stopBroadcastGB = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/stop-broadcast',
      data
    );
    dispatch(stopBroadcastGBSuccess(result.data.payload));
  };
};

export const stopBroadcastGBSuccess = res => ({
  type: STOP_BROADCAST_GB,
  res
});

export const createTournamentGB = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/create-tournament',
      data
    );
    dispatch(createTournamentGBSuccess(result.data));
  };
};

export const createTournamentGBSuccess = res => ({
  type: CREATE_TOURNAMENT_GB,
  res
});

export const getTournamentsGB = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-active-tournaments',
      { params: data }
    );
    dispatch(getTournamentsGBSuccess(result.data.payload));
  };
};

export const getTournamentsGBSuccess = res => ({
  type: GET_TOURNAMENTS_GB,
  res
});

export const getBroadcastDetails = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-broadcast-details',
      { params: data }
    );
    dispatch(getBroadcastDetailsSuccess(result.data.payload));
  };
};

export const getBroadcastDetailsSuccess = res => ({
  type: GET_BROADCAST_DETAILS_GB,
  res
});

export const setLiveBroadcast = res => ({
  type: SET_LIVE_BROADCAST,
  res
});

export const getSendbirdToken = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-sendbird-token',
      { params: data }
    );
    dispatch(getSendbirdTokenSuccess(result.data.payload));
  };
};

export const getSendbirdTokenSuccess = res => ({
  type: GET_SENDBIRD_TOKEN_GB,
  res
});

export const checkBroadcasterSlot = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/check-broadcaster-availibility',
      { params: data }
    );
    dispatch(checkBroadcasterSlotSuccess(result.data.payload));
  };
};

export const checkBroadcasterSlotSuccess = res => ({
  type: CHECK_BROADCASTER_SLOT_GB,
  res
});

export const getTournamentVod = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/get-tournament-vod',
      { params: data }
    );
    dispatch(getTournamentVodSuccess(result.data.payload));
  };
};

export const getTournamentVodSuccess = res => ({
  type: GET_TOURNAMENT_VOD_GB,
  res
});

export const hideTournamentVod = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/hide-tournament-vod',
      data
    );
    dispatch(hideTournamentVodSuccess(result.data.payload));
  };
};

export const hideTournamentVodSuccess = res => ({
  type: HIDE_TOURNAMENT_VOD_GB,
  res
});

export const killBroadcast = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/game-broadcast/kill-broadcast-surfacing',
      { params: data }
    );
    dispatch(killBroadcastSuccess(result.data.payload));
  };
};

export const killBroadcastSuccess = res => ({
  type: KILL_BROADCAST_SURFACING_GB,
  res
});

export const createBroadcasters = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/game-broadcast/create-broadcaster',
      data
    );
    dispatch(createBroadcastersSuccess(result.data.payload));
  };
};

export const createBroadcastersSuccess = res => ({
  type: CREATE_BROADCASTERS_FOR_GB,
  res
});
