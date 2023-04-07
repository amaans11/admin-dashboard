import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function DealReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_PRODUCT_SUCCESS:
      return { ...state, createProductResponse: action.res };
    case actionTypes.CLONE_EDIT_PRODUCT:
      return {
        ...state,
        productDetails: action.data.productDetails,
        editType: action.data.editType
      };
    case actionTypes.GET_DEAL_UPLOAD_ASSET_URL_SUCCESS:
      return { ...state, dealUploadAssetResponse: action.res };
    case actionTypes.GET_ALL_PRODUCTS_SUCCESS:
      return { ...state, getAllProductsResponse: action.res };
    case actionTypes.UPDATE_PRODUCT_SUCCESS:
      return { ...state, updateProductResponse: action.res };
    case actionTypes.DELETE_PRODUCT_SUCCESS:
      return { ...state, deleteProductResponse: action.res };
    case actionTypes.GET_ALL_DEALS_TIER_SUCCESS:
      return { ...state, getAllDealsTierResponse: action.res };
    case actionTypes.GET_ALL_DEAL_TYPE_SUCCESS:
      return { ...state, getAllDealTypeResponse: action.res };
    case actionTypes.CREATE_DEAL_SUCCESS:
      return { ...state, createDealResponse: action.res };
    case actionTypes.GET_ALL_DEALS_SUCCESS:
      return { ...state, getAllDealsResponse: action.res };
    case actionTypes.CLONE_EDIT_DEAL:
      return {
        ...state,
        dealDetails: action.data.dealDetails,
        dealEditType: action.data.editType
      };
    case actionTypes.UPDATE_DEAL_SUCCESS:
      return { ...state, updateDealResponse: action.res };
    case actionTypes.DELETE_DEAL_SUCCESS:
      return { ...state, deleteDealResponse: action.res };
    case actionTypes.CLEAR_DEAL_FORM:
      return { ...state, dealDetails: null, dealEditType: 'CLONE' };
    case actionTypes.CLEAR_PRODUCT_FORM:
      return { ...state, productDetails: null, dealEditType: 'CLONE' };
    case actionTypes.GET_ALL_ORDERS_SUCCESS:
      return { ...state, getAllOrdersResponse: action.res };
    case actionTypes.UPDATE_ORDER_STATUS_SUCCESS:
      return { ...state, updateOrderStatusResponse: action.res };
    case actionTypes.CREATE_VOUCHER_SUCCESS:
      return { ...state, createVoucherResponse: action.res };
    case actionTypes.GET_ALL_VOUCHERS_SUCCESS:
      return { ...state, getAllVouchersResponse: action.res };
    case actionTypes.CLONE_EDIT_VOUCHER:
      return {
        ...state,
        voucherDetails: action.data.voucherDetails,
        voucherEditType: action.data.editType
      };
    case actionTypes.UPDATE_VOUCHER_SUCCESS:
      return { ...state, updateVoucherResponse: action.res };
    case actionTypes.GET_EXTRA_DETAIL_FOR_AUCTION_SUCCESS:
      return { ...state, getExtraDetailForAuctionResponse: action.res };
    case actionTypes.CREATE_AUCTION_SUCCESS:
      return { ...state, createAuctionResponse: action.res };
    case actionTypes.GET_ALL_AUCTIONS_SUCCESS:
      return { ...state, getAllAuctionsResponse: action.res };
    case actionTypes.CLONE_EDIT_AUCTION:
      return {
        ...state,
        auctionDetails: action.data.auctionDetails,
        auctionEditType: action.data.editType
      };
    case actionTypes.UPDATE_AUCTION_SUCCESS:
      return { ...state, updateAuctionResponse: action.res };
    case actionTypes.CLEAR_AUCTION_FORM:
      return { ...state, auctionDetails: null, auctionEditType: 'CLONE' };
    case actionTypes.CREATE_WITHDRAWABLE_VOUCHER_SUCCESS:
      return { ...state, createWithdrawableVoucherResponse: action.res };
    case actionTypes.GET_WITHDRAWABLE_VOUCHER_LIST_SUCCESS:
      return { ...state, getWithdrawableVoucherListResponse: action.res };
    case actionTypes.UPDATE_WITHDRAWABLE_VOUCHER_SUCCESS:
      return { ...state, updateWithdrawableVoucherResponse: action.res };
    case actionTypes.CLONE_EDIT_WITHDRAWABLE_VOUCHER:
      return {
        ...state,
        withdrawableVoucherDetails: action.data.withdrawableVoucherDetails,
        withdrawableVoucherEditType: action.data.editType
      };
    case actionTypes.CLEAR_WITHDRAWABLE_VOUCHER_FORM:
      return {
        ...state,
        withdrawableVoucherDetails: null,
        withdrawableVoucherEditType: 'CLONE'
      };
    default:
      return state;
  }
}
