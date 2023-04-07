import Axios from 'axios';
import {
  INT_API_URL,
  GET_ML_BASED_CONFIG_SUCCESS,
  SET_ML_BASED_CONFIG_SUCCESS
} from '../shared/actionTypes';

export const getMlBasedConfig = () => {
  return async dispatch => {
    const result = await Axios.get(
      INT_API_URL + 'api/ml-based-config/get-config'
    );
    dispatch(getMlBasedConfigSuccess(result.data.payload));
  };
};

export const getMlBasedConfigSuccess = res => ({
  type: GET_ML_BASED_CONFIG_SUCCESS,
  res
});

export const setMlBasedConfig = data => {
  return async dispatch => {
    const result = await Axios.post(
      INT_API_URL + 'api/ml-based-config/set-config',
      data
    );
    dispatch(setMlBasedConfigSuccess(result.data.payload));
  };
};

export const setMlBasedConfigSuccess = res => ({
  type: SET_ML_BASED_CONFIG_SUCCESS,
  res
});
