import * as actionTypes from '../shared/actionTypes';

export default function appOrderReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.GET_MAIN_ORDER_SUCCESS:
      let mainOrder = {
        groups: action.res.groupOrder ? action.res.groupOrder : []
      };
      return { ...state, mainOrder: mainOrder };
    case actionTypes.UPDATE_MAIN_ORDER_SUCCESS:
      return { ...state, groups: [] };

    default:
      return state;
  }
}
