import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function EsportsLeagueReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_UPDATE_ESPORTS_LEAGUE_SUCCESS:
      return { ...state, createUpdateEsportsLeagueResponse: action.res };
    case actionTypes.EDIT_ESPORTS_LEAGUE:
      return {
        ...state,
        esportsLeagueDetails: action.data.esportsLeagueDetails,
        editType: 'EDIT'
      };
    case actionTypes.GET_ALL_ESPORTS_LEAGUE_SUCCESS:
      return { ...state, getAllEsportsLeagueResponse: action.res };
    case actionTypes.CLEAR_ESPORTS_FORM:
      return { ...state, esportsLeagueDetails: null };
    case actionTypes.CREATE_UPDATE_LEAGUE_STAGE_SUCCESS:
      return { ...state, createUpdateLeagueStageResponse: action.res };
    case actionTypes.GET_ESPORTS_STAGES_BY_LEAGUE_SUCCESS:
      return { ...state, getEsportsStagesByLeagueResponse: action.res };
    case actionTypes.CLEAR_LEAGUE_STAGE_FORM:
      return { ...state, esportsLeagueStageDetails: null, editStageType: null };
    case actionTypes.GET_ALL_ESPORTS_LEAGUE_STAGES_SUCCESS:
      return { ...state, getAllEsportsLeagueStagesResponse: action.res };
    case actionTypes.EDIT_ESPORTS_LEAGUE_STAGE:
      return {
        ...state,
        esportsLeagueStageDetails: action.data.esportsLeagueStageDetails,
        editStageType: 'EDIT'
      };
    default:
      return state;
  }
}
