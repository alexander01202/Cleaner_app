import * as actions from '../actions/actions';

export default function LocationReducer(state = {latitudeDelta: 0.0012,longitudeDelta: 0.002},action) {
    switch (action.type) {
      case actions.UPDATE_LOCATION:
        return {
          ...state,
          latitude:action.payload.latitude,
          longitude:action.payload.longitude,
        }
        case actions.UPDATE_ADDRESS:
          return{
            ...state,
            state:action.payload.state,
            country:action.payload.country,
            city:action.payload.city,
            street_name:action.payload.street_name,
            street_number:action.payload.street_number,
            lga:action.payload.lga,
            estate:action.payload.estate,
          }
        case actions.UPDATE_LGA:
          return{
            ...state,
            lga:action.payload.lga
          }
      default:
        return state;
  }
}
