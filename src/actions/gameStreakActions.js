/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  CREATE_UPDATE_STREAK_CHALLENGE,
  EDIT_STREAK_CHALLENGE,
  CLEAR_STREAK_CHALLENGE_FORM,
  GET_ALL_STREAK_CHALLENGES,
  GET_STREAK_SEGMENTS,
  GET_STREAK_SUPPORTED_COUNTRIES
} from '../shared/actionTypes';

export function createOrUpdateStreakChallenge(data) {
  return dispatch => {
    return axios
      .post(
        INT_API_URL + 'api/usergame-stats/create-update-streak-challenge',
        data
      )
      .then(result => {
        dispatch(createOrUpdateStreakChallengeSuccess(result.data.payload));
      });
  };
}
export const createOrUpdateStreakChallengeSuccess = res => ({
  type: CREATE_UPDATE_STREAK_CHALLENGE,
  res
});

export const clearStreakChallengeForm = () => ({
  type: CLEAR_STREAK_CHALLENGE_FORM
});

export const editStreakChallenge = streakChallengeDetails => ({
  type: EDIT_STREAK_CHALLENGE,
  data: {
    streakChallengeDetails: streakChallengeDetails,
    editType: 'EDIT'
  }
});

export function getAllStreakChallenges(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/usergame-stats/get-all-streak-challenges', {
        params: data
      })
      .then(result => {
        dispatch(getAllStreakChallengesSuccess(result.data.payload));
      });
  };
}
export const getAllStreakChallengesSuccess = res => ({
  type: GET_ALL_STREAK_CHALLENGES,
  res
});

export function getStreakSegments(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/usergame-stats/get-streak-segments', {
        params: data
      })
      .then(result => {
        dispatch(getStreakSegmentsSuccess(result.data.payload));
      });
  };
}
export const getStreakSegmentsSuccess = res => ({
  type: GET_STREAK_SEGMENTS,
  res
});

export function getStreakSupportedCountries(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/usergame-stats/get-streak-supported-countries', {
        params: data
      })
      .then(result => {
        dispatch(getStreakSupportedCountriesSuccess(result.data.payload));
      });
  };
}
export const getStreakSupportedCountriesSuccess = res => ({
  type: GET_STREAK_SUPPORTED_COUNTRIES,
  res
});
