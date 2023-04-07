import * as types from '../shared/actionTypes';

export default function fantasyReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_MATCHES_SUCCESS:
      return { ...state, matches: action.res.matchDetailsList };
    case types.GET_MATCH_CONFIG_SUCCESS:
      return { ...state, createMatchConfigResponse: action.res };
    case types.GET_ALL_LINE_FORMAT_SUCCESS:
      return { ...state, lineFormats: action.res.lineupFormatDetailsList };
    case types.GET_MATCH_CONTESTS_SUCCESS:
      return { ...state, contests: action.res };
    case types.CREATE_MATCH_CONTEST_SUCCESS:
      return { ...state, createMatchContestResponse: action.res };
    case types.GET_MATCH_TIER_LIST_SUCCESS:
      return { ...state, tierList: action.res };
    case types.CLONE_EDIT_CONTEST:
      return {
        ...state,
        contestData: { record: action.record, actionType: action.actionType }
      };
    case types.EDIT_MATCH_CONTEST_SUCCESS:
      return { ...state, editMatchContestResponse: action.res };
    case types.DELETE_MATCH_CONTEST_SUCCESS:
      return { ...state, deleteMatchContestResponse: action.res };
    case types.ACTIVATE_MATCH_CONTEST_SUCCESS:
      return { ...state, activateMatchContestResponse: action.res };
    case types.UPDATE_CONTEST_ORDER_SUCCESS:
      return { ...state, updateContestOrderResponse: action.res };
    case types.EDIT_MATCH_CONFIG:
      return {
        ...state,
        matchConfig: { record: action.record, matchStatus: action.matchStatus }
      };
    case types.EDIT_MATCH_CONFIG_SUCCESS:
      return { ...state, editMatchConfigResponse: action.res };
    case types.GET_FANTASY_IMG_UPLOAD_URL_SUCCESS:
      return { ...state, assetUrl: action.res };
    case types.ACTIVATE_MATCH_CONFIG:
      return { ...state, activateMatchConfigResponse: action.res };
    case types.DEACTIVATE_MATCH_CONFIG:
      return { ...state, deActivateMatchConfigResponse: action.res };
    case types.GET_MATCH_ROSTER_SUCCESS:
      return { ...state, matchRoster: action.res };
    case types.VERIFY_MATCH_ROSTER_SUCCESS:
      return { ...state, verifyMatchRoster: action.res };
    case types.UPDATE_MATCH_ROSTER_SUCCESS:
      return { ...state, updateMatchRoster: action.res };
    case types.CLEAR_CONTEST_FORM:
      return { ...state, contestData: null };
    case types.CLEAR_MATCH_CONFIG_FORM:
      return { ...state, matchConfig: null };
    case types.ADD_MATCH_DETAILS:
      return { ...state, addMatchDetailsResponse: action.res };
    case types.EDIT_MATCH_DETAILS:
      return { ...state, editMatchDetails: { record: action.record } };
    case types.EDIT_MATCH_DETAILS_SUCCESS:
      return { ...state, editMatchDetailsResponse: action.res };
    case types.GET_MATCHES_ORDERING_SUCCESS:
      return { ...state, getMatchesOrderingResponse: action.res };
    case types.GET_REGISTERED_COUNT_SUCCESS:
      return { ...state, getRegisteredCountResponse: action.res };
    case types.UPDATE_MATCH_DETAILS_SUCCESS:
      return { ...state, updateMatchDetailsResponse: action.res };
    case types.GET_PLAYER_STATS_SUCCESS:
      return { ...state, getPlayerStatsResponse: action.res };
    case types.UPDATE_PLAYING_STATUS_SUCCESS:
      return { ...state, updatePlayingStatusResponse: action.res };
    case types.CANCEL_CONTEST_SUCCESS:
      return { ...state, cancelContestResponse: action.res };
    case types.UPDATE_PLAYER_PROFILE_SUCCESS:
      return { ...state, updatePlayerProfileResponse: action.res };
    case types.CREATE_MULTIPLE_MATCH_CONTEST_SUCCESS:
      return { ...state, createMultipleMatchContestResponse: action.res };
    case types.GET_CONTEST_COUNT_SUCCESS:
      return { ...state, getContestCountResponse: action.res };
    case types.CANCEL_MATCH_SUCCESS:
      return { ...state, cancelMatchResponse: action.res };
    case types.EXTEND_MATCH_SUCCESS:
      return { ...state, extendMatchResponse: action.res };
    case types.SEARCH_CONTEST_SUCCESS:
      return { ...state, contests: action.res };
    case types.GET_LEADERBOARD_SUCCESS:
      return { ...state, getLeaderboardResponse: action.res };
    case types.GET_MATCH_PLAYER_SCORE_SUCCESS:
      return { ...state, getMatchPlayerScoreResponse: action.res };
    case types.INITIATE_PRIZE_DISTRIBUTION_SUCCESS:
      return { ...state, initiatePrizeDistributionResponse: action.res };
    case types.UPDATE_MATCH_PLAYING_SCORE_SUCCESS:
      return { ...state, updateMatchPlayingScoreResponse: action.res };
    case types.CREATE_MATCH_MASTER_CONTEST_SUCCESS:
      return { ...state, createMatchMasterContestResponse: action.res };
    case types.EDIT_MATCH_MASTER_CONTEST_SUCCESS:
      return { ...state, editMatchMasterContestResponse: action.res };
    case types.GET_MASTER_CONTESTS_DETAILS_SUCCESS:
      return { ...state, getMasterContestsDetailsResponse: action.res };
    case types.CLONE_EDIT_MASTER_CONTEST:
      return {
        ...state,
        contestMasterData: {
          record: action.record,
          actionType: action.actionType
        }
      };
    case types.CLEAR_MASTER_CONTEST_FORM:
      return { ...state, contestMasterData: null };
    case types.RUN_ROSTER_SCHEDULER_SUCCESS:
      return { ...state, runRosterSchedulerResponse: action.res };
    case types.GET_NEW_LEAGUE_SUCCESS:
      return { ...state, getNewLeagueResponse: action.res };
    case types.GET_ALL_MASTER_CONTEST_TYPE_SUCCESS:
      return { ...state, getAllMasterContestTypeResponse: action.res };
    case types.CREATE_DEFAULT_CONTEST_SUCCESS:
      return { ...state, createDefaultContestResponse: action.res };
    case types.UPDATE_MASTER_CONTEST_ORDER_SUCCESS:
      return { ...state, updateMasterContestOrderResponse: action.res };
    case types.GET_PLAYER_SCORE_DETAIL_SUCCESS:
      return { ...state, getPlayerScoreDetailResponse: action.res };
    case types.UPDATE_MULTI_CONTEST_DETAIL_SUCCESS:
      return { ...state, updateMultiContestDetailResponse: action.res };
    case types.UPDATE_PLAYER_SCORE_DETAIL_SUCCESS:
      return { ...state, updatePlayerScoreDetailResponse: action.res };
    case types.REFUND_MATCH_SUCCESS:
      return { ...state, refundMatchResponse: action.res };
    case types.GET_ALL_SEGMENT_TYPE_SUCCESS:
      return { ...state, getAllSegmentTypeResponse: action.res };
    case types.GET_ALL_SEASON_PASS_SUCCESS:
      return { ...state, getAllSeasonPassResponse: action.res };
    case types.GET_MATCH_NOTIFICATION_DETAIL_SUCCESS:
      return { ...state, getMatchNotificationDetailResponse: action.res };
    case types.EDIT_MATCH_NOTIFICATION_SUCCESS:
      return { ...state, editMatchNotficationResponse: action.res };
    case types.SEND_MATCH_NOTIFICATION_MANUALLY_SUCCESS:
      return { ...state, sendMatchNotficationManuallyResponse: action.res };
    case types.GET_MATCH_DETAIL_BY_ID_SUCCESS:
      return { ...state, getMatchDetailByIdResponse: action.res };
    case types.CREATE_MASTER_CONTEST_FROM_MATCH_CONTEST_SUCCESS:
      return {
        ...state,
        createMasterContestFromMatchContestResponse: action.res
      };
    case types.CREATE_MULTIPLE_MATCH_MULTIPLE_MASTER_CONTEST_SUCCESS:
      return {
        ...state,
        createMultipleMatchMultipleMasterContestResponse: action.res
      };
    case types.CREATE_MASTER_CONTEST_FROM_SPORT_TO_SPORT_SUCCESS:
      return {
        ...state,
        createMasterContestFromSportToSportResponse: action.res
      };
    case types.DELETE_MASTER_CONTEST_BY_MASTER_TYPE_SUCCESS:
      return { ...state, deleteMasterContestByMasterTypeResponse: action.res };
    case types.UPDATE_ALL_CONTESTS_FOR_MATCH_SUCCESS:
      return { ...state, updateAllContestsForMatchResponse: action.res };
    case types.GET_CONTEST_DETAIL_BY_ID_SUCCESS:
      return { ...state, getContestDetailByIdResponse: action.res };
    case types.UPDATE_LATEST_SCORE_FROM_FEED_SUCCESS:
      return { ...state, updateLatestScoreFromFeedResponse: action.res };
    case types.CREDIT_CONTEST_WINNINGS_SUCCESS:
      return { ...state, creditContestWinningsResponse: action.res };
    case types.REFUND_CONTEST_SUCCESS:
      return { ...state, refundContestResponse: action.res };
    case types.GET_ALL_CONTEST_CATEGORY_SUCCESS:
      return { ...state, getAllContestCategoryResponse: action.res };
    case types.GET_MATCH_COUNT_COUNTRY_WISE_SUCCESS:
      return { ...state, getMatchCountCountryWiseResponse: action.res };
    case types.GET_CONTEST_ML_PRICE_SUCCESS:
      return { ...state, getContestMlPriceResponse: action.res };
    case types.SET_CONTEST_ML_PRICE_SUCCESS:
      return { ...state, setContestMlPriceResponse: action.res };
    case types.GET_ML_MODEL_LIST_SUCCESS:
      return { ...state, getMlModelListResponse: action.res };
    case types.MOVE_MATCH_FROM_LIVE_TO_UPCOMING:
      return { ...state, moveMatchFromLiveToUpcomingResponse: action.res };
    case types.ATTACH_FANTASY_ASSISTANT_SUCCESS:
      return { ...state, attachFantasyAssistantResponse: action.res };
    default:
      return state;
  }
}
