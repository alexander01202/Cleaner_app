import React, { useState, useEffect }  from 'react';
import { View,StyleSheet,Text, Button, Pressable,Modal} from 'react-native'
import { useSelector,useDispatch } from 'react-redux';
import { colors } from '../../../colors/colors';

export default function RequestModal({modalVisible,changeModal,customerId,navigation}) {
    const { id } = useSelector(state => state.login)
    const dispatch = useDispatch()
    const {orderId,address,amount,number,customerName,ssa,lsa,msa,elsa,cleaningType} = modalVisible

    const DeclineCustomerRequest = async() => {
        changeModal(!modalVisible.show)
        navigation.pop()
    }
    const AcceptCustomerRequest = async() => {
        const getOrderStaus = await fetch(`http://192.168.100.12:19002/checkOrderExist?orderId=${orderId}`)
        const { rows,success } = await getOrderStaus.json()

        if (success) {
          if (rows.state === 'accepted') {
            navigation.pop()
            return
          } 
        }
        const res = await fetch(`http://192.168.100.12:19002/updateOrderStatus?state=accepted&id=${orderId}&cleanerId=${id}`)
        const response = await res.json()
        const updateInvoice = await fetch(`http://192.168.100.12:19002/updateInvoice?invoice=${amount * 0.1}&cleanerId=${id}`)
        if (response.success) {
          dispatch({ type:'CLEANER_ORDER',payload:{ orderId,active:true,address,number } })
          changeModal(!modalVisible.show)
          navigation.navigate('CleanerMapPreview',{orderId,customerId,customerName,number,ssa,msa,lsa,elsa,cleaningType,amount,address})
        }else{
          navigation.pop()
          return
        }
    }
  return (
    <View style={styles.centeredView}>
    <Modal
    animationType="slide"
    transparent={true}
    style={{ backgroundColor:'grey',alignSelf:'center' }}
    visible={modalVisible.show}
    onRequestClose={() => {
      changeModal(!modalVisible.show);
    }}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{customerName}</Text>
        <View style={{ width:'100%',margin:10 }}>
          <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black,textAlign:'center' }}>Rooms to be Cleaned</Text>
          <View style={{ flexDirection:'row' }}>
            {
              modalVisible.ssa != 0 ? 
              <>
                <Text>Small Sized Area</Text>
                <Text style={{ marginLeft:10 }}>(Number of rooms: {ssa})</Text>
              </>
              : modalVisible.msa != 0 ?
              <>
                <Text>Meduim Sized Area</Text>
                <Text style={{ marginLeft:10 }}>(Number of rooms: {msa})</Text>
              </>
              :  modalVisible.lsa != 0 ?
              <>
                <Text>Large Sized Area</Text>
                <Text style={{ marginLeft:10 }}>(Number of rooms: {lsa})</Text>
              </>
              :  modalVisible.elsa != 0 ?
              <>
                <Text>Extra large Sized Area</Text>
                <Text style={{ marginLeft:10 }}>(Number of rooms: {elsa})</Text>
              </>
              :
              null
            }
          </View>
        </View>
        <View style={{ marginVertical:10 }}>
          <Text style={{ fontFamily:'viga',fontSize:16,color:colors.black,textAlign:'center' }}>Type Of Cleaning</Text>
          <Text style={{ marginLeft:10,textAlign:'center',fontSize:16,textTransform:'capitalize' }}>{cleaningType}</Text>
        </View>

        <View>
          <Text style={{ fontFamily:'viga',marginTop:10 }}>Approx Pay: N{amount} - N{Number(amount) + 300}</Text>
        </View>
        <View style={{ flexDirection:'row' }}>
        <Pressable
          style={{ ...styles.button, ...styles.buttonAccept}}
          onPress={() => AcceptCustomerRequest()}
        >
          <Text style={styles.textStyle}>Accept</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonDecline]}
          onPress={() => DeclineCustomerRequest()}
        >
          <Text style={styles.textStyle}>Decline</Text>
        </Pressable>
        </View>
      </View>
    </View>
  </Modal>
  </View>
  );
}
const styles = StyleSheet.create({
    centeredView: {
      position:'absolute',
      width:'100%',
      height:'100%',
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalBody: {
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        padding:20
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
      padding: 10,
      elevation: 2,
      margin:20
    },
    buttonDecline: {
      backgroundColor:'red'
    },
    buttonAccept: {
      backgroundColor:colors.green
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontFamily:'viga'
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontFamily:'viga',
      fontSize:21
    },
    address: {
        textAlign:'center',
        fontSize:16
    }
});
