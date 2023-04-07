import * as types from '../shared/actionTypes';

export default function spinWheelReducer(state = {}, action) {
  switch (action.type) {
    case types.SET_SPIN_WHEEL_CONFIG_SUCCESS:
      return { ...state, spinWheelUpdate: action.res };
    case types.GET_SPIN_WHEEL_CONFIG_SUCCESS:
      return { ...state, spinWheelConfig: action.res };
    case types.GET_GOLDEN_SPIN_WHEEL_CONFIG_SUCCESS:
      return { ...state, goldenSpinWheelConfigResponse: action.res };
    case types.SET_GOLDEN_SPIN_WHEEL_CONFIG_SUCCESS:
      return { ...state, setGoldenSpinWheelConfigResponse: action.res };
    case types.GET_MAIN_SPIN_WHEEL_CONFIG_SUCCESS:
      return { ...state, mainSpinWheelConfigResponse: action.res };
    case types.SET_MAIN_SPIN_WHEEL_CONFIG_SUCCESS:
      return { ...state, setMainSpinWheelConfigResponse: action.res };
    default:
      return state;
  }
}
