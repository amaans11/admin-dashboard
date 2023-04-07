import * as actionTypes from '../shared/actionTypes';
import axios from 'axios';
import { isEmpty } from 'lodash';

export const loginUser = user => {
  return async dispatch => {
    const res = await axios.post(actionTypes.INT_API_URL + 'auth/login', {
      user
    });
    if (res.data.payload && !isEmpty(res.data.payload)) {
      user.accessToken = res.data.payload.accessToken;
      user.refreshToken = res.data.payload.refreshToken;
      user.user_role = res.data.payload.user_role;
      delete user.googleToken;

      dispatch(loginUserSuccess(user));
    }
  };
};

export const loginUserSuccess = currentUser => {
  return { type: actionTypes.LOGIN_USER_SUCCESS, currentUser };
};

export const logoutUser = () => {
  return async dispatch => {
    const result = await axios.post(actionTypes.INT_API_URL + 'auth/logout');
    dispatch(logoutUserSuccess(result.data));
  };
};

export const logoutUserSuccess = res => {
  return { type: actionTypes.LOGOUT_USER_SUCCESS, res };
};
