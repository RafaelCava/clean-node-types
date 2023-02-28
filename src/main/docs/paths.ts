import {
  loginPath,
  surveysPath,
  signUpPath,
  signUpResultPath
} from './paths/'

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': signUpResultPath
}
