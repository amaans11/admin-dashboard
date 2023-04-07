import * as actionType from '../shared/actionTypes';
import axios from 'axios';
export function addAdmin(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/admin/addadmin', data)
      .then(result => {
        dispatch(addAdminSuccess(result.data.payload));
      });
  };
}
export const addAdminSuccess = res => ({
  type: actionType.ADD_ADMIN_SUCCESS,
  res
});

export function addUser(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/admin/adduser', data)
      .then(result => {
        dispatch(addUserSuccess(result.data.payload));
      });
  };
}
export const addUserSuccess = res => ({
  type: actionType.ADD_USER_SUCCESS,
  res
});

export function listUsers() {
  return dispatch => {
    return axios
      .get(actionType.INT_API_URL + 'api/admin/users')
      .then(result => {
        dispatch(listUsersSuccess(result.data.payload));
      });
  };
}
export const listUsersSuccess = list => ({
  type: actionType.LIST_USERS_SUCCESS,
  list
});

export const editUserRole = user => ({
  type: actionType.EDIT_USER,
  user
});

export function updateUser(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/admin/updateuser', data)
      .then(result => {
        dispatch(updateUserSuccess(result.data.payload));
      });
  };
}
export const updateUserSuccess = res => ({
  type: actionType.UPDATE_USER_SUCCESS,
  res
});

export function deactivateUser(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/admin/deactivateuser', data)
      .then(result => {
        dispatch(deactivateUserSuccess(result.data.payload));
      });
  };
}
export const deactivateUserSuccess = res => ({
  type: actionType.DEACTIVATE_USER_SUCCESS,
  res
});

export function getUser(data) {
  return dispatch => {
    return axios
      .get(actionType.INT_API_URL + 'api/admin/get-user', { params: data })
      .then(result => {
        dispatch(getUserSuccess(result.data.payload));
      });
  };
}
export const getUserSuccess = res => ({
  type: actionType.GET_USER_SUCCESS,
  res
});

export function getExternalUserList() {
  return dispatch => {
    return axios
      .get(actionType.INT_API_URL + 'api/admin/get-external-user-list')
      .then(result => {
        dispatch(getExternalUserListSuccess(result.data.payload));
      });
  };
}
export const getExternalUserListSuccess = res => ({
  type: actionType.GET_EXTERNAL_USER_LIST_SUCCESS,
  res
});

export function deleteExternalUser(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/admin/delete-external-user', data)
      .then(result => {
        dispatch(deleteExternalUserSuccess(result.data.payload));
      });
  };
}
export const deleteExternalUserSuccess = res => ({
  type: actionType.DELETE_EXTERNAL_USER_SUCCESS,
  res
});

export function updateExternalUser(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/admin/update-external-user', data)
      .then(result => {
        dispatch(updateExternalUserSuccess(result.data.payload));
      });
  };
}
export const updateExternalUserSuccess = res => ({
  type: actionType.UPDATE_EXTERNAL_USER_SUCCESS,
  res
});

export function createExternalUser(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'auth/create-external-user', data)
      .then(result => {
        dispatch(createExternalUserSuccess(result.data.payload));
      });
  };
}
export const createExternalUserSuccess = res => ({
  type: actionType.CREATE_EXTERNAL_USER_SUCCESS,
  res
});

export function updateExternalUserPwd(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'auth/update-password-external', data)
      .then(result => {
        dispatch(updateExternalUserPwdSuccess(result.data));
      });
  };
}
export const updateExternalUserPwdSuccess = res => ({
  type: actionType.UPDATE_EXTERNAL_USER_PWD_SUCCESS,
  res
});
