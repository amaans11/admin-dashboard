import * as types from '../shared/actionTypes';
import initialState from './initialState';
export default function userProfileReducer(
  state = initialState.updater,
  action
) {
  switch (action.type) {
    case types.GET_TIER_LIST_SUCCESS:
      return { ...state, tierList: action.res };
    case types.UPDATE_USER_PROFILE_SUCCESS:
      return { ...state, updateUserProfileResponse: action.res };
    case types.UPDATE_USER_VERIFIED_CLIENT_CONFIG_SUCCESS:
      return { ...state, updateUserVerifiedClientConfigResponse: action.res };
    case types.GET_PROFILE_BY_MOBILE_SUCCESS:
      return { ...state, getProfileByMobileResponse: action.res };
    case types.SUGGEST_USERS_SUCCESS:
      return { ...state, suggestUsersResponse: action.res };
    case types.SEARCH_USERS_SUCCESS:
      return { ...state, searchUsersResponse: action.res };
    case types.GET_PROFILE_BY_ID_SUCCESS:
      return { ...state, getProfileByIdResponse: action.res };
    case types.GET_LINKED_ACCOUNTS_SUCCESS:
      return { ...state, getLinkedAccountsResponse: action.res };
    case types.WIPE_USER_PROFILE_SUCCESS:
      return { ...state, wipeUserProfileResponse: action.res };
    case types.WIPE_USER_AVATAR_SUCCESS:
      return { ...state, wipeUserAvatarResponse: action.res };
    case types.GET_DEVICE_DETAILS_SUCCESS:
      return { ...state, getDeviceDetailsResponse: action.res };
    case types.DELETE_DEVICE_DETAILS_SUCCESS:
      return { ...state, deleteDeviceDetailsResponse: action.res };
    case types.GET_USER_INFO_SUCCESS:
      return { ...state, userInfoResponse: action.res };
    default:
      return state;
  }
}
