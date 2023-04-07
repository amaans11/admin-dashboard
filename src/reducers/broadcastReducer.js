import {
  CREATE_BROADCAST_FOR_GB,
  CREATE_TOURNAMENT_GB,
  GET_ALL_STREAMS_FOR_GB,
  GET_BATTLES_FOR_GB,
  GET_BROADCASTERS_FOR_GB,
  GET_BROADCASTER_STREAMS_FOR_GB,
  GET_GAMES_FOR_GB,
  GET_GAME_SLATES_FOR_GB,
  GET_TOURNAMENTS_GB,
  GET_ZK_CONFIG_FOR_GB,
  START_BROADCAST_GB,
  STOP_BROADCAST_GB,
  UPDATE_GAME_SLATES_FOR_GB,
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

const broadcastReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ZK_CONFIG_FOR_GB:
      return { ...state, getZKConfigForGBResponse: action.res };
    case GET_BATTLES_FOR_GB:
      return { ...state, getBattlesForGBResponse: action.res };
    case GET_BROADCASTERS_FOR_GB:
      return { ...state, getBroadcastersResponse: action.res };
    case CREATE_BROADCAST_FOR_GB:
      return { ...state, createBroadcastResponse: action.res };
    case UPDATE_BROADCAST_FOR_GB:
      return { ...state, updateBroadcastResponse: action.res };
    case GET_GAMES_FOR_GB:
      return { ...state, getGamesForGBResponse: action.res };
    case GET_GAME_SLATES_FOR_GB:
      return { ...state, getGameSlatesForGBResponse: action.res };
    case UPDATE_GAME_SLATES_FOR_GB:
      return { ...state, updateGameSlatesForGBResponse: action.res };
    case GET_ALL_STREAMS_FOR_GB:
      return { ...state, getAllStreamsForGBResponse: action.res };
    case GET_BROADCASTER_STREAMS_FOR_GB:
      return { ...state, getBroadcasterStreamsForGBResponse: action.res };
    case START_BROADCAST_GB:
      return { ...state, startBroadcastGBResponse: action.res };
    case STOP_BROADCAST_GB:
      return { ...state, stopBroadcastGBResponse: action.res };
    case CREATE_TOURNAMENT_GB:
      return { ...state, createTournamentGBResponse: action.res };
    case GET_TOURNAMENTS_GB:
      return { ...state, getTournamentsGBResponse: action.res };
    case SET_LIVE_BROADCAST:
      return { ...state, liveBroadcast: action.res };
    case GET_BROADCAST_DETAILS_GB:
      return { ...state, getBroadcastDetailsResponse: action.res };
    case GET_SENDBIRD_TOKEN_GB:
      return { ...state, getSendbirdTokenResponse: action.res };
    case CHECK_BROADCASTER_SLOT_GB:
      return { ...state, checkBroadcasterSlotResponse: action.res };
    case GET_TOURNAMENT_VOD_GB:
      return { ...state, getTournamentVodResponse: action.res };
    case HIDE_TOURNAMENT_VOD_GB:
      return { ...state, hideTournamentVodResponse: action.res };
    case KILL_BROADCAST_SURFACING_GB:
      return { ...state, killBroadcastResponse: action.res };
    case CREATE_BROADCASTERS_FOR_GB:
      return { ...state, createBroadcasterResponse: action.res };
    default:
      return state;
  }
};

export default broadcastReducer;
