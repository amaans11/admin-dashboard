import * as types from '../shared/actionTypes';

export default function collectiblesReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_COLLECTIBLES_REDEMPTION:
      return { ...state, collectiblesRedmption: action.res };
    case types.GET_COLLECTIBLES_CARD_RESPONSE:
      return { ...state, collectibleCards: action.res };
    case types.UPDATE_COLLECTIBLE_REDEMPTION:
      return { ...state, updateCollectibleResponse: action.res };
    case types.GET_USER_COLLECTIBLE_CARDS:
      return { ...state, userCollectibleCard: action.res };
    case types.GET_USER_COLLECTIBLE_TASK_RESPONSE:
      return { ...state, userCollectibleTasks: action.res };
    case types.GET_USER_COLLECTIBLE_TRANSACTION_RESPONSE:
      return { ...state, userCollectibleTransactions: action.res };
    case types.CREDIT_USER_CARD_RESPONSE:
      return { ...state, creditCollectibleResponse: action.res };
    default:
      return state;
  }
}
