import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Text, View,StyleSheet,Dimensions, TouchableWithoutFeedback,Modal,SafeAreaView } from 'react-native'
import { colors } from '../colors/colors'

export default function CompanyAccountPage({ navigation,route }) {
    const { amount } = route.params
  return (
    <SafeAreaView>
        <View style={{ height:'100%',justifyContent:'center',alignItems:'center' }}>
            <Text><Text style={{ fontFamily:'viga' }}>Account Name</Text> : <Text>ALEXANDER OBIDIEGWU CHIZARAM</Text></Text>
            <Text><Text style={{ fontFamily:'viga' }}>Account Number</Text>: <Text>0818400195</Text></Text>
            <Text><Text style={{ fontFamily:'viga' }}>Bank Name</Text>: <Text>ACCESS BANK</Text></Text>
            <View>
                <Text><Text style={{ fontFamily:'viga' }}>Amount</Text> : {amount}</Text>
            </View>

            <View style={{ bottom:-50 }}>
                <TouchableWithoutFeedback onPress={() => navigation.pop()}>
                    <View style={{ backgroundColor:'green',padding:10,marginVertical:10,alignSelf:'center' }}>
                        <Text style={{ textTransform:'uppercase',fontWeight:'bold',color:colors.white }}>Click if You've Paid</Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={{ fontFamily:'viga',textAlign:'center' }}>Please wait atleast for the next 24hours for your payment to be verified</Text>
            </View>
        </View>

    </SafeAreaView>
  )
}
