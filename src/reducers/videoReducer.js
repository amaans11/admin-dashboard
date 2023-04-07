import * as types from '../shared/actionTypes';

export default function videoReducer(state = {}, action) {
  switch (action.type) {
    case types.ADD_FEATURED_VIDEO_SUCCESS:
      return state;
    case types.GET_VIDEO_THUMBNAIL_ASSET_URL_SUCCESS:
      return { ...state, thumbnailUrl: action.res };
    case types.GET_VIDEO_PROLIE_PIC_ASSET_URL_SUCCESS:
      return { ...state, profilePicUrl: action.res };
    case types.GET_VIDEO_LEADERBOARD_SUCCESS:
      return { ...state, lb: action.res };
    // case types.GET_VIDEO_TRENDING_LEADERBOARD_SUCCESS:
    //   return { ...state, lb: action.res };
    case types.GET_FEATURED_BOARD_SUCCESS:
      return { ...state, featuredBoard: action.res };

    case types.ADD_FEATURED_VIDEO:
      return { ...state, video: action.video, actionType: action.videoAction };

    case types.ADD_GAMEPLAY_TO_FEATUREDBOARD_SUCCESS:
      return { ...state };
    case types.VIDEO_STATUS_CHANGE_SUCCESS:
      return { ...state };
    case types.GET_VIDEO_LEADERBOARD_BY_GAME_SUCCESS:
      return { ...state, boardByGame: action.res };
    default:
      return state;
  }
}
