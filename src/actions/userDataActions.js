/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_BASIC_PROFILE_LIST_SUCCESS,
  GET_FOLLOWER_USER_LIST_SUCCESS,
  GET_USER_DETAIL_PROFILE_SUCCESS,
  GET_CASH_USER_LIST_SUCCESS,
  GET_UG_USER_LIST_SUCCESS,
  GET_BASIC_PROFILE_SUCCESS,
  UPDATE_BASIC_PROFILE_SUCCESS,
  GET_USER_BY_MOBILE_SUCCESS,
  GET_USER_STATUS_DETAILS_SUCCESS,
  GET_USER_DEVICE_ID_SUCCESS,
  GET_USERS_FROM_DEVICE_ID_SUCCESS,
  ADD_TO_CUG_SUCCESS,
  GET_USER_FEATURE_ACCESS_SUCCESS,
  SAVE_USER_FEATURE_ACCESS_SUCCESS,
  GET_FEATURE_ACCESS_CONFIG_SUCCESS,
  GET_BULK_USER_FEATURE_ACCESS_SUCCESS,
  GET_USER_ID_SUID_SUCCESS,
  BULK_PROCESS_HASHED_ID_REQUEST,
  BULK_PROCESS_HASHED_ID_SUCCESS
} from '../shared/actionTypes';

export function getUserBasicProfile(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-data/getUser', { params: data })
      .then(result => {
        dispatch(getUserBasicProfileSuccess(result.data.payload));
      });
  };
}

export const getUserBasicProfileSuccess = res => ({
  type: GET_BASIC_PROFILE_SUCCESS,
  res
});

export function updateUserBasicProfile(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/user-data/update-user', data)
      .then(result => {
        dispatch(updateUserBasicProfileSuccess(result.data.payload));
      });
  };
}

export const updateUserBasicProfileSuccess = res => ({
  type: UPDATE_BASIC_PROFILE_SUCCESS,
  res
});

export function getUserBasicProfileList(data) {
  return dispatch => {
    return axios.post(INT_API_URL + 'api/user-data/list', data).then(result => {
      dispatch(getUserBasicProfileListSuccess(result.data.payload));
    });
  };
}

export const getUserBasicProfileListSuccess = res => ({
  type: GET_BASIC_PROFILE_LIST_SUCCESS,
  res
});

export function getFollowerUserList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-relation/list', { params: data })
      .then(result => {
        dispatch(getFollowerUserListSuccess(result.data.payload));
      });
  };
}

export const getFollowerUserListSuccess = res => ({
  type: GET_FOLLOWER_USER_LIST_SUCCESS,
  res
});

export function getUserDetailProfile(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/user-data/get-user-info', data)
      .then(result => {
        dispatch(getUserDetailProfileSuccess(result.data.payload));
      });
  };
}

export const getUserDetailProfileSuccess = res => ({
  type: GET_USER_DETAIL_PROFILE_SUCCESS,
  res
});

export function getCashUserList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-relation/cash-list', { params: data })
      .then(result => {
        dispatch(getCashUserListSuccess(result.data.payload));
      });
  };
}

export const getCashUserListSuccess = res => ({
  type: GET_CASH_USER_LIST_SUCCESS,
  res
});

export function getUGUserList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-relation/ug-list', { params: data })
      .then(result => {
        dispatch(getUGUserListSuccess(result.data.payload));
      });
  };
}

export const getUGUserListSuccess = res => ({
  type: GET_UG_USER_LIST_SUCCESS,
  res
});

export function getUserByMobile(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-profile/get-user-by-mobile', {
        params: data
      })
      .then(result => {
        dispatch(getUserByMobileSuccess(result.data.payload));
      });
  };
}

export const getUserByMobileSuccess = res => ({
  type: GET_USER_BY_MOBILE_SUCCESS,
  res
});

export function getUserStatusDetails(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-data/get-user-status-details', {
        params: data
      })
      .then(result => {
        dispatch(getUserStatusDetailsSuccess(result.data.payload));
      });
  };
}

export const getUserStatusDetailsSuccess = res => ({
  type: GET_USER_STATUS_DETAILS_SUCCESS,
  res
});

export function getUserDeviceId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-data/get-user-device-id', {
        params: data
      })
      .then(result => {
        dispatch(getUserDeviceIdSuccess(result.data.payload));
      });
  };
}

export const getUserDeviceIdSuccess = res => ({
  type: GET_USER_DEVICE_ID_SUCCESS,
  res
});

export function getUsersFromDeviceId(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-data/get-users-from-device-id', {
        params: data
      })
      .then(result => {
        dispatch(getUsersFromDeviceIdSuccess(result.data.payload));
      });
  };
}

export const getUsersFromDeviceIdSuccess = res => ({
  type: GET_USERS_FROM_DEVICE_ID_SUCCESS,
  res
});

export function addToCug(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/user-profile/add-to-cug', data)
      .then(result => {
        dispatch(addToCugSuccess(result.data.payload));
      });
  };
}

export const addToCugSuccess = res => ({
  type: ADD_TO_CUG_SUCCESS,
  res
});

export function getUserFeatureAccess(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-relation/feature-access', {
        params: data
      })
      .then(result => {
        dispatch(getUserFeatureAccessSuccess(result.data.payload));
      });
  };
}

export function getBulkUserFeatureAccesses(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/user-relation/feature-access-list', data)
      .then(result => {
        dispatch(getBulkUserFeatureAccessesSuccess(result.data.payload));
      });
  };
}

export const getBulkUserFeatureAccessesSuccess = res => ({
  type: GET_BULK_USER_FEATURE_ACCESS_SUCCESS,
  res
});
export const getUserFeatureAccessSuccess = res => ({
  type: GET_USER_FEATURE_ACCESS_SUCCESS,
  res
});

export function saveUserFeatureAccess(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/user-relation/feature-access', data)
      .then(result => {
        dispatch(saveUserFeatureAccessSuccess(result.data.payload));
      });
  };
}

export const saveUserFeatureAccessSuccess = res => ({
  type: SAVE_USER_FEATURE_ACCESS_SUCCESS,
  res
});

export function getFetureAccessConfig() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/user-relation/feature-config')
      .then(result => {
        dispatch(getFetureAccessConfigSuccess(result.data.payload));
      });
  };
}

export const getFetureAccessConfigSuccess = res => ({
  type: GET_FEATURE_ACCESS_CONFIG_SUCCESS,
  res
});
export function getUserIdSuid(data, type = null) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/user-data/get-user-id-for-suid', data)
      .then(result => {
        if (type == 'bulk-process') {
          let res = {};
          if (!result.data.payload.error) {
            res = {
              userId: result.data.payload.userId,
              hashedId: data.suid[0],
              error: ''
            };
          } else {
            res = {
              userId: '',
              hashedId: data.suid[0],
              error: 'Invalid Hashed Id'
            };
          }
          dispatch(bulkProcessHashedIdSuccess(res));
        } else {
          dispatch(getUserIdSuidSuccess(result.data.payload));
        }
      });
  };
}

export const getUserIdSuidSuccess = res => ({
  type: GET_USER_ID_SUID_SUCCESS,
  res
});

export const bulkProcessHashedIdSuccess = res => ({
  type: BULK_PROCESS_HASHED_ID_SUCCESS,
  res
});
export function bulkProcessHashedId() {
  return dispatch => {
    dispatch(bulkProcessHashedIdRequest());
  };
}
export const bulkProcessHashedIdRequest = () => ({
  type: BULK_PROCESS_HASHED_ID_REQUEST
});
