import * as actionTypes from '../shared/actionTypes';
import initialState from './initialState';

export default function HourlyQuizReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_HOURLY_QUIZ_URL_SUCCESS:
      return { ...state, hourlyQuiz: action.res };
    case actionTypes.CREATE_HOURLY_QUIZ_SUCCESS:
      return { ...state };
    case actionTypes.GET_HOURLY_QUIZ_SUCCESS:
      return { ...state, hourlyQuizList: action.res };
    case actionTypes.CLONE_QUIZ:
      return {
        ...state,
        quizData: action.data.quizData,
        editType: action.data.editType
      };
    case actionTypes.UPDATE_HOURLY_QUIZ_SUCCESS:
      return { state };
    default:
      return state;
  }
}
