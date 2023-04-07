import * as types from '../shared/actionTypes';

export default function websiteReducer(state = {}, action) {
  switch (action.type) {
    case types.CREATE_WEBSITE_APK_URL_SUCCESS:
      return { ...state, createWebsiteApkUrlResponse: action.res };
    case types.GET_DOWNLOAD_LINKS_SUCCESS:
      return { ...state, getDownloadLinksResponse: action.res };
    case types.SET_DOWNLOAD_LINKS_SUCCESS:
      return { ...state, setDownloadLinksResponse: action.res };
    case types.PURGE_CDN_SUCCESS:
      return { ...state, purgeCdnResponse: action.res };
    case types.REASSIGN_APK_SUCCESS:
      return { ...state, reassignApkResponse: action.res };
    case types.RELOAD_SERVER_SUCCESS:
      return { ...state, reloadServerResponse: action.res };
    case types.GET_CDN_PATH_FOR_UPLOAD_SUCCESS:
      return { ...state, getCdnPathForUploadResponse: action.res };
    case types.GET_WEBSITE_PAGES_SUCCESS:
      return { ...state, getWebsitePagesResponse: action.res };
    case types.GET_WEBSITE_LANGS_SUCCESS:
      return { ...state, getWebsiteLangsResponse: action.res };
    case types.GET_WEBSITE_PAGE_JSON_SUCCESS:
      return { ...state, getWebsitePageJsonResponse: action.res };
    case types.POST_WEBSITE_PAGE_JSON_SUCCESS:
      return { ...state, postWebsitePageJsonResponse: action.res };
    case types.GET_WEBSITE_STATIC_UIMGURL_SUCCESS:
      return { ...state, imgUploadUrlResponse: action.res };
    case types.GET_WEBSITE_PAGES_AND_LANGS_SUCCESS:
      return { ...state, getWebsitePagesAndLangsResponse: action.res };
    case types.GET_WEBSITE_PAGE_HISTORY_SUCCESS:
      return { ...state, getWebsitePageHistoryResponse: action.res };
    case types.SET_WEBSITE_PAGE_LATEST:
      return { ...state, setWebsitePageLatestResponse: action.res };
    case types.GLOBAL_COMPONENT_UPDATE_SUCCESS:
      return { ...state, globalComponentUpdateResponse: action.res };
    case types.GET_CMS_CONFIG_SUCCESS:
      return { ...state, getCMSConfigResponse: action.res };
    case types.SET_CMS_CONFIG_SUCCESS:
      return { ...state, setCMSConfigResponse: action.res };
    default:
      return state;
  }
}
