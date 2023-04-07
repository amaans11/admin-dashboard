import * as types from '../shared/actionTypes';

export default function referralReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_REFERRAL_DETAILS_SUCCESS:
      return { ...state, referralDetails: action.res };
    case types.GET_REFERRAL_USER_DETAILS_SUCCESS:
      return { ...state, referredUserDetails: action.res };
    default:
      return state;
  }
}
