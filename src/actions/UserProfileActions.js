import * as actiontypes from '../shared/actionTypes';
import axios from 'axios';

export function getTierList() {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/user-profile/get-tier-list')
      .then(result => {
        dispatch(getTierListSuccess(result.data.payload));
      });
  };
}

export const getTierListSuccess = res => ({
  type: actiontypes.GET_TIER_LIST_SUCCESS,
  res
});

export function updateUserProfile(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/user-profile/update-profile', data)
      .then(result => {
        dispatch(updateUserProfileSuccess(result.data.payload));
      });
  };
}

export const updateUserProfileSuccess = res => ({
  type: actiontypes.UPDATE_USER_PROFILE_SUCCESS,
  res
});

export function updateUserVerifiedClientConfig(data) {
  return dispatch => {
    return axios
      .post(
        actiontypes.INT_API_URL +
          'api/user-profile/update-user-verified-client-config',
        data
      )
      .then(result => {
        dispatch(updateUserVerifiedClientConfigSuccess(result.data.payload));
      });
  };
}

export const updateUserVerifiedClientConfigSuccess = res => ({
  type: actiontypes.UPDATE_USER_VERIFIED_CLIENT_CONFIG_SUCCESS,
  res
});

export function getProfileByMobile(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/user-profile/get-user-by-mobile', {
        params: data
      })
      .then(result => {
        dispatch(getProfileByMobileSuccess(result.data.payload));
      });
  };
}

export const getProfileByMobileSuccess = res => ({
  type: actiontypes.GET_PROFILE_BY_MOBILE_SUCCESS,
  res
});

export function suggestUsers(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/profile-search/suggest-users', {
        params: data
      })
      .then(result => {
        dispatch(suggestUsersSuccess(result.data.payload));
      });
  };
}

export const suggestUsersSuccess = res => ({
  type: actiontypes.SUGGEST_USERS_SUCCESS,
  res
});

export function searchUsers(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/profile-search/search-users', {
        params: data
      })
      .then(result => {
        dispatch(searchUsersSuccess(result.data.payload));
      });
  };
}

export const searchUsersSuccess = res => ({
  type: actiontypes.SEARCH_USERS_SUCCESS,
  res
});

export function getProfileById(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/user-profile/get-user-by-id', {
        params: data
      })
      .then(result => {
        dispatch(getProfileByIdSuccess(result.data.payload));
      });
  };
}

export const getProfileByIdSuccess = res => ({
  type: actiontypes.GET_PROFILE_BY_ID_SUCCESS,
  res
});

export function getLinkedAccounts(data) {
  return dispatch => {
    return axios
      .post(
        actiontypes.INT_API_URL + 'api/user-profile/get-linked-accounts',
        data
      )
      .then(result => {
        dispatch(getLinkedAccountsSuccess(result.data.payload));
      });
  };
}

export const getLinkedAccountsSuccess = res => ({
  type: actiontypes.GET_LINKED_ACCOUNTS_SUCCESS,
  res
});

export function wipeUserProfile(userId) {
  return dispatch => {
    return axios
      .get(
        actiontypes.INT_API_URL + `api/user-profile/wipe-user-profile/${userId}`
      )
      .then(result => {
        dispatch(wipeUserProfileSuccess(result.data.payload));
      });
  };
}

export const wipeUserProfileSuccess = res => ({
  type: actiontypes.WIPE_USER_PROFILE_SUCCESS,
  res
});

export function wipeUserAvatar(userId) {
  return dispatch => {
    return axios
      .get(
        actiontypes.INT_API_URL + `api/user-profile/wipe-user-avatar/${userId}`
      )
      .then(result => {
        dispatch(wipeUserAvatarSuccess(result.data.payload));
      });
  };
}

export const wipeUserAvatarSuccess = res => ({
  type: actiontypes.WIPE_USER_AVATAR_SUCCESS,
  res
});

export function getDeviceDetails(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/user-profile/get-device-info', {
        params: data
      })
      .then(result => {
        dispatch(getDeviceDetailsSuccess(result.data.payload));
      });
  };
}

export const getDeviceDetailsSuccess = res => ({
  type: actiontypes.GET_DEVICE_DETAILS_SUCCESS,
  res
});

export function deleteDeviceDetails(data) {
  return dispatch => {
    return axios
      .post(
        actiontypes.INT_API_URL + 'api/user-profile/delete-device-info',
        data
      )
      .then(result => {
        dispatch(deleteDeviceDetailsSuccess(result.data.payload));
      });
  };
}

export const deleteDeviceDetailsSuccess = res => ({
  type: actiontypes.DELETE_DEVICE_DETAILS_SUCCESS,
  res
});
export function getUserInfo(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/user-profile/get-user-info', {
        params: data
      })
      .then(result => {
        dispatch(getUserInfoSuccess(result.data.payload));
      });
  };
}

export const getUserInfoSuccess = res => ({
  type: actiontypes.GET_USER_INFO_SUCCESS,
  res
});
