/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_INTERNAL_TOOL_LIST_SUCCESS,
  CREATE_INTERNAL_TOOL_SUCCESS,
  EDIT_INTERNAL_TOOL,
  CLEAR_TOOL_FORM,
  UPDATE_INTERNAL_TOOL_SUCCESS,
  RUN_INTERNAL_TOOL_SUCCESS,
  DELETE_INTERNAL_TOOL_SUCCESS
} from '../shared/actionTypes';

export function getInternalToolList() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/internal-tool/get-list')
      .then(result => {
        dispatch(getInternalToolListSuccess(result.data.payload));
      });
  };
}

export const getInternalToolListSuccess = res => ({
  type: GET_INTERNAL_TOOL_LIST_SUCCESS,
  res
});

export function createInternalTool(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/internal-tool/create', data)
      .then(result => {
        dispatch(createInternalToolSuccess(result.data.payload));
      });
  };
}
export const createInternalToolSuccess = res => ({
  type: CREATE_INTERNAL_TOOL_SUCCESS,
  res
});

export const editTool = toolDetails => ({
  type: EDIT_INTERNAL_TOOL,
  data: {
    toolDetails: toolDetails,
    editType: 'EDIT'
  }
});

export const clearToolForm = () => ({
  type: CLEAR_TOOL_FORM
});

export function updateInternalTool(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/internal-tool/update', data)
      .then(result => {
        dispatch(updateInternalToolSuccess(result.data.payload));
      });
  };
}
export const updateInternalToolSuccess = res => ({
  type: UPDATE_INTERNAL_TOOL_SUCCESS,
  res
});

export function runInternalTool(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/internal-tool/run', data)
      .then(result => {
        dispatch(runInternalToolSuccess(result.data.payload));
      });
  };
}
export const runInternalToolSuccess = res => ({
  type: RUN_INTERNAL_TOOL_SUCCESS,
  res
});

export function deleteInternalTool(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/internal-tool/delete', data)
      .then(result => {
        dispatch(deleteInternalToolSuccess(result.data.payload));
      });
  };
}
export const deleteInternalToolSuccess = res => ({
  type: DELETE_INTERNAL_TOOL_SUCCESS,
  res
});
