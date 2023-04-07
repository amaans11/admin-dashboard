import * as types from '../shared/actionTypes';
import { routerActions } from 'connected-react-router';

export default function offersReducer(state = {}, action) {
  switch (action.type) {
    case types.CREATE_GLOBAL_COUPON_SUCCESS:
      return { ...state, createGlobalCouponResponse: action.res };
    case types.GET_GLOBAL_COUPON_LIST_SUCCESS:
      return { ...state, getGlobalCouponListResponse: action.res };
    case types.UPDATE_GLOBAL_COUPON_SUCCESS:
      return { ...state, updateGlobalCouponResponse: action.res };
    case types.EDIT_OFFERS:
      return { ...state, offersData: action.record };
    case types.CREATE_TICKET_SUCCESS:
      return { ...state, createTicketResponse: action.res };
    case types.FETCH_TICKETS_SUCCESS:
      return { ...state, tournamentTickets: action.res };
    case types.CREATE_USER_TICKET_SUCCESS:
      return { ...state, createUserTicketResponse: action.res };
    case types.CREATE_BULK_COUPON_SUCCESS:
      return { ...state, createBulkCouponResponse: action.res };
    case types.GET_USER_PRIME_HISTORY:
      return { ...state, primeTicketHistory: action.res };
    default:
      return state;
  }
}
