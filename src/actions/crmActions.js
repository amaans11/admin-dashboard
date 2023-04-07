/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_USER_ID_FROM_REFERENCE_ID_SUCCESS,
  GET_USER_DASHBOARD_BALANCE_SUCCESS,
  GET_USER_ACTIVE_TOURNAMENT_DATA_SUCCESS,
  GET_USER_TOURNAMENT_HISTORY_SUCCESS,
  GET_PLAYER_LOBBY_HISTORY_SUCCESS,
  GET_USER_LEADERBOARD_SUCCESS,
  GET_USER_TRANSACTION_DETAILS_SUCCESS,
  GET_REFERENCE_ID_SUCCESS,
  PROCESS_BULK_TRANSACTION_REFUND_SUCCESS,
  GET_MATCH_DETAILS_SUCCESS,
  GET_CUSTOMER_DETAILS_SUCCESS,
  GET_USER_TEAMS_SUCCESS,
  GET_PLAYER_SCORES_SUCCESS,
  GET_BATTLE_GAME_DATA_SUCCESS,
  GET_CS_KYC_DETAILS_SUCCESS,
  GET_FIRST_RANK_DETAILS_SUCCESS,
  GET_RUMMY_DETAILS_SUCCESS,
  GET_RUMMY_DISCONNECTION_DETAILS_SUCCESS,
  GET_USER_PUBG_DETAILS_SUCCESS,
  PROCESS_RUMMY_REFUND_SUCCESS,
  GET_USER_CREDIBILITY_SUCCESS,
  GET_FRAUD_ACTIVITY_INFO_SUCCESS,
  GET_USER_BLOCKING_INFO_SUCCESS,
  GET_FANTASY_SEARCH_MATCH_ID_SUCCESS,
  GET_SCHEDULED_CALLBACKS_SUCCESS,
  UPDATE_CALLBACK_DETAILS_SUCCESS,
  GET_VIP_AGENT_LIST_SUCCESS,
  GET_USER_BLOCKING_INFO_V2_SUCCESS,
  GET_DISCONNECTION_DATA_SUCCESS,
  FINISH_BATTLE_SUCCESS,
  FINISH_BATTLE_CONFIG_SUCCESS,
  GET_BATTLE_BY_ID_SUCCESS,
  GET_CUMULATIVE_WINNINGS_SUCCESS,
  GET_APP_INFO_SUCCESS,
  GET_FOLLOW_DETAILS_SUCCESS,
  GET_DEVICE_INFO_SUCCESS,
  GET_TOURNAMENT_DETAILS_BY_ID_SUCCESS,
  GET_DISABLED_REFUND_AGENT_LIST,
  GET_DEVICE_ID_BLOCKING_INFO_SUCCESS,
  GET_USER_KO_TOURNAMENT_HISTORY_LIST_SUCCESS,
  GET_USER_KO_TOURNAMENT_ROUND_HISTORY_SUCCESS,
  GET_USER_CPL_HISTORY_SUCCESS,
  GET_USER_CPL_TOURNAMENT_HISTORY_SUCCESS,
  CHECK_USER_PRIME,
  GET_USER_PRIME_SUBSCRIPTION,
  GET_PRIME_GAME_DETAILS,
  GET_PRIME_USER_SAVINGS,
  GET_PRIME_CONTEST_DETAILS,
  GET_USER_INVOICE,
  REFUND_DEPOSIT_MONEY
} from '../shared/actionTypes';

export function getUserIdFromReferenceId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-id-from-reference-id', {
        params: data
      })
      .then(result => {
        dispatch(getUserIdFromReferenceIdSuccess(result.data.payload));
      });
  };
}

export const getUserIdFromReferenceIdSuccess = res => ({
  type: GET_USER_ID_FROM_REFERENCE_ID_SUCCESS,
  res
});

export function getDashboardUserBalance(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/dashboard-user-balance', {
        params: data
      })
      .then(result => {
        dispatch(getDashboardUserBalanceSuccess(result.data.payload));
      });
  };
}

export const getDashboardUserBalanceSuccess = res => ({
  type: GET_USER_DASHBOARD_BALANCE_SUCCESS,
  res
});

export function getUserActiveTournamentData(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-active-tournaments', {
        params: data
      })
      .then(result => {
        dispatch(getUserActiveTournamentDataSuccess(result.data.payload));
      });
  };
}

export const getUserActiveTournamentDataSuccess = res => ({
  type: GET_USER_ACTIVE_TOURNAMENT_DATA_SUCCESS,
  res
});

export function getUserTournamentHistory(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-tournament-history', {
        params: data
      })
      .then(result => {
        dispatch(getUserTournamentHistorySuccess(result.data.payload));
      });
  };
}

export const getUserTournamentHistorySuccess = res => ({
  type: GET_USER_TOURNAMENT_HISTORY_SUCCESS,
  res
});

export function getPlayerLobbyHistory(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-battle-history', {
        params: data
      })
      .then(result => {
        dispatch(getPlayerLobbyHistorySuccess(result.data.payload));
      });
  };
}

export const getPlayerLobbyHistorySuccess = res => ({
  type: GET_PLAYER_LOBBY_HISTORY_SUCCESS,
  res
});

export function getUserLeaderboard(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-tournament-leaderboard', {
        params: data
      })
      .then(result => {
        dispatch(getUserLeaderboardSuccess(result.data.payload));
      });
  };
}

export const getUserLeaderboardSuccess = res => ({
  type: GET_USER_LEADERBOARD_SUCCESS,
  res
});

export function getReferenceId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-reference-id', {
        params: data
      })
      .then(result => {
        dispatch(getReferenceIdSuccess(result.data.payload));
      });
  };
}

export const getReferenceIdSuccess = res => ({
  type: GET_REFERENCE_ID_SUCCESS,
  res
});

export function getUserTransactionDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-transaction-details', {
        params: data
      })
      .then(result => {
        dispatch(getUserTransactionDetailsSuccess(result.data.payload));
      });
  };
}

export const getUserTransactionDetailsSuccess = res => ({
  type: GET_USER_TRANSACTION_DETAILS_SUCCESS,
  res
});

export function processBulkTransactionRefund(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/customer-support/process-bulk-transaction-refunds',
        data
      )
      .then(result => {
        dispatch(processBulkTransactionRefundSuccess(result.data.payload));
      });
  };
}
export const processBulkTransactionRefundSuccess = res => ({
  type: PROCESS_BULK_TRANSACTION_REFUND_SUCCESS,
  res
});

export function getMatchDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-match-details', {
        params: data
      })
      .then(result => {
        dispatch(getMatchDetailsSuccess(result.data.payload));
      });
  };
}

export const getMatchDetailsSuccess = res => ({
  type: GET_MATCH_DETAILS_SUCCESS,
  res
});

export function getCutomerDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-customer-details', {
        params: data
      })
      .then(result => {
        dispatch(getCutomerDetailsSuccess(result.data.payload));
      });
  };
}

export const getCutomerDetailsSuccess = res => ({
  type: GET_CUSTOMER_DETAILS_SUCCESS,
  res
});

export function getUserTeams(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-teams', {
        params: data
      })
      .then(result => {
        dispatch(getUserTeamsSuccess(result.data.payload));
      });
  };
}

export const getUserTeamsSuccess = res => ({
  type: GET_USER_TEAMS_SUCCESS,
  res
});

export function getPlayerScores(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-player-scores', {
        params: data
      })
      .then(result => {
        dispatch(getPlayerScoresSuccess(result.data.payload));
      });
  };
}

export const getPlayerScoresSuccess = res => ({
  type: GET_PLAYER_SCORES_SUCCESS,
  res
});

export function getBattleGameData(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-battle-game-data', {
        params: data
      })
      .then(result => {
        dispatch(getBattleGameDataSuccess(result.data.payload));
      });
  };
}

export const getBattleGameDataSuccess = res => ({
  type: GET_BATTLE_GAME_DATA_SUCCESS,
  res
});

export function getCsKycDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-kyc-details', {
        params: data
      })
      .then(result => {
        dispatch(getCsKycDetailsSuccess(result.data.payload));
      });
  };
}

export const getCsKycDetailsSuccess = res => ({
  type: GET_CS_KYC_DETAILS_SUCCESS,
  res
});

export function getFirstRankDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-first-rank-details', {
        params: data
      })
      .then(result => {
        dispatch(getFirstRankDetailsSuccess(result.data.payload));
      });
  };
}

export const getFirstRankDetailsSuccess = res => ({
  type: GET_FIRST_RANK_DETAILS_SUCCESS,
  res
});

export function getRummyDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-rummy-details', {
        params: data
      })
      .then(result => {
        dispatch(getRummyDetailsSuccess(result.data.payload));
      });
  };
}

export const getRummyDetailsSuccess = res => ({
  type: GET_RUMMY_DETAILS_SUCCESS,
  res
});

export function getRummyDisconnectionDetails(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/customer-support/get-rummy-disconnection-details',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getRummyDisconnectionDetailsSuccess(result.data.payload));
      });
  };
}

export const getRummyDisconnectionDetailsSuccess = res => ({
  type: GET_RUMMY_DISCONNECTION_DETAILS_SUCCESS,
  res
});

export function getUserPubgDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-pubg-details', {
        params: data
      })
      .then(result => {
        dispatch(getUserPubgDetailsSuccess(result.data.payload));
      });
  };
}

export const getUserPubgDetailsSuccess = res => ({
  type: GET_USER_PUBG_DETAILS_SUCCESS,
  res
});

export function processRummyRefund(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/customer-support/process-rummy-refunds', data)
      .then(result => {
        dispatch(processRummyRefundSuccess(result.data.payload));
      });
  };
}
export const processRummyRefundSuccess = res => ({
  type: PROCESS_RUMMY_REFUND_SUCCESS,
  res
});

export function getUserCredibility(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-credibility', {
        params: data
      })
      .then(result => {
        dispatch(getUserCredibilitySuccess(result.data.payload));
      });
  };
}

export const getUserCredibilitySuccess = res => ({
  type: GET_USER_CREDIBILITY_SUCCESS,
  res
});

export function getFraudActivityInfo(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-fraud-activity-info', {
        params: data
      })
      .then(result => {
        dispatch(getFraudActivityInfoSuccess(result.data.payload));
      });
  };
}

export const getFraudActivityInfoSuccess = res => ({
  type: GET_FRAUD_ACTIVITY_INFO_SUCCESS,
  res
});

export function getUserBlockingInfo(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-blocking-info', {
        params: data
      })
      .then(result => {
        dispatch(getUserBlockingInfoSuccess(result.data.payload));
      });
  };
}

export const getUserBlockingInfoSuccess = res => ({
  type: GET_USER_BLOCKING_INFO_SUCCESS,
  res
});

export function getFantasySearchMatchId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/fantasy-search-matchid', {
        params: data
      })
      .then(result => {
        dispatch(getFantasySearchMatchIdSuccess(result.data.payload));
      });
  };
}

export const getFantasySearchMatchIdSuccess = res => ({
  type: GET_FANTASY_SEARCH_MATCH_ID_SUCCESS,
  res
});

export function getScheduledCallbacks(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-scheduled-callback', {
        params: data
      })
      .then(result => {
        dispatch(getScheduledCallbacksSuccess(result.data.payload));
      });
  };
}

export const getScheduledCallbacksSuccess = res => ({
  type: GET_SCHEDULED_CALLBACKS_SUCCESS,
  res
});

export function updateCallbackDetails(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/customer-support/update-callback-details', data)
      .then(result => {
        dispatch(updateCallbackDetailsSuccess(result.data.payload));
      });
  };
}

export const updateCallbackDetailsSuccess = res => ({
  type: UPDATE_CALLBACK_DETAILS_SUCCESS,
  res
});

export function getVipAgentList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-agent-list')
      .then(result => {
        const agentList = JSON.parse(result.data.payload).agentList;
        dispatch(getVipAgentListSuccess(agentList));
      });
  };
}

export const getVipAgentListSuccess = res => ({
  type: GET_VIP_AGENT_LIST_SUCCESS,
  res
});

export function getUserBlockingInfoV2(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-blocking-info-v2', {
        params: data
      })
      .then(result => {
        dispatch(getUserBlockingInfoV2Success(result.data.payload));
      });
  };
}

export const getUserBlockingInfoV2Success = res => ({
  type: GET_USER_BLOCKING_INFO_V2_SUCCESS,
  res
});

export function getDisconnectionData(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-disconnection-data', {
        params: data
      })
      .then(result => {
        dispatch(getDisconnectionDataSuccess(result.data.payload));
      });
  };
}

export const getDisconnectionDataSuccess = res => ({
  type: GET_DISCONNECTION_DATA_SUCCESS,
  res
});

export function finishBattle(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/customer-support/finish-battle', data)
      .then(result => {
        dispatch(finishBattleSuccess(result.data.payload));
      });
  };
}

export const finishBattleSuccess = res => ({
  type: FINISH_BATTLE_SUCCESS,
  res
});

export function finishBattleConfig() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-finish-battle-config')
      .then(result => {
        const config = JSON.parse(result.data.payload).config;
        dispatch(finishBattleConfigSuccess(config));
      });
  };
}

export const finishBattleConfigSuccess = res => ({
  type: FINISH_BATTLE_CONFIG_SUCCESS,
  res
});
export function getBattleByBattleId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-battle-by-battle-id', {
        params: data
      })
      .then(result => {
        dispatch(getBattleByBattleIdSuccess(result.data.payload));
      });
  };
}

export const getBattleByBattleIdSuccess = res => ({
  type: GET_BATTLE_BY_ID_SUCCESS,
  res
});
export function getCumulativeWinnings(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/customer-support/get-cumulative-winnings', data)
      .then(result => {
        dispatch(getCumulativeWinningsSuccess(result.data.payload));
      });
  };
}

export const getCumulativeWinningsSuccess = res => ({
  type: GET_CUMULATIVE_WINNINGS_SUCCESS,
  res
});

export function getAppInfo(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-app-info', {
        params: data
      })
      .then(result => {
        dispatch(getAppInfoSuccess(result.data.payload));
      });
  };
}

export const getAppInfoSuccess = res => ({
  type: GET_APP_INFO_SUCCESS,
  res
});

export function getFollowDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-follow-details', {
        params: data
      })
      .then(result => {
        dispatch(getFollowDetailsSuccess(result.data.payload));
      });
  };
}

export const getFollowDetailsSuccess = res => ({
  type: GET_FOLLOW_DETAILS_SUCCESS,
  res
});

export function getDeviceInfo(request) {
  let data = {
    searchCriteria: 'USER_ID',
    searchFor: request.userId
  };
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-profile/get-device-info', {
        params: data
      })
      .then(result => {
        dispatch(getDeviceInfoSuccess(result.data.payload));
      });
  };
}

export const getDeviceInfoSuccess = res => ({
  type: GET_DEVICE_INFO_SUCCESS,
  res
});

export function getDisabledRefundAgentList() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-disabled-refund-agent')
      .then(result => {
        const agentList = JSON.parse(result.data.payload).agentList;
        dispatch(getDisabledRefundAgentListSuccess(agentList));
      });
  };
}

export const getDisabledRefundAgentListSuccess = res => ({
  type: GET_DISABLED_REFUND_AGENT_LIST,
  res
});

export function sendRefundFlockAlerts(data) {
  console.log(data);
  return dispatch => {
    return axios.post(
      INT_API_URL + 'api/customer-support/send-flock-alerts',
      data
    );
  };
}

export function getTournamentDetailsById(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-tournament-details-by-id', {
        params: data
      })
      .then(result => {
        dispatch(getTournamentDetailsByIdSuccess(result.data.payload));
      });
  };
}

export const getTournamentDetailsByIdSuccess = res => ({
  type: GET_TOURNAMENT_DETAILS_BY_ID_SUCCESS,
  res
});

export function getDeviceBlockingInfo(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/device-id-blocking-info', {
        params: data
      })
      .then(result => {
        dispatch(getDeviceBlockingInfoSuccess(result.data.payload));
      });
  };
}

export const getDeviceBlockingInfoSuccess = res => ({
  type: GET_DEVICE_ID_BLOCKING_INFO_SUCCESS,
  res
});

export function getUserKoTournamentHistoryList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-ko-tournament-history', {
        params: data
      })
      .then(result => {
        dispatch(getUserKoTournamentHistoryListSuccess(result.data.payload));
      });
  };
}

export const getUserKoTournamentHistoryListSuccess = res => ({
  type: GET_USER_KO_TOURNAMENT_HISTORY_LIST_SUCCESS,
  res
});

export function getUserKoTournamentRoundHistory(data) {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + 'api/customer-support/user-ko-tournament-round-history',
        {
          params: data
        }
      )
      .then(result => {
        dispatch(getUserKoTournamentRoundHistorySuccess(result.data.payload));
      });
  };
}

export const getUserKoTournamentRoundHistorySuccess = res => ({
  type: GET_USER_KO_TOURNAMENT_ROUND_HISTORY_SUCCESS,
  res
});

export function getUserCplHistory(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-cpl-history', {
        params: data
      })
      .then(result => {
        dispatch(getUserCplHistorySuccess(result.data.payload));
      });
  };
}

export const getUserCplHistorySuccess = res => ({
  type: GET_USER_CPL_HISTORY_SUCCESS,
  res
});

export function getUserCplTournamentHistory(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/user-cpl-tournament-history', {
        params: data
      })
      .then(result => {
        dispatch(getUserCplTournamentHistorySuccess(result.data.payload));
      });
  };
}

export const getUserCplTournamentHistorySuccess = res => ({
  type: GET_USER_CPL_TOURNAMENT_HISTORY_SUCCESS,
  res
});
export function checkUserPrimeStatus(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/check-user-prime-status', {
        params: data
      })
      .then(result => {
        dispatch(checkUserPrimeStatusSuccess(result.data.payload));
      });
  };
}

export const checkUserPrimeStatusSuccess = res => ({
  type: CHECK_USER_PRIME,
  res
});
export function getUserPrimeSubscription(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-prime-subscription', {
        params: data
      })
      .then(result => {
        dispatch(getUserPrimeSubscriptionSuccess(result.data.payload));
      });
  };
}

export const getUserPrimeSubscriptionSuccess = res => ({
  type: GET_USER_PRIME_SUBSCRIPTION,
  res
});
export function getPrimeGameDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-game-info', {
        params: data
      })
      .then(result => {
        dispatch(getPrimeGameDetailsSuccess(result.data.payload));
      });
  };
}

export const getPrimeGameDetailsSuccess = res => ({
  type: GET_PRIME_GAME_DETAILS,
  res
});
export function getPrimeUserSavings(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/check-user-prime-savings', {
        params: data
      })
      .then(result => {
        dispatch(getPrimeUserSavingsSuccess(result.data.payload));
      });
  };
}

export const getPrimeUserSavingsSuccess = res => ({
  type: GET_PRIME_USER_SAVINGS,
  res
});
export function getPrimeContestDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-prime-contest-details', {
        params: data
      })
      .then(result => {
        dispatch(getPrimeContestDetailsSuccess(result.data.payload));
      });
  };
}

export const getPrimeContestDetailsSuccess = res => ({
  type: GET_PRIME_CONTEST_DETAILS,
  res
});

export function getUserInvoice(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/customer-support/get-user-invoice', {
        params: data
      })
      .then(result => {
        dispatch(getUserInvoiceSuccess(result.data.payload));
      });
  };
}

export const getUserInvoiceSuccess = res => ({
  type: GET_USER_INVOICE,
  res
});

export function refundDepositMoney(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/customer-support/refund-deposit-money', data)
      .then(result => {
        dispatch(refundDepositMoneySuccess(result.data.payload));
      });
  };
}

export const refundDepositMoneySuccess = res => ({
  type: REFUND_DEPOSIT_MONEY,
  res
});
