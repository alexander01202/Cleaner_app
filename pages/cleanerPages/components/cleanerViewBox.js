import React from 'react';
import { View,StyleSheet,Text,Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { colors } from '../../../colors/colors';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import call from 'react-native-phone-call'
import { useEffect } from 'react';
import TimerModal from './TimerModal';
import { useSelector,useDispatch } from 'react-redux';
import ChatModal from '../../UserChats/ChatModal';

export default function CleanerViewBox({ route,navigation,login,customerOrderState }) {
  const dispatch = useDispatch()
    const [customerInfo, setCustomerInfo] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [modalVisible,setModalVisible] = useState(false)
    const [showChatModal,setShowChatModal] = useState(false)
    const {orderId,customerId,customerName,number,ssa,msa,lsa,elsa,amount,address} = route.params
    const { id,displayName } = login
    // useEffect(async() => {
    //     const customerInfo = await fetch(`http://192.168.100.12:19002/getCustomerInfo?customerid=${customerId}`)
    //     const { response,success } = await customerInfo.json()
    //     if (success) {
    //         setCustomerInfo(response)
    //         console.log(response,'response')   
    //     }
    // }, [])
    

    const getContactPermission = async() => {
      const args = {
          number: `+${number}`, // String value with the number to call
          prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }
         
      call(args).catch(console.error)
    }
    var res;
    var response;
    const declineOrder = async() => {
        setIsPending(true)
        
        res = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=declined&id=${orderId}&cleanerId=${id}`)
        response = await res.json()
        if (response.success) {
            dispatch({ type:'CLEANER_ORDER',payload:{ orderId:null,active:false,address:null,number:null } })
            setIsPending(false)
            navigation.navigate('UserDashboard')
        }
    }
    const startOrder = async() => {
      setIsPending(true)
      res = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=started&id=${orderId}&cleanerId=${id}`)
      response = await res.json()
      setIsPending(false)
      navigation.navigate('TimerPage',{amount,orderId,id})
    }
    const changeModal = (val) => {
      setModalVisible(val)
    }
    const changeChatModal = () => {
      setShowChatModal(!showChatModal)
  }
  return (
        <View style={styles.view}>
            {!customerName ? <ActivityIndicator size={'large'} color={colors.yellow} /> : 
            <>
            <ChatModal customerId={customerId} CleanerChat={true} agentId={id} changeChatModal={changeChatModal} companyName={customerName} showChatModal={showChatModal} />
          <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'center' }}>
            <View style={{ alignItems:'center',justifyContent:'center' }}>
                <Text numberOfLines={1} style={{...styles.text,fontSize:18,left: 20}}>{customerName}</Text>
            </View>
          </View>
          <View style={{ flex:1, flexDirection:'row',paddingTop:10,justifyContent:'center',alignItems:'center' }}>
          <TouchableWithoutFeedback onPress={() => setShowChatModal(true)}>
                <View style={{ flex:1,flexDirection:'row',alignItems:'center', justifyContent:'center',width:'50%',height:'50%' }}>
                    <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                    <Text style={{...styles.text,left:5}}>Chat With Customer</Text>
                </View>
          </TouchableWithoutFeedback>
          {/* PhoneNumber comp */}
          <TouchableWithoutFeedback onPress={getContactPermission}>
            <View style={{ flex:1,marginLeft:30 ,justifyContent:'center',width:'50%',height:'50%'}}>
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <View style={{ backgroundColor:colors.white,borderRadius:50,width:20,height:20,justifyContent:'center',alignItems:'center' }}>
                        <FontAwesome style={{ color:colors.green }} name="phone" size={15} color="black" />
                    </View>
                    <Text style={{...styles.text,left:10}}>Call Customer</Text>
                </View>
            </View> 
            </TouchableWithoutFeedback>
            </View>

            {/* Customer Address  */}
          <View style={{ flex:1, justifyContent:'center',width:'100%',marginBottom:5 }}>
            <Text style={{...styles.text,fontSize:12,color:colors.yellow}}>Address</Text>
            <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontFamily:'viga',color:colors.white}}>{address}</Text>   
            </View>
          </View>

            {/* Customer Address  */}
          <View style={{ flex:1, justifyContent:'center',width:'100%' }}>
            <Text style={{...styles.text,fontSize:12,color:colors.yellow}}>Rooms to be cleaned</Text>
            <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontFamily:'viga',color:colors.white}}>SSA: {ssa}  MSA: {msa}  LSA: {lsa}  ELSA: {elsa}</Text>   
            </View>
          </View>

        {customerOrderState === 'accepted' && 
          <TouchableWithoutFeedback onPress={() => declineOrder()}>
              <View style={styles.button}>
                {isPending ? <ActivityIndicator color={colors.yellow} size={'large'}/> : <Text style={{...styles.text,color:colors.black}}>Decline Order</Text>} 
              </View>
          </TouchableWithoutFeedback>
          }
          {customerOrderState === 'arrived' &&
            <>
            <TouchableWithoutFeedback onPress={() => startOrder()}>
              <View style={styles.button}>
                {isPending ? <ActivityIndicator color={colors.yellow} size={'large'}/> : <Text style={{...styles.text,color:colors.black}}>Start Cleaning</Text>} 
              </View>
            </TouchableWithoutFeedback>
            </>
          }
          </>
          }
      </View>
  );
}
const styles = StyleSheet.create({
    view: {
        height:'100%',
        padding:30,
        zIndex:1
    },
    text:{
        fontFamily:'viga',
        color:colors.white,
    },
    button: {
        backgroundColor: '#fff',
        height: 50,
        bottom:-15,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
});
