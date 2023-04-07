import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function sponsorReducer(state = initialState.sponsor, action) {
  switch (action.type) {
    case types.CREATE_SPONSOR_SUCCESS:
      return { ...state };
    case types.GET_SPONSOR_LIST_SUCCESS:
      return {
        ...state,
        list: action.res.sponsors.length ? action.res.sponsors : []
      };
    case types.UPDATE_SPONSOR_SUCCESS:
      return { ...state };
    case types.GET_SPONSOR_ASSET_URL_SUCCESS:
      return { ...state, assetUrl: action.res };
    default:
      return state;
  }
}
