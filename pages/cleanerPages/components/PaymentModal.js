import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Text, View,StyleSheet,Dimensions, ActivityIndicator, Button, FlatList, TouchableWithoutFeedback,Modal } from 'react-native'
import { colors } from '../../../colors/colors'

export default function PaymentModal({ showPaymentModal,changePaymentModal,navigation,amount }) {
    const navigateToPaymentPage = () => {
        changePaymentModal()
        navigation.navigate('CompanyAccountPage', { amount })
        return
    }
  return (
    <View style={styles.centeredView}>
    <Modal
        animationType="slide"
        visible={showPaymentModal}
        transparent={true}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={{ fontFamily:'viga' }}>Please Pay Your Invoice</Text>
            <TouchableWithoutFeedback onPress={navigateToPaymentPage}>
                <View style={{ backgroundColor:colors.yellow,padding:10,marginVertical:10 }}>
                    <Text style={{ textTransform:'uppercase',fontWeight:'bold',color:colors.white }}>Proceed</Text>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </View>
    </Modal>
    </View>
  )
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
    }
})   
