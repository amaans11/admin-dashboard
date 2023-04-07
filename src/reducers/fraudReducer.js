import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function fraudReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHECK_GAME_FRAUD_SUCCESS:
      return { ...state, gameFraud: action.res };
    case types.BLOCK_USER_DASHBOARD_SUCCESS:
      return { ...state, blockUserDashboardResponse: action.res };
    case types.GET_INVESTIGATION_DETAILS_SUCCESS:
      return { ...state, getInvestigationDetailsResponse: action.res };
    case types.BLOCK_ON_APP_LEVEL_V2_SUCCESS:
      return { ...state, blockOnAppLevelV2Response: action.res };
    case types.GET_APP_LEVEL_BLOCK_REASONS_SUCCESS:
      return { ...state, getAppLevelBlockReasonsResponse: action.res };
    case types.GET_ML_FRAUD_INFO:
      return { ...state, mlFraud: action.res };
    case types.GET_ML_FRAUD_ACTIVITY_INFO:
      return { ...state, mlFraudActivity: action.res };
    case types.BULK_BLOCK_ON_APP_LEVEL_V2_SUCCESS:
      return { ...state, bulkBlockOnAppLevelV2Response: action.res };
    case types.GET_COLLUSION_DATA:
      return { ...state, collusionData: action.res };
    case types.UPDATE_COLLUSION_DATA:
      return { ...state, updateCollusion: action.res };
    case types.GET_FRAUD_RULES:
      return { ...state, getFraudRulesResponse: action.res };
    case types.SET_FRAUD_RULES:
      return { ...state, setFraudRulesResponse: action.res };
    case types.GET_COLLUSION_WITHDRAWL_DATA:
      return { ...state, collusionWithdrawlData: action.res };
    case types.UPDATE_COLLUSION_WITHDRAWL_DATA:
      return { ...state, updateCollusionWithdrawl: action.res };
    case types.GET_ALL_DEVICE_ID_SUCCESS:
      return { ...state, getAllDeviceIdResponse: action.res };
    default:
      return state;
  }
}
