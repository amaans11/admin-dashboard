import * as types from '../shared/actionTypes';
import initialState from './initialState';
import { Object } from 'core-js';

export default function getCurrentUser(
  state = {
    ...initialState.auth, currentUser: {
      user_role: ''
    }
  },
  action
) {
  switch (action.type) {
    case types.GET_CURRENT_USER:
      return { ...state };
    case types.LOGIN_USER_SUCCESS:
      localStorage.setItem('cred', JSON.stringify(action.currentUser));
      // return Object.assign({}, state, { currentUser: action.currentUser });
      return { ...state, currentUser: action.currentUser };
    case types.LOGOUT_USER_SUCCESS:
      // localStorage.removeItem('cred');
      return { ...state, logoutUserResponse: action.res };
    default:
      return state;
  }
}
