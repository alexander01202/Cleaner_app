import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import { View,StyleSheet,Text, Button, TouchableWithoutFeedback,Modal,SafeAreaView,TextInput} from 'react-native'
import { colors } from '../../../colors/colors';

export default function LoginWorkersModal({ changeLoginModal,loginWorkersVisible,cacNumber,changeCacNumber,loginAgent }) {
  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
      animationType="slide"
      style={{ justifyContent:'center' }}
      visible={loginWorkersVisible}
    >
      <View style={{ flex:1, alignItems:'center',justifyContent:'center' }}>
        <View style={styles.parentView}>
          <Text style={styles.text}>CAC NUMBER</Text>
          <TextInput keyboardType='number-pad' value={cacNumber} onChangeText={(val) => changeCacNumber(val)} autoFocus={true} style={styles.input}/>
        </View>
        <TouchableWithoutFeedback onPress={() => loginAgent()}>
          <View style={{ padding:10,borderRadius:20,backgroundColor:colors.yellow,width:'50%' }}>
            <Text style={{ fontFamily:'Murecho',textAlign:'center' }}>Login</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => changeLoginModal()}>
          <View style={{ marginVertical:10,borderColor:colors.yellow,borderWidth:2,padding:10,borderRadius:20,width:'50%' }}>
            <Text style={{ fontFamily:'Murecho',textAlign:'center' }}>Close</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    input: {
        borderColor:colors.black,
        borderWidth:2,
        backgroundColor:'#c4c4c4',
        paddingLeft:10,
        letterSpacing:1.4,
        height:40
    },
    parentView:{
        width:'80%',
        marginVertical:15
    },
    text:{
        fontSize:16,
        fontFamily:'viga'
    }
})