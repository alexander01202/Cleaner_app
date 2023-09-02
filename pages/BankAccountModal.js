import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import { View,StyleSheet,Text, Button, TouchableWithoutFeedback,Modal,ActivityIndicator,Dimensions,SafeAreaView, TextInput} from 'react-native'
import { colors } from '../colors/colors';

export default function BankAccountModal({bankModalVisible,bankName,bankNumber,accountName,changeAccountName,changeBankName,changeBankNumber,changeBankModal}) {
  const { width,height } = Dimensions.get('window')
  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        style={{ justifyContent:'center' }}
        visible={bankModalVisible}
        onRequestClose={() => changeBankModal(!bankModalVisible)}
      >
      <View style={{ alignItems:'center',marginVertical:height > 768 ? 40 : null }}>
        <View style={styles.parentView}>
          <Text style={styles.text}>ACCOUNT NAME</Text>
          <TextInput value={accountName} placeholder='Please Enter Your Account Name' onChangeText={(val) => changeAccountName(val)} autoFocus={true} style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>BANK NAME</Text>
          <TextInput value={bankName} placeholder='Please Enter Your Bank Name' onChangeText={(val) => changeBankName(val)} style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>ACCOUNT NUMBER</Text>
          <TextInput value={bankNumber} placeholder='Please Enter Your Account Number' onChangeText={(val) => changeBankNumber(val)} keyboardType='number-pad' style={styles.input}/>
        </View>
        <TouchableWithoutFeedback onPress={() => changeBankModal(!bankModalVisible)}>
          <View style={styles.button}>
            <Text style={styles.text}>Add Bank Account</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => changeBankModal(!bankModalVisible)}>
          <View style={{ padding:10,marginVertical:10,borderWidth:2,borderColor:colors.yellow }}>
            <Text>CLOSE</Text>
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
    },
    button: {
      backgroundColor:colors.yellow,
      padding:10
    }
})