import {
  GET_ML_BASED_CONFIG_SUCCESS,
  SET_ML_BASED_CONFIG_SUCCESS
} from '../shared/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ML_BASED_CONFIG_SUCCESS:
      return { ...state, getMlBasedConfigResponse: action.res };
    case SET_ML_BASED_CONFIG_SUCCESS:
      return { ...state, setMlBasedConfigResponse: action.res };
    default:
      return state;
  }
};
