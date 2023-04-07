import * as types from '../shared/actionTypes';

export default function announcementReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_ANNOUNCEMENT_CONFIG_SUCCESS:
      return { ...state, getAnnouncementConfigResponse: action.res };
    case types.SET_POPUP_ANNOUNCEMENT_CONFIG_SUCCESS:
      return { ...state, setPopupAnnouncementConfigResponse: action.res };
    case types.SET_NEW_DEPOSITOR_ANNOUNCEMENT_CONFIG_SUCCESS:
      return {
        ...state,
        setNewDepositorAnnouncementConfigResponse: action.res
      };
    default:
      return state;
  }
}
