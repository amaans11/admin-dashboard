import * as types from '../shared/actionTypes';

export default function couponReducer(state = {}, action) {
  switch (action.type) {
    case types.CREATE_COUPON_SUCCESS:
      return { ...state };

    case types.GET_COUPON_DEATILS_SUCCESS:
      return { ...state, couponDetails: action.res.coupon };
    default:
      return state;
  }
}
