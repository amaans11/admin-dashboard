import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function bannersReducer(state = initialState.banners, action) {
  switch (action.type) {
    case actionTypes.BANNER_CREATE_SUCCESS:
      return state;
    case actionTypes.BANNER_LIST_SUCCESS:
      return {
        ...state,
        list: action.res.banners ? action.res.banners : [],
        count: action.res.count
      };

    case actionTypes.BANNER_CHANGE_STATE_SUCCESS:
      if (state.list !== undefined) {
        let list = state.list.map(item => {
          if (item.id === action.id) {
            return { ...item, active: !item.active };
          }
          return item;
        });

        return {
          ...state,
          list: list
        };
      } else {
        return state;
      }
    case actionTypes.BANNER_LIST_ACTION:
      return {
        ...state,
        bannerData: { record: action.record, actionType: action.actionType }
      };
    case actionTypes.GET_BANNER_ASSET_URL_SUCCESS:
      return { ...state, assetUrl: action.res };
    case actionTypes.PREVIEW_BANNERS_SUCCESS:
      return { ...state, previewBanners: action.res };
    case actionTypes.GET_WHEEL_ASSET_URL_SUCCESS:
      return { ...state, wheelAssetUrl: action.res };
    case actionTypes.DELETE_BANNER_SUCCESS:
      return { ...state, deleteBannerResponse: action.res };
    case actionTypes.UPDATE_INDICES_SUCCESS:
      return { ...state, updateBannerIndicesResponse: action.res };
    case actionTypes.REFRESH_BANNER_CACHE_SUCCESS:
      return { ...state, refreshBannerCacheResponse: action.res };
    case actionTypes.GET_BANNER_ORDER_SUCCESS:
      return { ...state, getBannerOrderResponse: action.res };
    case actionTypes.UPDATE_BANNER_ORDER_SUCCESS:
      return { ...state, updateBannerOrderResponse: action.res };
    default:
      return state;
  }
}
