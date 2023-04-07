import * as actiontypes from '../shared/actionTypes';
import axios from 'axios';
import { message } from 'antd';
export function createCoupon(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/coupon/create', data)
      .then(result => {
        if (result.data.payload.error) {
          message.error(result.data.payload.error.message, 4);
        } else {
          dispatch(createCouponSuccess(result.data.payload));
        }
      });
  };
}
export const createCouponSuccess = res => ({
  type: actiontypes.CREATE_COUPON_SUCCESS,
  res
});
export function getCouponDetails(couponCode) {
  return dispatch => {
    return axios
      .get(
        actiontypes.INT_API_URL + `api/coupon/search?couponCode=${couponCode}`
      )
      .then(result => {
        if (!result.data.payload.error) {
          dispatch(getCouponDeatilsSuccess(result.data.payload));
        } else {
          message.error('Coupon not found, try different Coupon');
        }
      });
  };
}

export const getCouponDeatilsSuccess = res => ({
  type: actiontypes.GET_COUPON_DEATILS_SUCCESS,
  res
});
