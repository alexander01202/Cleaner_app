import React from 'react';
import * as actions from '../actions/actions';

export default function OrderReducer(state = {askHire:null},action) {
    switch (action.type) {
      case 'ORDER_INFO':
        return {
          ...state,
          askHire:action.payload.askHire,
          orderId:action.payload.orderId
        }   
      case 'CHANGE_HIRESTATE':
        return {
          ...state,
          askHire:action.payload.askHire,
        }   
      default:
        return state;
  }
}
