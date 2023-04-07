import * as actionType from '../shared/actionTypes';

export default function userReducer(state = {}, action) {
  switch (action.type) {
    case actionType.ADD_ADMIN_SUCCESS:
      return {
        ...state
      };
    case actionType.ADD_USER_SUCCESS:
      return { ...state };

    case actionType.LIST_USERS_SUCCESS:
      return { ...state, list: action.list };
    case actionType.EDIT_USER:
      return { ...state, editUser: action.user };
    case actionType.UPDATE_USER_SUCCESS:
      return { ...state };
    case actionType.DEACTIVATE_USER_SUCCESS:
      return { ...state };
    case actionType.GET_USER_SUCCESS:
      return { ...state, getUserResponse: action.res };
    case actionType.GET_EXTERNAL_USER_LIST_SUCCESS:
      return { ...state, getExternalUserListResponse: action.res };
    case actionType.DELETE_EXTERNAL_USER_SUCCESS:
      return { ...state, deleteExternalUserResponse: action.res };
    case actionType.UPDATE_EXTERNAL_USER_SUCCESS:
      return { ...state, updateExternalUserResponse: action.res };
    case actionType.CREATE_EXTERNAL_USER_SUCCESS:
      return { ...state, createExternalUserResponse: action.res };
    case actionType.UPDATE_EXTERNAL_USER_PWD_SUCCESS:
      return { ...state, updateExternalUserPwdResponse: action.res };
    default:
      return state;
  }
}
