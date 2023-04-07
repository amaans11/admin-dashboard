import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function SupportPaymentReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_PAYMENT_HISTORY_SUCCESS:
      return { ...state, paymentHistory: action.res };
    case actionTypes.GET_TRANSACTION_SUCCESS:
      return { ...state, transactionDetail: action.res };

    case actionTypes.GET_PENDING_WITHDRAWAL_SUCCESS:
      return { ...state, pendingWithdrawalList: action.res };
    case actionTypes.SEARCH_WITHDRAWAL_RESPONSE:
      return { ...state, searchResponse: action.res };
    case actionTypes.GET_TRANSACTION_DETAILS_SUCCESS:
      return { ...state, transactionbyReference: action.res };
    case actionTypes.CRM_PAYMENT_DETAILS_SUCCESS:
      return { ...state, paymentDetails: action.res };
    case actionTypes.CRM_PAYMENT_LIST_SUCCESS: {
      return { ...state, paymentList: action.res };
    }
    case actionTypes.REFUND_WITHDRAW_AMOUNT_SUCCESS:
      return { ...state, refundWithdraw: action.res };
    case actionTypes.PUSH_GOOGLE_SHEET_SUCCESS:
      return { ...state, withdrawalSheet: action.res };
    case actionTypes.GET_CASHBACK_DETAILS:
      return { ...state, cashbackDetails: action.res };
    case actionTypes.SEND_EMAIL_SUCCESS:
      return { ...state, sendEmailResponse: action.res };
    case actionTypes.GET_USER_WINNINGS_SUCCESS:
      return { ...state, getUserWinningsResponse: action.res };
    case actionTypes.GET_NON_REFUNDED_REFERENCE_IDS_SUCCESS:
      return { ...state, nonRefundedRefIds: action.res };
    case actionTypes.GET_PENDING_WITHDRAWAL_LIST_SUCCESS:
      return { ...state, pendingWithdrawalList: action.res };
    case actionTypes.PROCESS_PENDING_DEPOSIT:
      return { ...state, pendingDepositRes: action.res };
    case actionTypes.UPDATE_WITHDRAWAL_REQUEST:
      return { ...state, updateRequestRes: action.res };
    case actionTypes.GET_WITHDRAWAL_REJECTION_REASONS:
      return { ...state, rejectionReasonRes: action.res };
    case actionTypes.GET_FRAUD_USER_LIST:
      return { ...state, fraudUserRes: action.res };
    case actionTypes.UPDATE_USER_FRAUD_STATUS:
      return { ...state, updateUserStatusRes: action.res };
    case actionTypes.CREDIT_PENDING_DEPOSIT:
      return { ...state, creditDepositRes: action.res };
    case actionTypes.PROCESS_PENDING_WIHDRAWAL:
      return { ...state, processWithdrawalRes: action.res };
    default:
      return state;
  }
}
