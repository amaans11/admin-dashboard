/* eslint-disable semi */
import axios from 'axios';
import { result } from 'lodash';
import {
  INT_API_URL,
  CHECK_GAME_FRAUD_SUCCESS,
  BLOCK_USER_DASHBOARD_SUCCESS,
  GET_INVESTIGATION_DETAILS_SUCCESS,
  BLOCK_ON_APP_LEVEL_V2_SUCCESS,
  GET_APP_LEVEL_BLOCK_REASONS_SUCCESS,
  GET_ML_FRAUD_INFO,
  GET_ML_FRAUD_ACTIVITY_INFO,
  BULK_BLOCK_ON_APP_LEVEL_V2_SUCCESS,
  GET_COLLUSION_DATA,
  UPDATE_COLLUSION_DATA,
  GET_COLLUSION_WITHDRAWL_DATA,
  UPDATE_COLLUSION_WITHDRAWL_DATA,
  GET_FRAUD_RULES,
  SET_FRAUD_RULES,
  GET_ALL_DEVICE_ID_SUCCESS
} from '../shared/actionTypes';

export function checkGameFraud(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fraud/check-game-fraud', {
        params: data
      })
      .then(result => {
        dispatch(checkGameFraudSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const checkGameFraudSuccess = res => ({
  type: CHECK_GAME_FRAUD_SUCCESS,
  res
});

export function blockUserDashboard(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/block-user-dashboard', data)
      .then(result => {
        dispatch(blockUserDashboardSuccess(result.data.payload));
      });
  };
}

export const blockUserDashboardSuccess = res => ({
  type: BLOCK_USER_DASHBOARD_SUCCESS,
  res
});

export function getInvestigationDetails(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/get-investigation-details', data)
      .then(result => {
        dispatch(getInvestigationDetailsSuccess(result.data.payload));
      });
  };
}

export const getInvestigationDetailsSuccess = res => ({
  type: GET_INVESTIGATION_DETAILS_SUCCESS,
  res
});

export function blockOnAppLevelV2(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/block-on-app-level-v2', data)
      .then(result => {
        dispatch(blockOnAppLevelV2Success(result.data.payload));
      });
  };
}
export const blockOnAppLevelV2Success = res => ({
  type: BLOCK_ON_APP_LEVEL_V2_SUCCESS,
  res
});

export function getAppLevelBlokReasons() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fraud/app-level-block-reasons')
      .then(result => {
        dispatch(getAppLevelBlokReasonsSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const getAppLevelBlokReasonsSuccess = res => ({
  type: GET_APP_LEVEL_BLOCK_REASONS_SUCCESS,
  res
});

export function getMlFraudInfo(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/get-ml-fraud-info', data)
      .then(result => {
        dispatch(getMlFraudInfoSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const getMlFraudInfoSuccess = res => ({
  type: GET_ML_FRAUD_INFO,
  res
});

export function getMlFraudActivityInfo(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/get-ml-fraud-activity-info', data)
      .then(result => {
        dispatch(getMlFraudActivityInfoSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const getMlFraudActivityInfoSuccess = res => ({
  type: GET_ML_FRAUD_ACTIVITY_INFO,
  res
});

export function bulkBlockOnAppLevelV2(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/bulk-block-on-app-level-v2', data)
      .then(result => {
        dispatch(bulkBlockOnAppLevelV2Success(result.data.payload));
      });
  };
}
export const bulkBlockOnAppLevelV2Success = res => ({
  type: BULK_BLOCK_ON_APP_LEVEL_V2_SUCCESS,
  res
});

export function getCollusionData(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/get-collusion-data', data)
      .then(result => {
        dispatch(getCollusionDataSuccess(result.data.payload));
      });
  };
}
export const getCollusionDataSuccess = res => ({
  type: GET_COLLUSION_DATA,
  res
});

export function updateCollusionData(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/update-collusion-data', data)
      .then(result => {
        dispatch(updateCollusionDataSuccess(result.data.payload));
      });
  };
}
export const updateCollusionDataSuccess = res => ({
  type: UPDATE_COLLUSION_DATA,
  res
});

export function getFraudRules() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fraud/get-fraud-rules')
      .then(result => {
        dispatch(getFraudRulesSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const getFraudRulesSuccess = res => ({
  type: GET_FRAUD_RULES,
  res
});

export function setFraudRules(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/set-fraud-rules', data)
      .then(result => {
        dispatch(setFraudRulesSuccess(result.data.payload));
      });
  };
}
export const setFraudRulesSuccess = res => ({
  type: SET_FRAUD_RULES,
  res
});

export function getCollusionWithdrawlData(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/get-collusion-withdrawl-data', data)
      .then(result => {
        dispatch(getCollusionWithdrawlDataSuccess(result.data.payload));
      });
  };
}
export const getCollusionWithdrawlDataSuccess = res => ({
  type: GET_COLLUSION_WITHDRAWL_DATA,
  res
});

export function updateCollusionWithdrawlData(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/fraud/update-collusion-withdrawl-data', data)
      .then(result => {
        dispatch(updateCollusionWithdrawlDataSuccess(result.data.payload));
      });
  };
}
export const updateCollusionWithdrawlDataSuccess = res => ({
  type: UPDATE_COLLUSION_WITHDRAWL_DATA
});

export function getAllDeviceId(userId) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/fraud/get-all-devices-id', {
        params: userId
      })
      .then(result => {
        dispatch(getAllDeviceIdSuccess(result.data.payload));
      });
  };
}

export const getAllDeviceIdSuccess = res => ({
  type: GET_ALL_DEVICE_ID_SUCCESS,
  res
});
