import * as actiontypes from '../shared/actionTypes';
import { message } from 'antd';
import axios from 'axios';

export function createBanner(bannerData) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/banner/create', bannerData)
      .then(result => {
        if (result.data.status.code !== 200) {
          message.error(result.data.status.message, 3);
        } else {
          dispatch(createBannerSuccess(result.data.payload));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export const createBannerSuccess = res => ({
  type: actiontypes.BANNER_CREATE_SUCCESS,
  res
});

export function updateBanner(bannerData) {
  return dispatch => {
    return axios
      .post(
        actiontypes.INT_API_URL + `api/banner/update/${bannerData.id}`,
        bannerData
      )
      .then(result => {
        if (result.data.status.code !== 200) {
          message.error(result.data.status.message, 3);
        } else {
          dispatch(createBannerSuccess(result.data.payload));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export function listBanners(
  appType,
  location,
  activeOnly,
  start,
  count,
  isAllBanners,
  countryCode,
  gameId
) {
  return dispatch => {
    return axios
      .get(
        actiontypes.INT_API_URL +
          `api/banner/list?appType=${appType}&location=${location}&activeOnly=${activeOnly}&start=${start}&count=${count}&isAllBanners=${isAllBanners}&countryCode=${countryCode}&gameId=${gameId}&tier=`
      )
      .then(result => {
        if (result.data.status.code !== 200) {
          message.error(result.data.status.message, 3);
        } else {
          dispatch(listBannersSuccess(result.data.payload));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export function previewBanners(date, appType, location) {
  return dispatch => {
    return axios
      .get(
        actiontypes.INT_API_URL +
          `api/banner/preview?ts=${date}&appType=${appType}&location=${location}`
      )
      .then(result => {
        if (result.data.status.code !== 200) {
          message.error(result.data.status.message, 3);
        } else {
          dispatch(previewBannersSuccess(result.data.payload));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export const previewBannersSuccess = res => ({
  type: actiontypes.PREVIEW_BANNERS_SUCCESS,
  res
});

export const listBannersSuccess = res => ({
  type: actiontypes.BANNER_LIST_SUCCESS,
  res
});

export function changeStateBanner(id, state) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + `api/banner/change-state/${id}/${state}`)
      .then(result => {
        if (result.data.status.code !== 200) {
          message.error(result.data.status.message, 3);
        } else {
          dispatch(changeStateBannerSuccess(result.data.payload, id));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export const changeStateBannerSuccess = (res, id) => ({
  type: actiontypes.BANNER_CHANGE_STATE_SUCCESS,
  res,
  id
});

export const actionBanner = (record, actionType) => ({
  type: actiontypes.BANNER_LIST_ACTION,
  record,
  actionType
});

export function deleteBanner(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/banner/delete', data)
      .then(result => {
        dispatch(deleteBannerSuccess(result.data.payload));
      });
  };
}
export const deleteBannerSuccess = res => ({
  type: actiontypes.DELETE_BANNER_SUCCESS,
  res
});

export function updateBannerIndices(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/banner/update-indices', data)
      .then(result => {
        dispatch(updateBannerIndicesSuccess(result.data.payload));
      });
  };
}
export const updateBannerIndicesSuccess = res => ({
  type: actiontypes.UPDATE_INDICES_SUCCESS,
  res
});

export function refreshCache() {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/banner/refresh-cache')
      .then(result => {
        dispatch(refreshCacheSuccess(result.data.payload));
      });
  };
}
export const refreshCacheSuccess = res => ({
  type: actiontypes.REFRESH_BANNER_CACHE_SUCCESS,
  res
});

export function getBannerOrder(data) {
  return dispatch => {
    return axios
      .get(actiontypes.INT_API_URL + 'api/banner/get-banner-order', {
        params: data
      })
      .then(result => {
        dispatch(getBannerOrderSuccess(result.data.payload));
      });
  };
}

export const getBannerOrderSuccess = res => ({
  type: actiontypes.GET_BANNER_ORDER_SUCCESS,
  res
});

export function updateBannerOrder(data) {
  return dispatch => {
    return axios
      .post(actiontypes.INT_API_URL + 'api/banner/update-banner-order', data)
      .then(result => {
        dispatch(updateBannerOrderSuccess(result.data.payload));
      });
  };
}

export const updateBannerOrderSuccess = res => ({
  type: actiontypes.UPDATE_BANNER_ORDER_SUCCESS,
  res
});
