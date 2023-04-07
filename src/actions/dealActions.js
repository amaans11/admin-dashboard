/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  CREATE_PRODUCT_SUCCESS,
  CLONE_EDIT_PRODUCT,
  GET_ALL_PRODUCTS_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
  GET_ALL_DEALS_TIER_SUCCESS,
  GET_ALL_DEAL_TYPE_SUCCESS,
  CREATE_DEAL_SUCCESS,
  GET_ALL_DEALS_SUCCESS,
  CLONE_EDIT_DEAL,
  UPDATE_DEAL_SUCCESS,
  DELETE_DEAL_SUCCESS,
  CLEAR_DEAL_FORM,
  CLEAR_PRODUCT_FORM,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_BY_STATUS_SUCCESS,
  GET_ALL_ORDERS_BY_PHONE_SUCCESS,
  UPDATE_ORDER_STATUS_SUCCESS,
  CREATE_VOUCHER_SUCCESS,
  GET_ALL_VOUCHERS_SUCCESS,
  CLONE_EDIT_VOUCHER,
  UPDATE_VOUCHER_SUCCESS,
  GET_EXTRA_DETAIL_FOR_AUCTION_SUCCESS,
  CREATE_AUCTION_SUCCESS,
  GET_ALL_AUCTIONS_SUCCESS,
  CLONE_EDIT_AUCTION,
  UPDATE_AUCTION_SUCCESS,
  CLEAR_AUCTION_FORM,
  GET_WITHDRAWABLE_VOUCHER_LIST_SUCCESS,
  CREATE_WITHDRAWABLE_VOUCHER_SUCCESS,
  UPDATE_WITHDRAWABLE_VOUCHER_SUCCESS,
  CLONE_EDIT_WITHDRAWABLE_VOUCHER,
  CLEAR_WITHDRAWABLE_VOUCHER_FORM
} from '../shared/actionTypes';

export function createProduct(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/create-product', data)
      .then(result => {
        dispatch(createProductSuccess(result.data.payload));
      });
  };
}
export const createProductSuccess = res => ({
  type: CREATE_PRODUCT_SUCCESS,
  res
});

export const cloneEditProduct = (productDetails, editType) => ({
  type: CLONE_EDIT_PRODUCT,
  data: {
    productDetails: productDetails,
    editType: editType
  }
});

export function getAllProducts(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-product-list', { params: data })
      .then(result => {
        dispatch(getAllProductsSuccess(result.data.payload));
      });
  };
}
export const getAllProductsSuccess = res => ({
  type: GET_ALL_PRODUCTS_SUCCESS,
  res
});

export function updateProduct(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/update-product', data)
      .then(result => {
        dispatch(updateProductSuccess(result.data.payload));
      });
  };
}
export const updateProductSuccess = res => ({
  type: UPDATE_PRODUCT_SUCCESS,
  res
});

export function deleteProduct(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/delete-product', data)
      .then(result => {
        dispatch(deleteProductSuccess(result.data.payload));
      });
  };
}
export const deleteProductSuccess = res => ({
  type: DELETE_PRODUCT_SUCCESS,
  res
});

export function getAllTiers() {
  return dispatch => {
    return axios.get(INT_API_URL + 'api/deals/get-all-tiers').then(result => {
      dispatch(getAllTiersSuccess(result.data.payload));
    });
  };
}
export const getAllTiersSuccess = res => ({
  type: GET_ALL_DEALS_TIER_SUCCESS,
  res
});

export function getAllDealTypes() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-all-deal-types')
      .then(result => {
        dispatch(getAllDealTypesSuccess(result.data.payload));
      });
  };
}
export const getAllDealTypesSuccess = res => ({
  type: GET_ALL_DEAL_TYPE_SUCCESS,
  res
});

export function createDeal(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/create-deal', data)
      .then(result => {
        dispatch(createDealSuccess(result.data.payload));
      });
  };
}
export const createDealSuccess = res => ({
  type: CREATE_DEAL_SUCCESS,
  res
});

export function getAllDeals(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-deal-list', { params: data })
      .then(result => {
        dispatch(getAllDealsSuccess(result.data.payload));
      });
  };
}
export const getAllDealsSuccess = res => ({
  type: GET_ALL_DEALS_SUCCESS,
  res
});

export const cloneEditDeal = (dealDetails, editType) => ({
  type: CLONE_EDIT_DEAL,
  data: {
    dealDetails: dealDetails,
    editType: editType
  }
});

export function updateDeal(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/update-deal', data)
      .then(result => {
        dispatch(updateDealSuccess(result.data.payload));
      });
  };
}
export const updateDealSuccess = res => ({
  type: UPDATE_DEAL_SUCCESS,
  res
});

export function deleteDeal(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/delete-deal', data)
      .then(result => {
        dispatch(deleteDealSuccess(result.data.payload));
      });
  };
}
export const deleteDealSuccess = res => ({
  type: DELETE_DEAL_SUCCESS,
  res
});

export const clearDealForm = () => ({
  type: CLEAR_DEAL_FORM
});

export const clearProductForm = () => ({
  type: CLEAR_PRODUCT_FORM
});
//
export function getAllOrders(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-all-orders', { params: data })
      .then(result => {
        dispatch(getAllOrdersSuccess(result.data.payload));
      });
  };
}
export const getAllOrdersSuccess = res => ({
  type: GET_ALL_ORDERS_SUCCESS,
  res
});

export function updateOrderStatus(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/update-order-status', data)
      .then(result => {
        dispatch(updateOrderStatusSuccess(result.data.payload));
      });
  };
}
export const updateOrderStatusSuccess = res => ({
  type: UPDATE_ORDER_STATUS_SUCCESS,
  res
});

// Vouchers
export function createVoucher(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/create-voucher', data)
      .then(result => {
        dispatch(createVoucherSuccess(result.data.payload));
      });
  };
}
export const createVoucherSuccess = res => ({
  type: CREATE_VOUCHER_SUCCESS,
  res
});

export function getAllVouchers(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-voucher-list', { params: data })
      .then(result => {
        dispatch(getAllVouchersSuccess(result.data.payload));
      });
  };
}
export const getAllVouchersSuccess = res => ({
  type: GET_ALL_VOUCHERS_SUCCESS,
  res
});

export const cloneEditVoucher = (voucherDetails, editType) => ({
  type: CLONE_EDIT_VOUCHER,
  data: {
    voucherDetails: voucherDetails,
    editType: editType
  }
});

export function updateVoucher(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/update-voucher', data)
      .then(result => {
        dispatch(updateVoucherSuccess(result.data.payload));
      });
  };
}
export const updateVoucherSuccess = res => ({
  type: UPDATE_VOUCHER_SUCCESS,
  res
});

export function getExtraDetailForAuction() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-extra-detail-for-auction')
      .then(result => {
        dispatch(getExtraDetailForAuctionSuccess(result.data.payload));
      });
  };
}
export const getExtraDetailForAuctionSuccess = res => ({
  type: GET_EXTRA_DETAIL_FOR_AUCTION_SUCCESS,
  res
});

export function createAuction(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/create-auction', data)
      .then(result => {
        dispatch(createAuctionSuccess(result.data.payload));
      });
  };
}
export const createAuctionSuccess = res => ({
  type: CREATE_AUCTION_SUCCESS,
  res
});

export function getAllAuctions(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-auction-list', { params: data })
      .then(result => {
        dispatch(getAllAuctionsSuccess(result.data.payload));
      });
  };
}
export const getAllAuctionsSuccess = res => ({
  type: GET_ALL_AUCTIONS_SUCCESS,
  res
});

export const cloneEditAuction = (auctionDetails, editType) => ({
  type: CLONE_EDIT_AUCTION,
  data: {
    auctionDetails: auctionDetails,
    editType: editType
  }
});

export function updateAuction(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/update-auction', data)
      .then(result => {
        dispatch(updateAuctionSuccess(result.data.payload));
      });
  };
}
export const updateAuctionSuccess = res => ({
  type: UPDATE_AUCTION_SUCCESS,
  res
});

export const clearAuctionForm = () => ({
  type: CLEAR_AUCTION_FORM
});

export function createWithdrawableVoucher(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/create-withdrawable-voucher', data)
      .then(result => {
        dispatch(createWithdrawableVoucherSuccess(result.data.payload));
      });
  };
}
export const createWithdrawableVoucherSuccess = res => ({
  type: CREATE_WITHDRAWABLE_VOUCHER_SUCCESS,
  res
});

export const cloneEditWithdrawableVoucher = (
  withdrawableVoucherDetails,
  editType
) => ({
  type: CLONE_EDIT_WITHDRAWABLE_VOUCHER,
  data: {
    withdrawableVoucherDetails: withdrawableVoucherDetails,
    editType: editType
  }
});

export function getWithdrawableVoucherList(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/deals/get-withdrawable-voucher-list', {
        params: data
      })
      .then(result => {
        dispatch(getWithdrawableVoucherListSuccess(result.data.payload));
      });
  };
}
export const getWithdrawableVoucherListSuccess = res => ({
  type: GET_WITHDRAWABLE_VOUCHER_LIST_SUCCESS,
  res
});

export function updateWithdrawableVoucher(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/deals/update-withdrawable-voucher', data)
      .then(result => {
        dispatch(updateWithdrawableVoucherSuccess(result.data.payload));
      });
  };
}
export const updateWithdrawableVoucherSuccess = res => ({
  type: UPDATE_WITHDRAWABLE_VOUCHER_SUCCESS,
  res
});

export const clearWithdrawableVoucherForm = () => ({
  type: CLEAR_WITHDRAWABLE_VOUCHER_FORM
});
