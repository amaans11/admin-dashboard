import * as types from '../shared/actionTypes';

export default function gamesReducer(state = {}, action) {
  switch (action.type) {
    case types.FETCH_GAMES_SUCCESS:
      return { ...state, allGames: action.games ? action.games : [] };
    case types.GET_CONSOLE_CONFIG_SUCCESS:
      return { ...state, consoleConfig: action.res };
    case types.FETCH_GAMES_FAILED:
      return state;
    case types.GET_GAME_ORDER_SUCCESS:
      return { ...state, gameOrder: action.res ? action.res : [] };
    case types.UPDATE_GAME_SUCCESS:
      return { ...state, gameOrder: action.res ? action.res : [] };
    case types.GET_ALL_GAMES_SUCCESS:
      return {
        ...state,
      };
    case types.UPDATE_GAME_DESCRIPTION_SUCCESS:
      return { ...state, updateGameDescriptionResponse: action.res };
    case types.UPDATE_GAME_ICONS_SUCCESS:
      return { ...state, updateGameIconsResponse: action.res };
    case types.UPLOAD_GAME_ASSET_SUCCESS:
      return { ...state, uploadGameAssetResponse: action.res };
    case types.GET_PERCENT_GAME_WISE_CONFIG_SUCCESS:
      return { ...state, getPercentGamewiseConfigResponse: action.res };
    case types.POST_PERCENT_GAME_WISE_CONFIG_SUCCESS:
      return { ...state, postPercentGamewiseConfigResponse: action.res };
    default:
      return state;
  }
}
