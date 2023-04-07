import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function segmentReducer(state = initialState.segment, action) {
  switch (action.type) {
    case types.CREATE_SEGMENT_SUCCESS:
      return { ...state };
    case types.GET_SEGMENT_LIST_SUCCESS:
    // return { ...state, list: action.res.segments ? action.res.segments : [] };
    case types.UPDATE_SEGMENT_SUCCESS:
      return { ...state };

    default:
      return state;
  }
}
