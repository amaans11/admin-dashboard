import * as types from '../shared/actionTypes';

export default function featuredConfigReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_FEATURED_EVENT_SUCCESS:
      return { ...state, getFeaturedEventResponse: action.res };
    case types.UPDATE_FEATURED_EVENT_SUCCESS:
      return { ...state, updateFeaturedEventResponse: action.res };
    default:
      return state;
  }
}
