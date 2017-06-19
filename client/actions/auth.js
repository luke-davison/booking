import {login, getAllBookings} from '../api'
import {receiveBookings, WAITING, NOT_WAITING} from './index'

const localStorage = global.window.localStorage

export function checkLogin () {
  return dispatch => {
    dispatch(gettingData())
    if (!localStorage.getItem('id_token')) {
      dispatch(noUserExists())
      getAllBookings()
        .then(res => {
          dispatch(receivedData())
          return dispatch(receiveBookings(res.body.bookings))
        })
    } else {
      dispatch(checkingLogin())
      return login('get', '/checklogin')
        .then(res => {
          if (!res.body.user) {
            res.body.error && console.log(res.body.error)
            return dispatch(noUserExists())
          }
          dispatch(loggedIn(res.body.user))
          dispatch(receivedData())
          return dispatch(receiveBookings(res.body.bookings))
        })
    }
  }
}

function checkingLogin () {
  return {
    type: 'CHECKING_LOGIN'
  }
}

export const gettingData = () => {
  return {
    type: WAITING
  }
}

export const receivedData = () => {
  return {
    type: NOT_WAITING
  }
}

function noUserExists (error) {
  return {
    type: 'NO_USER',
    error
  }
}

function loggedIn (user, bookings) {
  return {
    type: 'LOGGED_IN',
    user,
    bookings
  }
}

export function submitRegistration (registrationInfo) {
  return dispatch => {
    dispatch(checkingRegistration())
    login('post', '/user/adduser', registrationInfo)
      .then(res => {
        if (res.body.user) {
          dispatch(loggedIn(res.body.user))
        }
        if (res.body.error) {
          dispatch(registrationFailed(res.body.error))
          return console.log(res.body.error)
        }
      })
  }
}

function checkingRegistration () {
  return {
    type: 'SENDING_REGISTRATION'
  }
}

function registrationFailed (error) {
  return {
    type: 'FAILED_REGISTRATION',
    error
  }
}

export function logout () {
  return dispatch => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    dispatch(loggedOut())
    getAllBookings()
      .then(res => {
        return dispatch(receiveBookings(res.body.bookings))
      })
  }
}

function loggedOut () {
  return {
    type: 'LOGGED_OUT'
  }
}

