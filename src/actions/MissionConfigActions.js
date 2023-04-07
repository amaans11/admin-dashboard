import axios from 'axios';

import {
  INT_API_URL,
  GET_MISSION_CONFIG_SUCCESS,
  SET_MISSION_CONFIG_SUCCESS,
  GET_MISSION_CONFIG_SEGMENTATION_SUCCESS,
  SET_MISSION_CONFIG_SEGMENTATION_SUCCESS
} from '../shared/actionTypes';

export const getMissionConfig = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/missions/get-mission-config',
      {
        params: data
      }
    );
    dispatch(getMissionConfigSuccess(result.data.payload));
  };
};

export const getMissionConfigSuccess = res => ({
  type: GET_MISSION_CONFIG_SUCCESS,
  res
});

export const setMissionConfig = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/missions/set-mission-config',
      data
    );
    dispatch(setMissionConfigSuccess(result.data.payload));
  };
};
export const setMissionConfigSuccess = res => ({
  type: SET_MISSION_CONFIG_SUCCESS,
  res
});

export const getMissionSegmentationConfig = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/missions/get-mission-config-segmentation',
      {
        params: data
      }
    );
    dispatch(getMissionSegmentationConfigSuccess(result.data.payload));
  };
};

export const getMissionSegmentationConfigSuccess = res => ({
  type: GET_MISSION_CONFIG_SEGMENTATION_SUCCESS,
  res
});

export const setMissionSegmentationConfig = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/missions/set-mission-config-segmentation',
      data
    );
    dispatch(setMissionSegmentationConfigSuccess(result.data.payload));
  };
};
export const setMissionSegmentationConfigSuccess = res => ({
  type: SET_MISSION_CONFIG_SEGMENTATION_SUCCESS,
  res
});
