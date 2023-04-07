import * as types from '../shared/actionTypes';

export default function crmReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_USER_ID_FROM_REFERENCE_ID_SUCCESS:
      return { ...state, getUserIdFromReferenceIdResponse: action.res };
    case types.GET_USER_DASHBOARD_BALANCE_SUCCESS:
      return { ...state, getUserDashboardBalanceResponse: action.res };
    case types.GET_USER_ACTIVE_TOURNAMENT_DATA_SUCCESS:
      return { ...state, getUserActiveTournamentDataResponse: action.res };
    case types.GET_USER_TOURNAMENT_HISTORY_SUCCESS:
      return { ...state, getUserTournamentHistoryResponse: action.res };
    case types.GET_PLAYER_LOBBY_HISTORY_SUCCESS:
      return { ...state, getPlayerLobbyHistoryResponse: action.res };
    case types.GET_USER_LEADERBOARD_SUCCESS:
      return { ...state, getUserLeaderboardResponse: action.res };
    case types.GET_USER_TRANSACTION_DETAILS_SUCCESS:
      return { ...state, getUserTransactionDetailsResponse: action.res };
    case types.GET_REFERENCE_ID_SUCCESS:
      return { ...state, getReferenceIdResponse: action.res };
    case types.PROCESS_BULK_TRANSACTION_REFUND_SUCCESS:
      return { ...state, processBulkTransactionRefundResponse: action.res };
    case types.GET_MATCH_DETAILS_SUCCESS:
      return { ...state, getMatchDetailsResponse: action.res };
    case types.GET_CUSTOMER_DETAILS_SUCCESS:
      return { ...state, getCustomerDetailsResponse: action.res };
    case types.GET_USER_TEAMS_SUCCESS:
      return { ...state, getUserTeamsResponse: action.res };
    case types.GET_PLAYER_SCORES_SUCCESS:
      return { ...state, getPlayerScoreResponse: action.res };
    case types.GET_BATTLE_GAME_DATA_SUCCESS:
      return { ...state, getBattleGameDataResponse: action.res };
    case types.GET_CS_KYC_DETAILS_SUCCESS:
      return { ...state, getCsKycDetailsResponse: action.res };
    case types.GET_FIRST_RANK_DETAILS_SUCCESS:
      return { ...state, getFirstRankDetailsResponse: action.res };
    case types.GET_RUMMY_DETAILS_SUCCESS:
      return { ...state, getRummyDetailsResponse: action.res };
    case types.GET_RUMMY_DISCONNECTION_DETAILS_SUCCESS:
      return { ...state, getRummyDisconnectionDetailsResponse: action.res };
    case types.PROCESS_RUMMY_REFUND_SUCCESS:
      return { ...state, processRummyRefundResponse: action.res };
    case types.GET_USER_CREDIBILITY_SUCCESS:
      return { ...state, getUserCredibilityResponse: action.res };
    case types.GET_USER_PUBG_DETAILS_SUCCESS:
      return { ...state, getUserPubgDetailsResponse: action.res };
    case types.GET_FRAUD_ACTIVITY_INFO_SUCCESS:
      return { ...state, getFraudActivityInfoResponse: action.res };
    case types.GET_USER_BLOCKING_INFO_SUCCESS:
      return { ...state, getUserBlockingInfoResponse: action.res };
    case types.GET_FANTASY_SEARCH_MATCH_ID_SUCCESS:
      return { ...state, getFantasySearchMatchIdResponse: action.res };
    case types.GET_SCHEDULED_CALLBACKS_SUCCESS:
      return { ...state, scheduledCallbacks: action.res };
    case types.UPDATE_CALLBACK_DETAILS_SUCCESS:
      return { ...state, updateCallback: action.res };
    case types.GET_VIP_AGENT_LIST_SUCCESS:
      return { ...state, agentList: action.res };
    case types.GET_USER_BLOCKING_INFO_V2_SUCCESS:
      return { ...state, getUserBlockingInfoV2Response: action.res };
    case types.GET_DISCONNECTION_DATA_SUCCESS:
      return { ...state, getDisconnectionDataResponse: action.res };
    case types.FINISH_BATTLE_SUCCESS:
      return { ...state, finishBattleResponse: action.res };
    case types.FINISH_BATTLE_CONFIG_SUCCESS:
      return { ...state, finishBattleConfigResponse: action.res };
    case types.GET_BATTLE_BY_ID_SUCCESS:
      return { ...state, getBattleByIdResponse: action.res };
    case types.GET_APP_INFO_SUCCESS:
      return { ...state, appInfo: action.res };
    case types.GET_FOLLOW_DETAILS_SUCCESS:
      return { ...state, followDetails: action.res };
    case types.GET_DEVICE_INFO_SUCCESS:
      return { ...state, deviceInfo: action.res };
    case types.GET_CUMULATIVE_WINNINGS_SUCCESS:
      return { ...state, cumulativeWinnings: action.res };
    case types.GET_TOURNAMENT_DETAILS_BY_ID_SUCCESS:
      return { ...state, getTournamentDetailsByIdResponse: action.res };
    case types.GET_DISABLED_REFUND_AGENT_LIST:
      return { ...state, disabledRefundAgents: action.res };
    case types.GET_DEVICE_ID_BLOCKING_INFO_SUCCESS:
      return { ...state, getDeviceBlockingInfoResponse: action.res };
    case types.GET_USER_KO_TOURNAMENT_HISTORY_LIST_SUCCESS:
      return { ...state, getUserKoTournamentHistoryListResponse: action.res };
    case types.GET_USER_KO_TOURNAMENT_ROUND_HISTORY_SUCCESS:
      return { ...state, getUserKoTournamentRoundHistoryResponse: action.res };
    case types.GET_USER_CPL_HISTORY_SUCCESS:
      return { ...state, getUserCplHistoryResponse: action.res };
    case types.GET_USER_CPL_TOURNAMENT_HISTORY_SUCCESS:
      return { ...state, getUserCplTournamentHistoryResponse: action.res };
    case types.CHECK_USER_PRIME:
      return { ...state, userPrimeRes: action.res };
    case types.GET_USER_PRIME_SUBSCRIPTION:
      return { ...state, userPrimeSubscriptionRes: action.res };
    case types.GET_PRIME_GAME_DETAILS:
      return { ...state, primeGameDetails: action.res };
    case types.GET_PRIME_USER_SAVINGS:
      return { ...state, primeUserSavings: action.res };
    case types.GET_PRIME_CONTEST_DETAILS:
      return { ...state, primeContest: action.res };
    case types.GET_USER_INVOICE:
      return { ...state, userInvoice: action.res };
    case types.REFUND_DEPOSIT_MONEY:
      return { ...state, refundMoneyRes: action.res };
    default:
      return state;
  }
}
