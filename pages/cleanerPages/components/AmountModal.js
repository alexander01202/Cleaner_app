import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import { View,StyleSheet,Text, Button,TouchableWithoutFeedback,Modal,ActivityIndicator,Dimensions,SafeAreaView, TouchableOpacity} from 'react-native'
import { colors } from '../../../colors/colors';
import { useSelector,useDispatch } from 'react-redux';

export default function AmountModal({ orderFee,amountModal,closeAmountModal,changeOrderState }) {
    const {width,height } = Dimensions.get('window')
    
  const Finish = () => {
    closeAmountModal()
    changeOrderState('order')
  }
  return (
    <Modal
      onRequestClose={() => Finish()}
      animationType="slide"
      visible={amountModal}
    >
      <SafeAreaView style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={{ marginTop:50 }}>
            <View style={{ height:height/2, borderColor:colors.yellow,borderWidth:3,justifyContent:'center',alignItems:'center',borderRadius:200 }}>
              <Text style={styles.modalText} >N{orderFee}</Text>
            </View>
            <Text style={{ textAlign:'center',color:colors.white,fontFamily:'viga',bottom:-20,letterSpacing:1.1,fontSize:20 }}>Total Amount to be Paid</Text> 
          <View style={{ marginTop:10 }}>
          <TouchableWithoutFeedback onPress={() => Finish()}>
            <View style={{...styles.button,backgroundColor:colors.green}}>
              <Text style={{fontFamily:'viga',fontSize:18, color:colors.white}}>DONE</Text>
            </View>
          </TouchableWithoutFeedback> 
          </View>
        </View>
      </View>
      </SafeAreaView>
  </Modal>
  );
}
const styles = StyleSheet.create({
    centeredView: {
      position:'absolute',
      width:'100%',
      height:'100%',
      backgroundColor:colors.black,
      zIndex:-10
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
        backgroundColor: '#fff',
        height: 50,
        bottom:-40,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.2,
        elevation: 3
      },
    modalText: {
        fontFamily:'viga',textAlign:'center',fontSize:100,color:colors.yellow
    }
});
