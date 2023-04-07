import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function GameStreakReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_UPDATE_STREAK_CHALLENGE:
      return { ...state, createUpdateStreakChallengeResponse: action.res };
    case actionTypes.CLEAR_STREAK_CHALLENGE_FORM:
      return { ...state, streakChallengeDetails: null };
    case actionTypes.EDIT_STREAK_CHALLENGE:
      return {
        ...state,
        streakChallengeDetails: action.data.streakChallengeDetails,
        editType: action.data.editType
      };
    case actionTypes.GET_ALL_STREAK_CHALLENGES:
      return { ...state, getAllStreakChallengesResponse: action.res };
    case actionTypes.GET_STREAK_SEGMENTS:
      return { ...state, getStreakSegmentsResponse: action.res };
    case actionTypes.GET_STREAK_SUPPORTED_COUNTRIES:
      return { ...state, getStreakSupportedCountriesResponse: action.res };
    default:
      return state;
  }
}
