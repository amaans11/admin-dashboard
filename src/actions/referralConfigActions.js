/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_REFERRAL_BACKEND_CONFIG_SUCCESS,
  SET_REFERRAL_BACKEND_CONFIG_SUCCESS,
  GET_REFERRAL_FRONTEND_CONFIG_SUCCESS,
  SET_REFERRAL_FRONTEND_CONFIG_SUCCESS,
  SET_REFERRAL_FRONTEND_CONFIG_V85_SUCCESS,
  GET_REFERRAL_CLIENT_CONFIG_SUCCESS,
  SET_REFERRAL_CLIENT_CONFIG_SUCCESS,
  GET_REFERRAL_CONFIG_SUCCESS,
  SET_REFERRAL_CONFIG_SUCCESS,
  SET_CONTEXTUAL_CONFIG_SUCCESS,
  GET_USER_PROFILE_CONFIG_SUCCESS,
  SET_USER_PROFILE_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getReferralBackendConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral-config/referral-backend-config', {
        params: data
      })
      .then(result => {
        dispatch(getReferralBackendConfigSuccess(result.data.payload));
      });
  };
}

export const getReferralBackendConfigSuccess = res => ({
  type: GET_REFERRAL_BACKEND_CONFIG_SUCCESS,
  res
});

export function setReferralBackendConfig(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/referral-config/set-referral-backend-config',
        data
      )
      .then(result => {
        dispatch(setReferralBackendConfigSuccess(result.data.payload));
      });
  };
}
export const setReferralBackendConfigSuccess = res => ({
  type: SET_REFERRAL_BACKEND_CONFIG_SUCCESS,
  res
});

export function getReferralFrontendConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral-config/referral-frontend-config', {
        params: data
      })
      .then(result => {
        dispatch(getReferralFrontendConfigSuccess(result.data.payload));
      });
  };
}

export const getReferralFrontendConfigSuccess = res => ({
  type: GET_REFERRAL_FRONTEND_CONFIG_SUCCESS,
  res
});

export function setReferralFrontendConfig(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/referral-config/set-referral-frontend-config',
        data
      )
      .then(result => {
        dispatch(setReferralFrontendConfigSuccess(result.data.payload));
      });
  };
}
export const setReferralFrontendConfigSuccess = res => ({
  type: SET_REFERRAL_FRONTEND_CONFIG_SUCCESS,
  res
});

export function setReferralFrontendConfigV85(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/referral-config/set-referral-frontend-config-v85',
        data
      )
      .then(result => {
        dispatch(setReferralFrontendConfigV85Success(result.data.payload));
      });
  };
}
export const setReferralFrontendConfigV85Success = res => ({
  type: SET_REFERRAL_FRONTEND_CONFIG_V85_SUCCESS,
  res
});

export function getReferralClientConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral-config/referral-client-config', {
        params: data
      })
      .then(result => {
        dispatch(getReferralClientConfigSuccess(result.data.payload));
      });
  };
}

export const getReferralClientConfigSuccess = res => ({
  type: GET_REFERRAL_CLIENT_CONFIG_SUCCESS,
  res
});

export function setReferralClientConfig(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/referral-config/set-referral-client-config',
        data
      )
      .then(result => {
        dispatch(setReferralClientConfigSuccess(result.data.payload));
      });
  };
}
export const setReferralClientConfigSuccess = res => ({
  type: SET_REFERRAL_CLIENT_CONFIG_SUCCESS,
  res
});

export function getReferralConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral-config/referral-config', {
        params: data
      })
      .then(result => {
        dispatch(getReferralConfigSuccess(result.data.payload));
      });
  };
}

export const getReferralConfigSuccess = res => ({
  type: GET_REFERRAL_CONFIG_SUCCESS,
  res
});

export function setReferralConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/referral-config/set-referral-config', data)
      .then(result => {
        dispatch(setReferralConfigSuccess(result.data.payload));
      });
  };
}
export const setReferralConfigSuccess = res => ({
  type: SET_REFERRAL_CONFIG_SUCCESS,
  res
});

export function setContextualConfig(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/referral-config/set-contextual-sharing-config',
        data
      )
      .then(result => {
        dispatch(setContextualConfigSuccess(result.data.payload));
      });
  };
}

export const setContextualConfigSuccess = res => ({
  type: SET_CONTEXTUAL_CONFIG_SUCCESS,
  res
});

// User profile config
export function getUserProfileConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/referral-config/user-profile-config', {
        params: data
      })
      .then(result => {
        dispatch(getUserProfileConfigSuccess(result.data.payload));
      });
  };
}

export const getUserProfileConfigSuccess = res => ({
  type: GET_USER_PROFILE_CONFIG_SUCCESS,
  res
});

export function setUserProfileConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/referral-config/set-user-profile-config', data)
      .then(result => {
        dispatch(setUserProfileConfigSuccess(result.data.payload));
      });
  };
}

export const setUserProfileConfigSuccess = res => ({
  type: SET_USER_PROFILE_CONFIG_SUCCESS,
  res
});
