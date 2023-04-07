import * as types from '../shared/actionTypes';

export default function homeConfigReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_MISSION_CONFIG_SUCCESS:
      return { ...state, getMissionConfigResponse: action.res };
    case types.SET_MISSION_CONFIG_SUCCESS:
      return { ...state, setMissionConfigResponse: action.res };
    case types.GET_MISSION_CONFIG_SEGMENTATION_SUCCESS:
      return { ...state, getMissionSegmentationConfigResponse: action.res };
    case types.SET_MISSION_CONFIG_SEGMENTATION_SUCCESS:
      return { ...state, setMissionSegmentationConfigResponse: action.res };
    default:
      return state;
  }
}
