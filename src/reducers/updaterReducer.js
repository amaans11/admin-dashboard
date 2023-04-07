import * as types from '../shared/actionTypes';
import initialState from './initialState';
export default function updaterReducer(state = initialState.updater, action) {
  switch (action.type) {
    case types.CREATE_UPDATER_CONFIG_SUCCESS:
      return { ...state, config: action.config, step: 1 };
    case types.CREATE_ASSET_URL_SUCCESS:
      return { ...state, uploads: action.config };
    case types.UPLOAD_ACCESS:
      return { ...state, step: 2 };
    case types.CHANGE_UPDATER_STATE_SUCCESS:
      if (state.list !== undefined) {
        let list = state.list.map(item => {
          if (item.id === action.config.id) {
            return { ...item, ...action.config };
          }
          if (item.state === 'DEPLOYED' && item.id !== action.config.id) {
            return { ...item, state: 'DEPRECATED' };
          }
          return item;
        });

        return {
          ...state,
          config: action.config,
          list: list,
          step: 0
        };
      } else {
        return { ...state, config: action.config, step: 0 };
      }
    case types.LIST_UPDATES:
      return {
        ...state,
        list: action.list.updates,
        totalCount: action.list.count
      };
    case types.HALT_DEPLOY_SUCCESS:
      return { ...state };
    case types.UPDATE_ROLL_OUT_PERCENTAGE_SUCCESS:
      return { ...state };
    case types.UPDATER_CACHE_CLEARED:
      return { ...state };
    case types.UPDATE_UPDATER_STATE_SUCCESS:
      return { ...state, updateUpdaterStateResponse: action.data.response };
    default:
      return state;
  }
}
