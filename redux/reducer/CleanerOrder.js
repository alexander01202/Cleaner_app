import * as actions from '../actions/actions';

export default function CleanerOrderReducer(state = {active:false,orderId:null,address:null,number:null},action) {
    switch (action.type) {
      case 'CUSTOMER_ORDER':
        return {
          ...state,
          orderId:action.payload.orderId,
          active:action.payload.active,
          number:action.payload.number,
          address:action.payload.address,
        }    
      case 'START_ORDER':
        return {
          ...state,
          time: action.payload.time
        }  
      default:
        return state;
  }
}
