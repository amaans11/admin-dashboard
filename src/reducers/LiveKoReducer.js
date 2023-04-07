import * as types from '../shared/actionTypes';

export default function liveKoReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_KO_PLAYER_LIST_BY_TOURNAMENT:
      return { ...state, getKoPlayerListByTournamentResponse: action.res };
    case types.SEND_KO_USER_NOTIFICATION:
      return { ...state, sendKoUserNotificationResponse: action.res };
    case types.REMOVE_KO_USER_FROM_TOURNAMENT:
      return { ...state, removeKoUserFromTournamentResponse: action.res };
    case types.PAUSE_KO_TOURNAMENT:
      return { ...state, pauseKoTournamentResponse: action.res };
    case types.GET_KO_BATTLE_DETAILS:
      return { ...state, getKoBattleDetailsResponse: action.res };
    case types.CHANGE_KO_MATCH_WINNER:
      return { ...state, changeKoMatchWinnerResponse: action.res };
    case types.DECLARE_LIVE_BATTLE_WINNER:
      return { ...state, declareLiveBattleWinnerResponse: action.res };
    case types.RELEASE_WINNING_FOR_KO_TOURNAMENT:
      return { ...state, releaseWinningForKoTournamentResponse: action.res };
    case types.REPLACE_USERS_IN_KO_ROUND:
      return { ...state, replaceUsersinKoRoundResponse: action.res };
    default:
      return state;
  }
}
