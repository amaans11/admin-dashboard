import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function AccountClosureReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_USER_DELINKED_STATUS:
      return { ...state, getUserDelinkedStatusResponse: action.res };
    case actionTypes.SUBMIT_DELINK_USER_REQUEST:
      return { ...state, submitDelinkUserRequestResponse: action.res };
    case actionTypes.UPDATE_DELINKING_STATUS:
      return { ...state, updateDelinkingStatusResponse: action.res };
    default:
      return state;
  }
}
