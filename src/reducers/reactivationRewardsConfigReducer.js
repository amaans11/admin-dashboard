import {
  GET_ACTIVATION_REWARDS_CONFIG_SCUCESS,
  UPDATE_ACTIVATION_REWARDS_CONFIG_SCUCESS
} from '../shared/actionTypes';

export default function storyReducer(state = {}, action) {
  switch (action.type) {
    case GET_ACTIVATION_REWARDS_CONFIG_SCUCESS:
      return { ...state, getActivationRewardsConfigResponse: action.res };
    case UPDATE_ACTIVATION_REWARDS_CONFIG_SCUCESS:
      return { ...state, updateActivationRewardsConfigResponse: action.res };
    default:
      return state;
  }
}
