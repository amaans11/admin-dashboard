import * as types from '../shared/actionTypes';

export default function clevertapReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_CLEVERTAP_PROFILE_SUCCESS:
      return { ...state, getClevertapProfileResponse: action.res };
    case types.GET_CLEVERTAP_EVENTS_SUCCESS:
      return { ...state, getClevertapEventsResponse: action.res };
    default:
      return state;
  }
}
