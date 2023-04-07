/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_MATCHES_SUCCESS,
  GET_MATCH_CONFIG_SUCCESS,
  GET_ALL_LINE_FORMAT_SUCCESS,
  GET_MATCH_CONTESTS_SUCCESS,
  CREATE_MATCH_CONTEST_SUCCESS,
  GET_MATCH_TIER_LIST_SUCCESS,
  CLONE_EDIT_CONTEST,
  EDIT_MATCH_CONTEST_SUCCESS,
  DELETE_MATCH_CONTEST_SUCCESS,
  ACTIVATE_MATCH_CONTEST_SUCCESS,
  UPDATE_CONTEST_ORDER_SUCCESS,
  EDIT_MATCH_CONFIG,
  EDIT_MATCH_CONFIG_SUCCESS,
  ACTIVATE_MATCH_CONFIG,
  GET_MATCH_ROSTER_SUCCESS,
  VERIFY_MATCH_ROSTER_SUCCESS,
  UPDATE_MATCH_ROSTER_SUCCESS,
  CLEAR_CONTEST_FORM,
  CLEAR_MATCH_CONFIG_FORM,
  DEACTIVATE_MATCH_CONFIG,
  ADD_MATCH_DETAILS,
  EDIT_MATCH_DETAILS,
  EDIT_MATCH_DETAILS_SUCCESS,
  GET_MATCHES_ORDERING_SUCCESS,
  GET_REGISTERED_COUNT_SUCCESS,
  UPDATE_MATCH_DETAILS_SUCCESS,
  GET_PLAYER_STATS_SUCCESS,
  UPDATE_PLAYING_STATUS_SUCCESS,
  CANCEL_CONTEST_SUCCESS,
  UPDATE_PLAYER_PROFILE_SUCCESS,
  CREATE_MULTIPLE_MATCH_CONTEST_SUCCESS,
  GET_CONTEST_COUNT_SUCCESS,
  CANCEL_MATCH_SUCCESS,
  EXTEND_MATCH_SUCCESS,
  SEARCH_CONTEST_SUCCESS,
  GET_LEADERBOARD_SUCCESS,
  GET_MATCH_PLAYER_SCORE_SUCCESS,
  INITIATE_PRIZE_DISTRIBUTION_SUCCESS,
  UPDATE_MATCH_PLAYING_SCORE_SUCCESS,
  CREATE_MATCH_MASTER_CONTEST_SUCCESS,
  EDIT_MATCH_MASTER_CONTEST_SUCCESS,
  GET_MASTER_CONTESTS_DETAILS_SUCCESS,
  CLONE_EDIT_MASTER_CONTEST,
  CLEAR_MASTER_CONTEST_FORM,
  RUN_ROSTER_SCHEDULER_SUCCESS,
  GET_NEW_LEAGUE_SUCCESS,
  GET_ALL_MASTER_CONTEST_TYPE_SUCCESS,
  CREATE_DEFAULT_CONTEST_SUCCESS,
  UPDATE_MASTER_CONTEST_ORDER_SUCCESS,
  GET_PLAYER_SCORE_DETAIL_SUCCESS,
  UPDATE_MULTI_CONTEST_DETAIL_SUCCESS,
  UPDATE_PLAYER_SCORE_DETAIL_SUCCESS,
  REFUND_MATCH_SUCCESS,
  GET_ALL_SEGMENT_TYPE_SUCCESS,
  GET_MATCH_NOTIFICATION_DETAIL_SUCCESS,
  EDIT_MATCH_NOTIFICATION_SUCCESS,
  SEND_MATCH_NOTIFICATION_MANUALLY_SUCCESS,
  GET_MATCH_DETAIL_BY_ID_SUCCESS,
  CREATE_MASTER_CONTEST_FROM_MATCH_CONTEST_SUCCESS,
  CREATE_MULTIPLE_MATCH_MULTIPLE_MASTER_CONTEST_SUCCESS,
  CREATE_MASTER_CONTEST_FROM_SPORT_TO_SPORT_SUCCESS,
  DELETE_MASTER_CONTEST_BY_MASTER_TYPE_SUCCESS,
  UPDATE_ALL_CONTESTS_FOR_MATCH_SUCCESS,
  GET_CONTEST_DETAIL_BY_ID_SUCCESS,
  UPDATE_LATEST_SCORE_FROM_FEED_SUCCESS,
  CREDIT_CONTEST_WINNINGS_SUCCESS,
  REFUND_CONTEST_SUCCESS,
  GET_ALL_CONTEST_CATEGORY_SUCCESS,
  GET_ALL_COUNTRY_CODE_SUCCESS,
  GET_MATCH_COUNT_COUNTRY_WISE_SUCCESS,
  GET_CONTEST_ML_PRICE_SUCCESS,
  SET_CONTEST_ML_PRICE_SUCCESS,
  GET_ML_MODEL_LIST_SUCCESS,
  MOVE_MATCH_FROM_LIVE_TO_UPCOMING,
  GET_ALL_SEASON_PASS_SUCCESS,
  ATTACH_FANTASY_ASSISTANT_SUCCESS
} from '../shared/actionTypes';

export function getAllMatches(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-matches', { params: data })
      .then(result => {
        dispatch(getAllMatchesSuccess(result.data.payload));
      });
  };
}
export const getAllMatchesSuccess = res => ({
  type: GET_MATCHES_SUCCESS,
  res
});

export function createMatchConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/create-match-config', data)
      .then(result => {
        dispatch(createMatchConfigSuccess(result.data.payload));
      });
  };
}
export const createMatchConfigSuccess = res => ({
  type: GET_MATCH_CONFIG_SUCCESS,
  res
});

export function editMatchConfigDetails(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/edit-match-config', data)
      .then(result => {
        dispatch(editMatchConfigSuccess(result.data.payload));
      });
  };
}
export const editMatchConfigSuccess = res => ({
  type: EDIT_MATCH_CONFIG_SUCCESS,
  res
});

export function getAllLineFormats() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-all-line-formats')
      .then(result => {
        dispatch(getAllLineFormatsSuccess(result.data.payload));
      });
  };
}
export const getAllLineFormatsSuccess = res => ({
  type: GET_ALL_LINE_FORMAT_SUCCESS,
  res
});

export function getMatchContests(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-contests', { params: data })
      .then(result => {
        dispatch(getMatchContestsSuccess(result.data.payload));
      });
  };
}
export const getMatchContestsSuccess = res => ({
  type: GET_MATCH_CONTESTS_SUCCESS,
  res
});

export function createMatchContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/create-match-contest', data)
      .then(result => {
        dispatch(createMatchContestSuccess(result.data.payload));
      });
  };
}
export const createMatchContestSuccess = res => ({
  type: CREATE_MATCH_CONTEST_SUCCESS,
  res
});

export function getTierList() {
  return dispatch => {
    return axios.get(INT_API_URL + 'api/fantasy/get-tiers').then(result => {
      dispatch(getTierListSuccess(result.data.payload));
    });
  };
}
export const getTierListSuccess = res => ({
  type: GET_MATCH_TIER_LIST_SUCCESS,
  res
});

export const cloneEditContest = (record, actionType) => ({
  type: CLONE_EDIT_CONTEST,
  record,
  actionType
});

export function editMatchContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/edit-match-contest', data)
      .then(result => {
        dispatch(editMatchContestSuccess(result.data.payload));
      });
  };
}
export const editMatchContestSuccess = res => ({
  type: EDIT_MATCH_CONTEST_SUCCESS,
  res
});

export function deleteMatchContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/delete-match-contest', data)
      .then(result => {
        dispatch(deleteMatchContestSuccess(result.data.payload));
      });
  };
}
export const deleteMatchContestSuccess = res => ({
  type: DELETE_MATCH_CONTEST_SUCCESS,
  res
});

export function activateMatchContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/activate-match-contest', data)
      .then(result => {
        dispatch(activateMatchContestSuccess(result.data.payload));
      });
  };
}
export const activateMatchContestSuccess = res => ({
  type: ACTIVATE_MATCH_CONTEST_SUCCESS,
  res
});

export function updateContestOrder(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-contest-order', data)
      .then(result => {
        dispatch(updateContestOrderSuccess(result.data.payload));
      });
  };
}
export const updateContestOrderSuccess = res => ({
  type: UPDATE_CONTEST_ORDER_SUCCESS,
  res
});

export const editMatchConfig = (record, matchStatus) => ({
  type: EDIT_MATCH_CONFIG,
  record,
  matchStatus
});

export function activateMatchConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/activate-match-config', data)
      .then(result => {
        dispatch(activateMatchConfigSuccess(result.data.payload));
      });
  };
}
export const activateMatchConfigSuccess = res => ({
  type: ACTIVATE_MATCH_CONFIG,
  res
});

export function deActivateMatchConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/deactivate-match-config', data)
      .then(result => {
        dispatch(deActivateMatchConfigSuccess(result.data.payload));
      });
  };
}
export const deActivateMatchConfigSuccess = res => ({
  type: DEACTIVATE_MATCH_CONFIG,
  res
});

export function getMatchRoster(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-match-roster', { params: data })
      .then(result => {
        dispatch(getMatchRosterSuccess(result.data.payload));
      });
  };
}
export const getMatchRosterSuccess = res => ({
  type: GET_MATCH_ROSTER_SUCCESS,
  res
});

export function verifyMatchRoster(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/verify-roster', data)
      .then(result => {
        dispatch(verifyMatchRosterSuccess(result.data.payload));
      });
  };
}
export const verifyMatchRosterSuccess = res => ({
  type: VERIFY_MATCH_ROSTER_SUCCESS,
  res
});

export function updateMatchRoster(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-roster', data)
      .then(result => {
        dispatch(updateMatchRosterSuccess(result.data.payload));
      });
  };
}
export const updateMatchRosterSuccess = res => ({
  type: UPDATE_MATCH_ROSTER_SUCCESS,
  res
});

export const clearContestForm = () => ({
  type: CLEAR_CONTEST_FORM
});

export const clearMatchConfigForm = () => ({
  type: CLEAR_MATCH_CONFIG_FORM
});

export function addMatchDetails(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/add-match-details', data)
      .then(result => {
        dispatch(addMatchDetailsSuccess(result.data.payload));
      });
  };
}
export const addMatchDetailsSuccess = res => ({
  type: ADD_MATCH_DETAILS,
  res
});

export const editMatchDetails = record => ({
  type: EDIT_MATCH_DETAILS,
  record
});

export function editMatchDetailsCall(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/edit-match-details', data)
      .then(result => {
        dispatch(editMatchDetailsCallSuccess(result.data.payload));
      });
  };
}
export const editMatchDetailsCallSuccess = res => ({
  type: EDIT_MATCH_DETAILS_SUCCESS,
  res
});

export function getMatchesOrdering(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-matches-ordering', { params: data })
      .then(result => {
        dispatch(getMatchesOrderingSuccess(result.data.payload));
      });
  };
}
export const getMatchesOrderingSuccess = res => ({
  type: GET_MATCHES_ORDERING_SUCCESS,
  res
});

export function getRegisteredCount(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-registered-count', { params: data })
      .then(result => {
        dispatch(getRegisteredCountSuccess(result.data.payload));
      });
  };
}
export const getRegisteredCountSuccess = res => ({
  type: GET_REGISTERED_COUNT_SUCCESS,
  res
});

export function updateMatchDetails(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-match-details', data)
      .then(result => {
        dispatch(updateMatchDetailsSuccess(result.data.payload));
      });
  };
}
export const updateMatchDetailsSuccess = res => ({
  type: UPDATE_MATCH_DETAILS_SUCCESS,
  res
});

export function getPlayerStats(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-player-stats', { params: data })
      .then(result => {
        dispatch(getPlayerStatsSuccess(result.data.payload));
      });
  };
}
export const getPlayerStatsSuccess = res => ({
  type: GET_PLAYER_STATS_SUCCESS,
  res
});

export function updatePlayingStatus(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-playing-status', data)
      .then(result => {
        dispatch(updatePlayingStatusSuccess(result.data.payload));
      });
  };
}
export const updatePlayingStatusSuccess = res => ({
  type: UPDATE_PLAYING_STATUS_SUCCESS,
  res
});

export function cancelContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/cancel-contest', data)
      .then(result => {
        dispatch(cancelContestSuccess(result.data.payload));
      });
  };
}
export const cancelContestSuccess = res => ({
  type: CANCEL_CONTEST_SUCCESS,
  res
});

export function updatePlayerProfile(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-player-profile', data)
      .then(result => {
        dispatch(updatePlayerProfileSuccess(result.data.payload));
      });
  };
}
export const updatePlayerProfileSuccess = res => ({
  type: UPDATE_PLAYER_PROFILE_SUCCESS,
  res
});

export function createMultipleMatchContests(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/multiple-match-contests', data)
      .then(result => {
        dispatch(createMultipleMatchContestsSuccess(result.data.payload));
      });
  };
}
export const createMultipleMatchContestsSuccess = res => ({
  type: CREATE_MULTIPLE_MATCH_CONTEST_SUCCESS,
  res
});

// export function getContestCount(data) {
//   return dispatch => {
//     return axios
//       .get(INT_API_URL + 'api/fantasy/contest-count', { params: data })
//       .then(result => {
//         dispatch(getContestCountSuccess(result.data.payload));
//       });
//   };
// }
// export const getContestCountSuccess = res => ({
//   type: GET_CONTEST_COUNT_SUCCESS,
//   res
// });

export function getContestCount(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/contest-count-dashboard-new', {
        params: data
      })
      .then(result => {
        dispatch(getContestCountSuccess(result.data.payload));
      });
  };
}
export const getContestCountSuccess = res => ({
  type: GET_CONTEST_COUNT_SUCCESS,
  res
});

export function cancelMatch(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/cancel-match', data)
      .then(result => {
        dispatch(cancelMatchSuccess(result.data.payload));
      });
  };
}
export const cancelMatchSuccess = res => ({
  type: CANCEL_MATCH_SUCCESS,
  res
});

export function extendMatch(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/extend-match', data)
      .then(result => {
        dispatch(extendMatchSuccess(result.data.payload));
      });
  };
}
export const extendMatchSuccess = res => ({
  type: EXTEND_MATCH_SUCCESS,
  res
});

export function searchContest(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/search-contest', { params: data })
      .then(result => {
        dispatch(searchContestSuccess(result.data.payload));
      });
  };
}
export const searchContestSuccess = res => ({
  type: SEARCH_CONTEST_SUCCESS,
  res
});

export function getLeaderboard(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-full-leaderboard', { params: data })
      .then(result => {
        dispatch(getLeaderboardSuccess(result.data.payload));
      });
  };
}
export const getLeaderboardSuccess = res => ({
  type: GET_LEADERBOARD_SUCCESS,
  res
});

export function getMatchPlayerScore(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-match-player-score', { params: data })
      .then(result => {
        dispatch(getMatchPlayerScoreSuccess(result.data.payload));
      });
  };
}
export const getMatchPlayerScoreSuccess = res => ({
  type: GET_MATCH_PLAYER_SCORE_SUCCESS,
  res
});

export function initiatePrizeDistribution(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/initiate-prize-distribution', data)
      .then(result => {
        dispatch(initiatePrizeDistributionSuccess(result.data.payload));
      });
  };
}
export const initiatePrizeDistributionSuccess = res => ({
  type: INITIATE_PRIZE_DISTRIBUTION_SUCCESS,
  res
});

export function updateMatchPlayerScore(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-match-player-score', data)
      .then(result => {
        dispatch(updateMatchPlayerScoreSuccess(result.data.payload));
      });
  };
}
export const updateMatchPlayerScoreSuccess = res => ({
  type: UPDATE_MATCH_PLAYING_SCORE_SUCCESS,
  res
});

export function createMasterMatchContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/create-match-master-contest', data)
      .then(result => {
        dispatch(createMasterMatchContestSuccess(result.data.payload));
      });
  };
}
export const createMasterMatchContestSuccess = res => ({
  type: CREATE_MATCH_MASTER_CONTEST_SUCCESS,
  res
});

export function editMasterMatchContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/edit-match-master-contest', data)
      .then(result => {
        dispatch(editMasterMatchContestSuccess(result.data.payload));
      });
  };
}
export const editMasterMatchContestSuccess = res => ({
  type: EDIT_MATCH_MASTER_CONTEST_SUCCESS,
  res
});

export function getMasterContestDetails() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-master-contests')
      .then(result => {
        dispatch(getMasterContestDetailsSuccess(result.data.payload));
      });
  };
}
export const getMasterContestDetailsSuccess = res => ({
  type: GET_MASTER_CONTESTS_DETAILS_SUCCESS,
  res
});

export const cloneEditMasterContest = (record, actionType) => ({
  type: CLONE_EDIT_MASTER_CONTEST,
  record,
  actionType
});

export const clearMasterContestForm = () => ({
  type: CLEAR_MASTER_CONTEST_FORM
});

export function runRosterScheduler(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/run-roster-scheduler', { params: data })
      .then(result => {
        dispatch(runRosterSchedulerSuccess(result.data.payload));
      });
  };
}
export const runRosterSchedulerSuccess = res => ({
  type: RUN_ROSTER_SCHEDULER_SUCCESS,
  res
});

export function getNewLeague() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-new-league')
      .then(result => {
        dispatch(getNewLeagueSuccess(result.data.payload));
      });
  };
}
export const getNewLeagueSuccess = res => ({
  type: GET_NEW_LEAGUE_SUCCESS,
  res
});

export function getAllMasterContestType() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-all-master-contest-types')
      .then(result => {
        dispatch(getAllMasterContestTypeSuccess(result.data.payload));
      });
  };
}
export const getAllMasterContestTypeSuccess = res => ({
  type: GET_ALL_MASTER_CONTEST_TYPE_SUCCESS,
  res
});

export function createDefaultContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/create-default-contests', data)
      .then(result => {
        dispatch(createDefaultContestSuccess(result.data.payload));
      });
  };
}
export const createDefaultContestSuccess = res => ({
  type: CREATE_DEFAULT_CONTEST_SUCCESS,
  res
});

export function updateMasterContestOrder(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-master-contest-order', data)
      .then(result => {
        dispatch(updateMasterContestOrderSuccess(result.data.payload));
      });
  };
}
export const updateMasterContestOrderSuccess = res => ({
  type: UPDATE_MASTER_CONTEST_ORDER_SUCCESS,
  res
});

export function getPlayerScoreDetail(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-player-score-detail', {
        params: data
      })
      .then(result => {
        dispatch(getPlayerScoreDetailSuccess(result.data.payload));
      });
  };
}
export const getPlayerScoreDetailSuccess = res => ({
  type: GET_PLAYER_SCORE_DETAIL_SUCCESS,
  res
});

export function updateMultiContestDetail(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-multiple-contests', data)
      .then(result => {
        dispatch(updateMultiContestDetailSuccess(result.data.payload));
      });
  };
}
export const updateMultiContestDetailSuccess = res => ({
  type: UPDATE_MULTI_CONTEST_DETAIL_SUCCESS,
  res
});

export function updatePlayerScoreDetail(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-player-score-detail', data)
      .then(result => {
        dispatch(updatePlayerScoreDetailSuccess(result.data.payload));
      });
  };
}
export const updatePlayerScoreDetailSuccess = res => ({
  type: UPDATE_PLAYER_SCORE_DETAIL_SUCCESS,
  res
});

export function refundMatch(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/refund-match', data)
      .then(result => {
        dispatch(refundMatchSuccess(result.data.payload));
      });
  };
}
export const refundMatchSuccess = res => ({
  type: REFUND_MATCH_SUCCESS,
  res
});

export function getAllSegmentType() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-all-segment-type')
      .then(result => {
        dispatch(getAllSegmentTypeSuccess(result.data.payload));
      });
  };
}
export function getAllSeasonPass(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-all-season-pass', { params: data })
      .then(result => {
        dispatch(getAllSeasonPassSuccess(result.data.payload));
      });
  };
}
export const getAllSegmentTypeSuccess = res => ({
  type: GET_ALL_SEGMENT_TYPE_SUCCESS,
  res
});

export const getAllSeasonPassSuccess = res => ({
  type: GET_ALL_SEASON_PASS_SUCCESS,
  res
});

export function getMatchNotificationDetail(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-match-notification-detail', {
        params: data
      })
      .then(result => {
        dispatch(getMatchNotificationDetailSuccess(result.data.payload));
      });
  };
}
export const getMatchNotificationDetailSuccess = res => ({
  type: GET_MATCH_NOTIFICATION_DETAIL_SUCCESS,
  res
});

export function editMatchNotification(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/edit-match-notification', data)
      .then(result => {
        dispatch(editMatchNotificationSuccess(result.data.payload));
      });
  };
}
export const editMatchNotificationSuccess = res => ({
  type: EDIT_MATCH_NOTIFICATION_SUCCESS,
  res
});

export function sendMatchNotificationManually(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/send-match-notification-manually', data)
      .then(result => {
        dispatch(sendMatchNotificationManuallySuccess(result.data.payload));
      });
  };
}
export const sendMatchNotificationManuallySuccess = res => ({
  type: SEND_MATCH_NOTIFICATION_MANUALLY_SUCCESS,
  res
});

export function getMatchDetailById(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-match-detail-by-id', {
        params: data
      })
      .then(result => {
        dispatch(getMatchDetailByIdSuccess(result.data.payload));
      });
  };
}
export const getMatchDetailByIdSuccess = res => ({
  type: GET_MATCH_DETAIL_BY_ID_SUCCESS,
  res
});

export function createMasterContestFromMatchContest(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/fantasy/create-master-contest-from-match-contest',
        data
      )
      .then(result => {
        dispatch(
          createMasterContestFromMatchContestSuccess(result.data.payload)
        );
      });
  };
}
export const createMasterContestFromMatchContestSuccess = res => ({
  type: CREATE_MASTER_CONTEST_FROM_MATCH_CONTEST_SUCCESS,
  res
});

export function createMultipleMatchMultipleContest(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL +
          'api/fantasy/create-multiple-match-multiple-master-contest',
        data
      )
      .then(result => {
        dispatch(
          createMultipleMatchMultipleContestSuccess(result.data.payload)
        );
      });
  };
}
export const createMultipleMatchMultipleContestSuccess = res => ({
  type: CREATE_MULTIPLE_MATCH_MULTIPLE_MASTER_CONTEST_SUCCESS,
  res
});

export function createMasterContestFromSportToSport(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/fantasy/create-master-contest-from-sport-to-sport',
        data
      )
      .then(result => {
        dispatch(
          createMasterContestFromSportToSportSuccess(result.data.payload)
        );
      });
  };
}
export const createMasterContestFromSportToSportSuccess = res => ({
  type: CREATE_MASTER_CONTEST_FROM_SPORT_TO_SPORT_SUCCESS,
  res
});

export function deleteMasterContestByMasterType(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/fantasy/delete-master-contest-by-master-type',
        data
      )
      .then(result => {
        dispatch(deleteMasterContestByMasterTypeSuccess(result.data.payload));
      });
  };
}
export const deleteMasterContestByMasterTypeSuccess = res => ({
  type: DELETE_MASTER_CONTEST_BY_MASTER_TYPE_SUCCESS,
  res
});

export function updateAllContests(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-match-all-contest', data)
      .then(result => {
        dispatch(updateAllContestsSuccess(result.data.payload));
      });
  };
}
export const updateAllContestsSuccess = res => ({
  type: UPDATE_ALL_CONTESTS_FOR_MATCH_SUCCESS,
  res
});

export function getContestDetailById(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/search-contest-by-id', {
        params: data
      })
      .then(result => {
        dispatch(getContestDetailByIdSuccess(result.data.payload));
      });
  };
}
export const getContestDetailByIdSuccess = res => ({
  type: GET_CONTEST_DETAIL_BY_ID_SUCCESS,
  res
});

export function updateLatestScoreFromFeed(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/update-latest-score-from-feed', data)
      .then(result => {
        dispatch(updateLatestScoreFromFeedSuccess(result.data.payload));
      });
  };
}
export const updateLatestScoreFromFeedSuccess = res => ({
  type: UPDATE_LATEST_SCORE_FROM_FEED_SUCCESS,
  res
});

export function creditContestWinnings(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/credit-contest-winnings', data)
      .then(result => {
        dispatch(creditContestWinningsSuccess(result.data.payload));
      });
  };
}
export const creditContestWinningsSuccess = res => ({
  type: CREDIT_CONTEST_WINNINGS_SUCCESS,
  res
});

export function refundContest(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/refund-contest', data)
      .then(result => {
        dispatch(refundContestSuccess(result.data.payload));
      });
  };
}
export const refundContestSuccess = res => ({
  type: REFUND_CONTEST_SUCCESS,
  res
});

export function getAllContestCategory() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-all-contest-category')
      .then(result => {
        dispatch(getAllContestCategorySuccess(result.data.payload));
      });
  };
}
export const getAllContestCategorySuccess = res => ({
  type: GET_ALL_CONTEST_CATEGORY_SUCCESS,
  res
});

export function getAllCountryCode(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-all-country-code', {
        params: data
      })
      .then(result => {
        dispatch(getAllCountryCodeSuccess(result.data.payload));
      });
  };
}
export const getAllCountryCodeSuccess = res => ({
  type: GET_ALL_COUNTRY_CODE_SUCCESS,
  res
});

export function getMatchCountCountryWise(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-match-count-country-wise', {
        params: data
      })
      .then(result => {
        dispatch(getMatchCountCountryWiseSuccess(result.data.payload));
      });
  };
}
export const getMatchCountCountryWiseSuccess = res => ({
  type: GET_MATCH_COUNT_COUNTRY_WISE_SUCCESS,
  res
});

export function getContestMlPrice(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-contest-ml-price', {
        params: data
      })
      .then(result => {
        dispatch(getContestMlPriceSuccess(result.data.payload));
      });
  };
}
export const getContestMlPriceSuccess = res => ({
  type: GET_CONTEST_ML_PRICE_SUCCESS,
  res
});

export function setContestMlPrice(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/set-contest-ml-price', data)
      .then(result => {
        dispatch(setContestMlPriceSuccess(result.data.payload));
      });
  };
}
export const setContestMlPriceSuccess = res => ({
  type: SET_CONTEST_ML_PRICE_SUCCESS,
  res
});

export function getMlModelList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fantasy/get-ml-model-list', {
        params: data
      })
      .then(result => {
        dispatch(getMlModelListSuccess(result.data.payload));
      });
  };
}
export const getMlModelListSuccess = res => ({
  type: GET_ML_MODEL_LIST_SUCCESS,
  res
});

export function moveMatchFromLiveToUpcoming(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/move-match-from-live-to-upcoming', data)
      .then(result => {
        dispatch(moveMatchFromLiveToUpcomingSuccess(result.data.payload));
      });
  };
}
export const moveMatchFromLiveToUpcomingSuccess = res => ({
  type: MOVE_MATCH_FROM_LIVE_TO_UPCOMING
});
export function attachFantasyAssistantMatchId(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fantasy/attach-fantasy-assistant-match-id', data)
      .then(result => {
        dispatch(attachFantasyAssistantMatchIdSuccess(result.data.payload));
      });
  };
}
export const attachFantasyAssistantMatchIdSuccess = res => ({
  type: ATTACH_FANTASY_ASSISTANT_SUCCESS,
  res
});
