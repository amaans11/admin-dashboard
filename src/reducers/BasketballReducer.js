import * as types from '../shared/actionTypes';

export default function basketballReducer(state = {}, action) {
  switch (action.type) {
    case types.BASKETBALL_GET_MATCHES_SUCCESS:
      return { ...state, matches: action.res.matchDetailsList };
    case types.BASKETBALL_GET_MATCH_CONFIG_SUCCESS:
      return { ...state, createMatchConfigResponse: action.res };
    case types.BASKETBALL_GET_ALL_LINE_FORMAT_SUCCESS:
      return { ...state, lineFormats: action.res.lineupFormatDetailsList };
    case types.BASKETBALL_GET_MATCH_CONTESTS_SUCCESS:
      return { ...state, contests: action.res };
    case types.BASKETBALL_CREATE_MATCH_CONTEST_SUCCESS:
      return { ...state, createMatchContestResponse: action.res };
    case types.BASKETBALL_GET_MATCH_TIER_LIST_SUCCESS:
      return { ...state, tierList: action.res };
    case types.BASKETBALL_CLONE_EDIT_CONTEST:
      return {
        ...state,
        contestData: { record: action.record, actionType: action.actionType }
      };
    case types.BASKETBALL_EDIT_MATCH_CONTEST_SUCCESS:
      return { ...state, editMatchContestResponse: action.res };
    case types.BASKETBALL_DELETE_MATCH_CONTEST_SUCCESS:
      return { ...state, deleteMatchContestResponse: action.res };
    case types.BASKETBALL_ACTIVATE_MATCH_CONTEST_SUCCESS:
      return { ...state, activateMatchContestResponse: action.res };
    case types.BASKETBALL_UPDATE_CONTEST_ORDER_SUCCESS:
      return { ...state, updateContestOrderResponse: action.res };
    case types.BASKETBALL_EDIT_MATCH_CONFIG:
      return {
        ...state,
        matchConfig: { record: action.record, matchStatus: action.matchStatus }
      };
    case types.BASKETBALL_EDIT_MATCH_CONFIG_SUCCESS:
      return { ...state, editMatchConfigResponse: action.res };
    case types.BASKETBALL_GET_FANTASY_IMG_UPLOAD_URL_SUCCESS:
      return { ...state, assetUrl: action.res };
    case types.BASKETBALL_ACTIVATE_MATCH_CONFIG:
      return { ...state, activateMatchConfigResponse: action.res };
    case types.BASKETBALL_DEACTIVATE_MATCH_CONFIG:
      return { ...state, deActivateMatchConfigResponse: action.res };
    case types.BASKETBALL_GET_MATCH_ROSTER_SUCCESS:
      return { ...state, matchRoster: action.res };
    case types.BASKETBALL_VERIFY_MATCH_ROSTER_SUCCESS:
      return { ...state, verifyMatchRoster: action.res };
    case types.BASKETBALL_UPDATE_MATCH_ROSTER_SUCCESS:
      return { ...state, updateMatchRoster: action.res };
    case types.BASKETBALL_CLEAR_CONTEST_FORM:
      return { ...state, contestData: null };
    case types.BASKETBALL_CLEAR_MATCH_CONFIG_FORM:
      return { ...state, matchConfig: null };
    case types.BASKETBALL_ADD_MATCH_DETAILS:
      return { ...state, addMatchDetailsResponse: action.res };
    case types.BASKETBALL_EDIT_MATCH_DETAILS:
      return { ...state, editMatchDetails: { record: action.record } };
    case types.BASKETBALL_EDIT_MATCH_DETAILS_SUCCESS:
      return { ...state, editMatchDetailsResponse: action.res };
    case types.BASKETBALL_GET_MATCHES_ORDERING_SUCCESS:
      return { ...state, getMatchesOrderingResponse: action.res };
    case types.BASKETBALL_GET_REGISTERED_COUNT_SUCCESS:
      return { ...state, getRegisteredCountResponse: action.res };
    case types.BASKETBALL_UPDATE_MATCH_DETAILS_SUCCESS:
      return { ...state, updateMatchDetailsResponse: action.res };
    case types.BASKETBALL_GET_PLAYER_STATS_SUCCESS:
      return { ...state, getPlayerStatsResponse: action.res };
    case types.BASKETBALL_UPDATE_PLAYING_STATUS_SUCCESS:
      return { ...state, updatePlayingStatusResponse: action.res };
    case types.BASKETBALL_CANCEL_CONTEST_SUCCESS:
      return { ...state, cancelContestResponse: action.res };
    case types.BASKETBALL_UPDATE_PLAYER_PROFILE_SUCCESS:
      return { ...state, updatePlayerProfileResponse: action.res };
    case types.BASKETBALL_CREATE_MULTIPLE_MATCH_CONTEST_SUCCESS:
      return { ...state, createMultipleMatchContestResponse: action.res };
    case types.BASKETBALL_GET_CONTEST_COUNT_SUCCESS:
      return { ...state, getContestCountResponse: action.res };
    case types.BASKETBALL_CANCEL_MATCH_SUCCESS:
      return { ...state, cancelMatchResponse: action.res };
    case types.BASKETBALL_EXTEND_MATCH_SUCCESS:
      return { ...state, extendMatchResponse: action.res };
    case types.BASKETBALL_SEARCH_CONTEST_SUCCESS:
      return { ...state, contests: action.res };
    case types.BASKETBALL_GET_LEADERBOARD_SUCCESS:
      return { ...state, getLeaderboardResponse: action.res };
    case types.BASKETBALL_GET_MATCH_PLAYER_SCORE_SUCCESS:
      return { ...state, getMatchPlayerScoreResponse: action.res };
    case types.BASKETBALL_INITIATE_PRIZE_DISTRIBUTION_SUCCESS:
      return { ...state, initiatePrizeDistributionResponse: action.res };
    case types.BASKETBALL_UPDATE_MATCH_PLAYING_SCORE_SUCCESS:
      return { ...state, updateMatchPlayingScoreResponse: action.res };
    case types.BASKETBALL_CREATE_MATCH_MASTER_CONTEST_SUCCESS:
      return { ...state, createMatchMasterContestResponse: action.res };
    case types.BASKETBALL_EDIT_MATCH_MASTER_CONTEST_SUCCESS:
      return { ...state, editMatchMasterContestResponse: action.res };
    case types.BASKETBALL_GET_MASTER_CONTESTS_DETAILS_SUCCESS:
      return { ...state, getMasterContestsDetailsResponse: action.res };
    case types.BASKETBALL_CLONE_EDIT_MASTER_CONTEST:
      return {
        ...state,
        contestMasterData: {
          record: action.record,
          actionType: action.actionType
        }
      };
    case types.BASKETBALL_CLEAR_MASTER_CONTEST_FORM:
      return { ...state, contestMasterData: null };
    case types.BASKETBALL_RUN_ROSTER_SCHEDULER_SUCCESS:
      return { ...state, runRosterSchedulerResponse: action.res };
    case types.BASKETBALL_GET_NEW_LEAGUE_SUCCESS:
      return { ...state, getNewLeagueResponse: action.res };
    case types.BASKETBALL_GET_ALL_MASTER_CONTEST_TYPE_SUCCESS:
      return { ...state, getAllMasterContestTypeResponse: action.res };
    case types.BASKETBALL_CREATE_DEFAULT_CONTEST_SUCCESS:
      return { ...state, createDefaultContestResponse: action.res };
    case types.BASKETBALL_UPDATE_MASTER_CONTEST_ORDER_SUCCESS:
      return { ...state, updateMasterContestOrderResponse: action.res };
    case types.BASKETBALL_GET_PLAYER_SCORE_DETAIL_SUCCESS:
      return { ...state, getPlayerScoreDetailResponse: action.res };
    case types.BASKETBALL_UPDATE_MULTI_CONTEST_DETAIL_SUCCESS:
      return { ...state, updateMultiContestDetailResponse: action.res };
    case types.BASKETBALL_UPDATE_PLAYER_SCORE_DETAIL_SUCCESS:
      return { ...state, updatePlayerScoreDetailResponse: action.res };
    case types.BASKETBALL_REFUND_MATCH_SUCCESS:
      return { ...state, refundMatchResponse: action.res };
    case types.BASKETBALL_GET_ALL_SEGMENT_TYPE_SUCCESS:
      return { ...state, getAllSegmentTypeResponse: action.res };
    case types.BASKETBALL_GET_MATCH_NOTIFICATION_DETAIL_SUCCESS:
      return { ...state, getMatchNotificationDetailResponse: action.res };
    case types.BASKETBALL_EDIT_MATCH_NOTIFICATION_SUCCESS:
      return { ...state, editMatchNotficationResponse: action.res };
    case types.BASKETBALL_SEND_MATCH_NOTIFICATION_MANUALLY_SUCCESS:
      return { ...state, sendMatchNotficationManuallyResponse: action.res };
    case types.BASKETBALL_GET_MATCH_DETAIL_BY_ID_SUCCESS:
      return { ...state, getMatchDetailByIdResponse: action.res };
    case types.BASKETBALL_CREATE_MASTER_CONTEST_FROM_MATCH_CONTEST_SUCCESS:
      return {
        ...state,
        createMasterContestFromMatchContestResponse: action.res
      };
    case types.BASKETBALL_CREATE_MULTIPLE_MATCH_MULTIPLE_MASTER_CONTEST_SUCCESS:
      return {
        ...state,
        createMultipleMatchMultipleMasterContestResponse: action.res
      };
    case types.BASKETBALL_CREATE_MASTER_CONTEST_FROM_SPORT_TO_SPORT_SUCCESS:
      return {
        ...state,
        createMasterContestFromSportToSportResponse: action.res
      };
    case types.BASKETBALL_DELETE_MASTER_CONTEST_BY_MASTER_TYPE_SUCCESS:
      return { ...state, deleteMasterContestByMasterTypeResponse: action.res };
    case types.BASKETBALL_UPDATE_ALL_CONTESTS_FOR_MATCH_SUCCESS:
      return { ...state, updateAllContestsForMatchResponse: action.res };
    case types.BASKETBALL_GET_CONTEST_DETAIL_BY_ID_SUCCESS:
      return { ...state, getContestDetailByIdResponse: action.res };
    case types.BASKETBALL_GET_ALL_COUNTRY_CODE_SUCCESS:
      return { ...state, getAllCountryCodeResponse: action.res };
    case types.BASKETBALL_CREDIT_CONTEST_WINNINGS_SUCCESS:
      return { ...state, creditContestWinningsResponse: action.res };
    case types.BASKETBALL_REFUND_CONTEST_SUCCESS:
      return { ...state, refundContestResponse: action.res };
    case types.BASKETBALL_GET_ALL_CONTEST_CATEGORY_SUCCESS:
      return { ...state, getAllContestCategoryResponse: action.res };
    case types.BASKETBALL_GET_MATCH_COUNT_COUNTRY_WISE_SUCCESS:
      return { ...state, getMatchCountCountryWiseResponse: action.res };
    case types.BASKETBALL_GET_CONTEST_ML_PRICE_SUCCESS:
      return { ...state, getContestMlPriceResponse: action.res };
    case types.BASKETBALL_SET_CONTEST_ML_PRICE_SUCCESS:
      return { ...state, setContestMlPriceResponse: action.res };
    case types.BASKETBALL_GET_ML_MODEL_LIST_SUCCESS:
      return { ...state, getMlModelListResponse: action.res };
    case types.BASKETBALL_MOVE_MATCH_FROM_LIVE_TO_UPCOMING:
      return { ...state, moveMatchFromLiveToUpcomingResponse: action.res };
    case types.BASKETBALL_GET_ALL_SEASON_PASS_SUCCESS:
      return { ...state, getAllSeasonPassResponse: action.res };
    default:
      return state;
  }
}
