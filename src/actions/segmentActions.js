import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';

export function createSegment(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/tournament/segment/create', data)
      .then(result => {
        dispatch(createSegmentSuccess(result.data.payload));
      });
  };
}
export const createSegmentSuccess = res => ({
  type: actionTypes.CREATE_SEGMENT_SUCCESS,
  res
});
export function getSegmentList(status) {
  return dispatch => {
    return axios
      .get(actionTypes.INT_API_URL + `api/tournament/segment/list/${status}`)
      .then(result => {
        dispatch(getSegmentListSuccess(result.data.payload));
      });
  };
}

export const getSegmentListSuccess = res => ({
  type: actionTypes.GET_SEGMENT_LIST_SUCCESS,
  res
});

export function updateSegment(data) {
  return dispatch => {
    return axios
      .post(actionTypes.INT_API_URL + 'api/tournament/segment/update', data)
      .then(result => {
        dispatch(updateSegmentSuccess(result.data.payload));
      });
  };
}
export const updateSegmentSuccess = res => ({
  type: actionTypes.UPDATE_SEGMENT_SUCCESS,
  res
});
