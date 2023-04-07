import * as types from '../shared/actionTypes';

export default function influencerReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_INFLUENCER_CONFIG_SUCCESS:
      return { ...state, getInfluencerConfigResponse: action.res };
    case types.SET_INFLUENCER_CONFIG_SUCCESS:
      return { ...state, setInfluencerConfigResponse: action.res };
    default:
      return state;
  }
}
