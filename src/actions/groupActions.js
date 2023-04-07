import * as actionType from '../shared/actionTypes';
import axios from 'axios';
import { notification } from 'antd';
export function editGroup(val) {
  return { type: actionType.EDIT_GROUP_SUCCESS, val };
}

export function deleteGroup(val) {
  return { type: actionType.DELETE_GROUP_SUCCESS, val };
}
export function addGroup(data) {
  return dispatch => {
    return axios
      .post(actionType.INT_API_URL + 'api/tournament/group/create ', data)
      .then(res => {
        notification.success({
          message: 'Group Created',
          description: `Group Created with Group Id ${res.data.payload.id}`,
          duration: 2
        });
        dispatch(addGroupSuccess());
      })
      .catch(error => {
        throw error;
      });
  };
}
export function addGroupSuccess() {
  return { type: actionType.CREATE_GROUP_SUCCESS };
}
export function getGroups() {
  return dispatch => {
    return axios
      .get(actionType.API_URL + 'group/all')
      .then(result => {
        dispatch(getGroupsSuccess(result.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function getGroupsSuccess(groups) {
  return { type: actionType.GET_GROUPS_SUCCESS, groups };
}
export function getGroupsByGame(gameId) {
  return dispatch => {
    return axios
      .get(actionType.INT_API_URL + `api/tournament/group/list/${gameId}`)

      .then(result => {
        dispatch(getGroupsByGameSuccess(result.data, gameId));
      })
      .catch(error => {
        throw error;
      });
  };
}
export function getGroupsByGameSuccess(groups, gameId) {
  return { type: actionType.GET_GROUPS_BY_GAME_SUCCESS, groups, gameId };
}
export function getConfigsBygroup(gameId, groupId) {
  return dispatch => {
    return axios
      .get(
        actionType.INT_API_URL +
          `api/tournament/config/list/${gameId}/${groupId}/COMBINED`
      )

      .then(result => {
        dispatch(getConfigsBygroupSuccess(result.data, gameId, groupId));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const getConfigsBygroupSuccess = (configs, gameId, groupId) => ({
  type: actionType.GET_CONFIGS_BY_GROUP_SUCCESS,
  configs,
  gameId,
  groupId
});

export function udateGroupOrder(data) {
  return dispatch => {
    return axios
      .post(actionType.API_URL + 'group/update', data)
      .then(result => {
        dispatch(udateGroupOrderSuccess(result.data.payload));
      });
  };
}
export const udateGroupOrderSuccess = res => ({
  type: actionType.UPDATE_GROUP_ORDER_SUCCESS,
  res
});
