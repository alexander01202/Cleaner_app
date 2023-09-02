import * as actions from '../actions/actions';

export default function AuthReducer(state = {AuthIsReady:null},action) {
    switch (action.type) {
      case actions.LOGIN:
        return {
          ...state,
          id:action.payload.id,
          email:action.payload.email,
          displayName:action.payload.displayName,
          lastName:action.payload.lastName,
          cleaner_id:action.payload.cleaner_id,
          bank_name:action.payload.bank_name,
          account_name:action.payload.account_name,
          account_number:action.payload.account_number,
          user_img:null,
          AuthIsReady:true,
          role: action.payload.role,
          number:action.payload.number,
          banned:action.payload.banned,
          rating:action.payload.rating,
          level:action.payload.level,
          status:action.payload.status,
          agentId: null,
          AgentCacNumber: null
        }
      case actions.SIGNUP:
        return {
          ...state,
          id:action.payload.id,
          image:null,
          email:action.payload.email,
          displayName:action.payload.displayName,
          lastName:action.payload.lastName,
          AuthIsReady:true,
          role: action.payload.role,
          banned:action.payload.banned,
        }
      case actions.AUTH_IS_READY:
        return {
          ...state,
          AuthIsReady: action.isLogin,
        }
      case 'UPDATE_USER':
        return{
          ...state,
          email:action.payload.email,
          displayName:action.payload.displayName,
          lastName:action.payload.lastname
        }
      case 'UPDATE_BANK_INFO':
        return{
          ...state,
          bank_name:action.payload.bank_name,
          account_name:action.payload.account_name,
          account_number:action.payload.account_number
        }
      case actions.UPDATE_STATUS:
        return{
          ...state,
          status:action.payload.status
        }
      case 'CHANGE_ROLE':
        return{
          ...state,
          role:action.payload.role
        }      
      case 'CHANGE_LEVEL':
        return{
          ...state,
          level:action.payload.level,
          rating:action.payload.rating
        }    
      case 'CHANGE_USER_IMG':
        return{
          ...state,
          user_img:action.payload.user_img
        }  
      case 'REGISTER_AGENT':
        return{
          ...state,
          role:action.payload.role,
          agentId:action.payload.agentId,
          AgentCacNumber:action.payload.AgentCacNumber
        }  
      default:
        return state;
  }
}
