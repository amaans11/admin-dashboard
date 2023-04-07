import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function tournamentReducer(
  state = initialState.tournamentConfig,
  action
) {
  switch (action.type) {
    case types.CREATE_TOURNAMENT_SUCCESS:
      return Object.assign({}, state, { addedTournament: true });

    case types.GET_TOURNAMENTS_SUCCESS:
      return Object.assign({}, state, {
        allTournaments: action.val.payload.tournamentConfigList
      });

    case types.GET_TOURNAMENT_CONFIGS_BY_GAME_SUCCESS:
      let configsList = { ...state.configsList };

      return {
        ...state,
        configsList: {
          ...configsList,
          [action.gameId]: action.configs.tournaments
        }
      };

    case types.CLONE_CONFIG:
      return {
        ...state,
        cloneConfig: action.config,

        editType: action.editType
      };

    case types.EDIT_CONFIG_SUCCESS:
      return { ...state };
    // case types.EDIT_CONFIG_SUCCESS:
    //   return { ...state };
    case types.CREATE_TOURNAMENT_CONFIG_SUCCESS:
      localStorage.removeItem('createConfig');

      return {
        ...state,
        cloneConfig: null,
        createTournamentConfigResponse: action.res
      };

    case types.DEACTIVATE_CONFIG_SUCCESS:
      return { ...state };
    case types.ACTIVATE_CONFIG_SUCCESS:
      return { ...state };
    case types.UPDATE_VIDEO_ID_SUCCESS:
      return { ...state };
    case types.GET_FINISHABLE_TOURNAMENT_SUCCESS:
      return { ...state, finishableTournamentsList: action.res.tournaments };

    case types.GET_STYLES_SUCCESS:
      return { ...state, styles: action.res.styles };
    case types.GET_STYLE_IMG_UPLOAD_URL_SUCCESS:
      return { ...state, assetUrl: action.res };
    case types.FINISH_LOBBY_SUCCESS:
      return { ...state, finishLobbyResponse: action.res };
    case types.GET_COMMON_UPLOAD_URL_SUCCESS:
      return { ...state, getCommonUploadUrlResponse: action.res };
    case types.GET_COMMON_UPLOAD_BASE64_URL_SUCCESS:
      return { ...state, getCommonUploadBase64UrlResponse: action.res };
    case types.GET_GAMES_COLLECTIBLES_BY_ID_SUCCESS:
      return { ...state, collectiblesList: action.res };
    default:
      return state;
  }
}
