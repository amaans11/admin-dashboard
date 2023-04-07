import {
  CREATE_GROUP_SUCCESS,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_BY_GAME_SUCCESS,
  GET_CONFIGS_BY_GROUP_SUCCESS,
  UPDATE_GROUP_ORDER_SUCCESS
} from '../shared/actionTypes';
import initialState from './initialState';
export default function groupReducer(state = initialState.groups, action) {
  let groupsList = state.groupsList;

  switch (action.type) {
    case CREATE_GROUP_SUCCESS:
      return state;
    case GET_GROUPS_SUCCESS:
      return Object.assign({}, state, {
        allGroups: action.groups.payload.groups
      });

    case GET_GROUPS_BY_GAME_SUCCESS:
      return {
        ...state,
        groupsList: {
          ...groupsList,
          [action.gameId]: {
            allGroups: action.groups.payload.groups
              ? action.groups.payload.groups
              : []
          }
        }
      };
    case GET_CONFIGS_BY_GROUP_SUCCESS:
      // let groupsByGame = groupsList[action.gameId];
      let groupData = {
        ...groupsList[action.gameId],
        configList: {
          [action.groupId]: action.configs.payload.tournaments
        }
      };

      // let tournamentConfigList = groupConfigs[action.groupId];
      return {
        ...state,
        groupsList: {
          ...groupsList,
          [action.gameId]: groupData
        }
      };
    case UPDATE_GROUP_ORDER_SUCCESS:
      return state;
    default:
      return state;
  }
}
