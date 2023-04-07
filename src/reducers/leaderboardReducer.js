import * as actionType from '../shared/actionTypes';
import initialState from './initialState';
import moment from 'moment';
export default function leaderboardReducer(
  state = initialState.leaderboard,
  action
) {
  let lb = [];
  switch (action.type) {
    case actionType.GET_LEADERBOARD_HOME_SUCCESS:
      lb = [...state.lb];

      lb[0] = action.res.data ? action.res.data : [];
      lb[0].sort(
        (a, b) =>
          moment(a.tournamentInfo.endTime) - moment(b.tournamentInfo.endTime)
      );
      let gameOrder = action.res.gameOrder.displayOrder;
      return {
        ...state,
        lb: lb,
        gameOrder
      };

    case actionType.GET_LEADERBOARD_BY_GAME_SUCCESS:
      lb = [...state.lb];
      lb[action.gameIndex] = action.res.data;
      lb[action.gameIndex].sort((a, b) => {
        if (
          a.tournamentInfo &&
          a.tournamentInfo.endTime &&
          b.tournamentInfo &&
          b.tournamentInfo.endTime
        )
          return (
            moment(a.tournamentInfo.endTime) - moment(b.tournamentInfo.endTime)
          );
      });
      return {
        ...state,
        lb
      };
    case actionType.GET_LEADEBOARD_BY_ID_SUCCESS:
      return {
        ...state,
        lbById: action.res
      };
    case actionType.GET_USER_GAMEPLAY_SUCCESS:
      // lb = [...state.lb];
      // lb[action.gameIndex] = action.res.data;
      // lb[action.gameIndex].sort(
      //   (a, b) =>
      //     moment(a.tournamentInfo.endTime) - moment(b.tournamentInfo.endTime)
      // );
      return {
        ...state,
        userGamePlay: action.res
      };
    case actionType.BLOCK_USER_SUCCESS:
      // lb = [...state.lb];
      // lb[action.gameIndex] = action.res.data;
      // lb[action.gameIndex].sort(
      //   (a, b) =>
      //     moment(a.tournamentInfo.endTime) - moment(b.tournamentInfo.endTime)
      // );
      return {
        ...state
      };
    case actionType.GET_USER_PROFILE_SUCCESS:
      // lb = [...state.lb];
      // lb[action.gameIndex] = action.res.data;
      // lb[action.gameIndex].sort(
      //   (a, b) =>
      //     moment(a.tournamentInfo.endTime) - moment(b.tournamentInfo.endTime)
      // );
      return {
        ...state,
        userProfile: action.res
      };
    case actionType.GET_CASH_LEADERBOARD_SUCCESS:
      return {
        ...state,
        cashLb: action.res
      };
    case actionType.GET_LOBBY_BY_ID_SUCCESS:
      return {
        ...state,
        lobbyDetails: action.res
      };
    case actionType.GET_LOBBY_LEADERBOARD_SUCCESS:
      return {
        ...state,
        lobbyLeaderBoardDetails: action.res
      };
    case actionType.MARK_TOURNAMENT_SUCCESS:
      return { ...state, markTournamentResponse: action.res };
    case actionType.GET_ALL_FINISHABLE_TOURNAMENT_SUCCESS:
      return { ...state, getAllFinishableTournamentResponse: action.res };
    case actionType.BLOCK_USER_DEVICE_SUCCESS:
      return { ...state, blockUserDeviceResponse: action.res };
    case actionType.KICK_USER_SUCCESS:
      return { ...state, kickUserResponse: action.res };
    case actionType.UNBLOCK_USER_GAME_SUCCESS:
      return { ...state, unblockUserGameResponse: action.res };
    case actionType.UNBLOCK_USER_NEW_SUCCESS:
      return { ...state, unblockUserNewResponse: action.res };
    case actionType.RESTORE_USER_LOBBY_SUCCESS:
      return { ...state, restoreUserLobbyResponse: action.res };
    case actionType.RESTORE_USER_TOURNAMENT_SUCCESS:
      return { ...state, restoreUserTournamentResponse: action.res };
    case actionType.PROCESS_KICK_USER_REQUEST:
      return { ...state, failedRecords: [] };
    case actionType.KICK_USER_FAILED:
      return { ...state, failedRecords: [...state.failedRecords, action.res] };
    case actionType.FINISH_TOURNAMENT_DIRECT:
      return { ...state, finishTournamentDirectResponse: action.res };
    default:
      return state;
  }
}
