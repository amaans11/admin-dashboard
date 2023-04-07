import {
  CREATE_UPDATER_CONFIG_SUCCESS,
  CREATE_ASSET_URL_SUCCESS,
  CHANGE_UPDATER_STATE_SUCCESS,
  INT_API_URL,
  UPLOAD_ACCESS,
  LIST_UPDATES,
  HALT_DEPLOY_SUCCESS,
  UPDATE_ROLL_OUT_PERCENTAGE_SUCCESS,
  UPDATER_CACHE_CLEARED,
  UPDATE_UPDATER_STATE_SUCCESS
} from '../shared/actionTypes';
import { message } from 'antd';

import axios from 'axios';

export function createConfig(data) {
  return dispatch => {
    return axios.post(INT_API_URL + 'api/updater/create', data).then(result => {
      if (result.data.payload.config) {
        result.data.payload.config.type = data.type;
        dispatch(createConfigSuccess(result.data.payload.config));
      } else {
        message.error(
          'Version Code already exist, Check updater list for current version code'
        );
      }
      // dispatch(createConfigSuccess(result.data.payload));
    });
  };
}

export function createConfigSuccess(config) {
  return { type: CREATE_UPDATER_CONFIG_SUCCESS, config };
}

export function createAssetUrl(uploadInfo) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/updater/assets/create`, uploadInfo)
      .then(result => {
        dispatch(createAssetUrlSuccess(result.data.payload.response));
      });
  };
}
export function createAssetUrlSuccess(config) {
  return { type: CREATE_ASSET_URL_SUCCESS, config };
}
export function uploadSucsess() {
  return { type: UPLOAD_ACCESS };
}

export function publishUpdate(record, publishState) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/updater/change-state`, publishState)
      .then(result => {
        // if change is successful

        if (result.data.payload) {
          dispatch(publishUpdateSuccess(result.data.payload));
        } else {
          dispatch(createConfigSuccess(record));
        }
      });
  };
}
export function publishUpdateSuccess(config) {
  return { type: CHANGE_UPDATER_STATE_SUCCESS, config };
}

export function listUpdates(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/updater/list', { params: data })
      .then(result => {
        dispatch(listUpdatesSuccess(result.data.payload));
      });
  };
}
export function listUpdatesSuccess(list) {
  return { type: LIST_UPDATES, list };
}

export function haltDeploy(getHaltRequest) {
  console.log('getHaltRequest', getHaltRequest);
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/updater/halt-deploy`, getHaltRequest)
      .then(result => {
        if (result.data.payload) {
          dispatch(haltDeploySuccess(result.data.payload));
        }
      });
  };
}
export function haltDeploySuccess(data) {
  return { type: HALT_DEPLOY_SUCCESS, data };
}

export function updateRollOutPercentage(getHaltRequest) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + `api/updater/update-roll-out-percentage`,
        getHaltRequest
      )
      .then(result => {
        if (result.data.payload) {
          dispatch(updateRollOutPercentageSuccess(result.data.payload));
        }
      });
  };
}
export function updateRollOutPercentageSuccess(data) {
  return { type: UPDATE_ROLL_OUT_PERCENTAGE_SUCCESS, data };
}

export function clearCache() {
  return dispatch => {
    return axios.get(INT_API_URL + 'api/updater/clear-cache').then(result => {
      dispatch(clearCacheSuccess());
    });
  };
}
export function clearCacheSuccess() {
  return { type: UPDATER_CACHE_CLEARED };
}

export function changeState(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/updater/change-state', data)
      .then(result => {
        if (result.data.payload) {
          dispatch(changeStateSuccess(result.data.payload));
        }
      });
  };
}
export function changeStateSuccess(data) {
  return { type: UPDATE_UPDATER_STATE_SUCCESS, data };
}
