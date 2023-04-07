import * as types from '../shared/actionTypes';

export default function referralConfigReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_REFERRAL_BACKEND_CONFIG_SUCCESS:
      return { ...state, getReferralBackendResponse: action.res };
    case types.SET_REFERRAL_BACKEND_CONFIG_SUCCESS:
      return { ...state, setReferralBackendResponse: action.res };
    case types.GET_REFERRAL_FRONTEND_CONFIG_SUCCESS:
      return { ...state, getReferralFrontendResponse: action.res };
    case types.GET_REFERRAL_CONFIG_UPLOAD_URL_SUCCESS:
      return { ...state, referralConfigUploadResponse: action.res };
    case types.SET_REFERRAL_FRONTEND_CONFIG_SUCCESS:
      return { ...state, setReferralFrontendResponse: action.res };
    case types.SET_REFERRAL_FRONTEND_CONFIG_V85_SUCCESS:
      return { ...state, setReferralFrontendV85Response: action.res };
    case types.GET_REFERRAL_CLIENT_CONFIG_SUCCESS:
      return { ...state, getReferralClientConfigResponse: action.res };
    case types.SET_REFERRAL_CLIENT_CONFIG_SUCCESS:
      return { ...state, setReferralClientConfigResponse: action.res };
    case types.GET_REFERRAL_CONFIG_SUCCESS:
      return { ...state, getReferralConfigResponse: action.res };
    case types.SET_REFERRAL_CONFIG_SUCCESS:
      return { ...state, setReferralConfigResponse: action.res };
    case types.SET_CONTEXTUAL_CONFIG_SUCCESS:
      return { ...state, setContextualConfigResponse: action.res };
    case types.GET_USER_PROFILE_CONFIG_SUCCESS:
      return { ...state, getUserProfileConfigResponse: action.res };
    case types.SET_USER_PROFILE_CONFIG_SUCCESS:
      return { ...state, setUserProfileConfigResponse: action.res };
    default:
      return state;
  }
}
