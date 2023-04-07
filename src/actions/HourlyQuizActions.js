/* eslint-disable semi */
import axios from 'axios';
import {
  INT_API_URL,
  CREATE_HOURLY_QUIZ_SUCCESS,
  GET_HOURLY_QUIZ_SUCCESS,
  CLONE_QUIZ,
  UPDATE_HOURLY_QUIZ_SUCCESS
} from '../shared/actionTypes';

export function getHourlyQuiz(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/hourly-quiz/', { params: data })
      .then(result => {
        dispatch(getHourlyQuizSuccess(result.data.payload));
      });
  };
}

export const getHourlyQuizSuccess = res => ({
  type: GET_HOURLY_QUIZ_SUCCESS,
  res
});

export function createHourlyQuiz(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/hourly-quiz/create', data)
      .then(result => {
        dispatch(createHourlyQuizSuccess(result.data.payload));
      });
  };
}
export const createHourlyQuizSuccess = res => ({
  type: CREATE_HOURLY_QUIZ_SUCCESS,
  res
});

export const cloneDetails = (quizData, editType) => ({
  type: CLONE_QUIZ,
  data: {
    quizData: quizData,
    editType: editType
  }
});

export function updateHourlyQuiz(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/hourly-quiz/update', data)
      .then(result => {
        dispatch(updateHourlyQuizSuccess(result.data.payload));
      });
  };
}
export const updateHourlyQuizSuccess = res => ({
  type: UPDATE_HOURLY_QUIZ_SUCCESS,
  res
});
