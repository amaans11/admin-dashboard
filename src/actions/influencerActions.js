/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  GET_INFLUENCER_CONFIG_SUCCESS,
  SET_INFLUENCER_CONFIG_SUCCESS
} from '../shared/actionTypes';

export function getInfluencerConfig() {
  return dispatch => {
    return axios.get(INT_API_URL + 'api/influencer-config/get').then(result => {
      dispatch(getInfluencerConfigSuccess(result.data.payload));
    });
  };
}

export const getInfluencerConfigSuccess = res => ({
  type: GET_INFLUENCER_CONFIG_SUCCESS,
  res
});

export function setInfluencerConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/influencer-config/update', data)
      .then(result => {
        dispatch(setInfluencerConfigSuccess(result.data.payload));
      });
  };
}
export const setInfluencerConfigSuccess = res => ({
  type: SET_INFLUENCER_CONFIG_SUCCESS,
  res
});

// export function setSearchCustomConfig(data) {
//   return dispatch => {
//     return axios
//       .post(INT_API_URL + 'api/search-config/search-custom-config', data)
//       .then(result => {
//         dispatch(setSearchCustomConfigSuccess(result.data.payload));
//       });
//   };
// }
// export const setSearchCustomConfigSuccess = res => ({
//   type: SET_SEARCH_CUSTOM_CONFIG_SUCCESS,
//   res
// });
