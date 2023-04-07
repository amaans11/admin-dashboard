import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function internalToolReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_INTERNAL_TOOL_LIST_SUCCESS:
      return { ...state, getInternalToolListResponse: action.res };
    case actionTypes.CREATE_INTERNAL_TOOL_SUCCESS:
      return { ...state, createInternalToolResponse: action.res };
    case actionTypes.EDIT_INTERNAL_TOOL:
      return {
        ...state,
        toolDetails: action.data.toolDetails,
        editType: action.data.editType
      };
    case actionTypes.CLEAR_TOOL_FORM:
      return { ...state, toolDetails: null };
    case actionTypes.UPDATE_INTERNAL_TOOL_SUCCESS:
      return { ...state, updateInternalToolResponse: action.res };
    case actionTypes.RUN_INTERNAL_TOOL_SUCCESS:
      return { ...state, runInternalToolResponse: action.res };
    case actionTypes.DELETE_INTERNAL_TOOL_SUCCESS:
      return { ...state, deleteInternalToolResponse: action.res };
    default:
      return state;
  }
}
