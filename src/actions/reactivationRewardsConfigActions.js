import axios from 'axios';
import {
  GET_ACTIVATION_REWARDS_CONFIG_SCUCESS,
  UPDATE_ACTIVATION_REWARDS_CONFIG_SCUCESS,
  INT_API_URL
} from '../shared/actionTypes';

export const getActivationRewardsConfig = data => {
  return async dispatch => {
    const result = await axios.get(
      INT_API_URL + 'api/reactivation-rewards-config/get-config',
      { params: data }
    );
    dispatch(getActivationRewardsConfigSuccess(result.data.payload));
  };
};

export const getActivationRewardsConfigSuccess = res => ({
  type: GET_ACTIVATION_REWARDS_CONFIG_SCUCESS,
  res
});

export const updateActivationRewardsConfig = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + 'api/reactivation-rewards-config/set-config',
      data
    );
    dispatch(updateActivationRewardsConfigSuccess(result.data.payload));
  };
};

export const updateActivationRewardsConfigSuccess = res => ({
  type: UPDATE_ACTIVATION_REWARDS_CONFIG_SCUCESS,
  res
});
