export const LOGIN = "LOGIN"
export const AUTH_IS_READY = "AUTH_IS_READY"
export const SIGNUP = "SIGNUP"
export const PHONEAUTH = "PHONEAUTH"
export const UPDATE_LOCATION = "UPDATE_LOCATION"
export const UPDATE_ADDRESS = "UPDATE_ADDRESS"
export const UPDATE_LGA = "UPDATE_LGA"
export const UPDATE_BANK_INFO = "UPDATE_BANK_INFO"
export const UPDATE_STATUS = "UPDATE_STATUS"

export const MOBILE_AUTH = (result) => {
  return {
    type: PHONEAUTH,
    payload: {
      Number: result.user.phoneNumber,
    }
  }
}
export const LOCATION = (lat,lng) => {
  return {
    type: UPDATE_LOCATION,
    payload:{
      latitude: lat,
      longitude: lng
    }
  }
}
export const LGA = ({ lga }) => {
  return {
    type:UPDATE_LGA,
    payload:{
      lga
    }
  }
}
export const ADDRESS = ({state,country,city,estate,lga,street_number,street_name}) => {
  return {
    type: UPDATE_ADDRESS,
    payload:{
      state,
      country,
      city,
      estate,
      lga,
      street_number,
      street_name
    }
  }
}

export const BANK_INFO = ({bank_name,account_name,account_number}) => {
  return {
    type: UPDATE_BANK_INFO,
    payload:{
      bank_name,
      account_name,
      account_number
    }
  }
}
export const LoginUser = ({ status,email,firstname,id,role,number,banned,lastname,rating,level,bank_name,account_name,account_number,cleaner_id }) => {
  return {
      type: LOGIN,
      payload: {
        email,
        displayName: firstname,
        id,
        cleaner_id,
        role,
        number,
        banned,
        rating,
        level,
        lastName:lastname,
        bank_name,
        account_name,
        account_number,
        status
      }
  }
}
export const SignupUser = ({ email,firstname,id,number,lastname }) => {
    return {
        type: SIGNUP,
        payload: {
          id,
          email,
          displayName: firstname,
          role:'customer',
          banned:false,
          number,
          lastName:lastname
        }
    }
}