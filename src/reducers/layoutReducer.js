import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function layoutReducer(state = initialState.layout, action) {
  switch (action.type) {
    case types.SIDE_MENU_TOGGLE:
      return Object.assign({}, state, { sideMenuShow: !action.sideMenu });

    default:
      return state;
  }
}
