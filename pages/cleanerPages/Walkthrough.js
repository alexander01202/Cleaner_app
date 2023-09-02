import React from 'react'
import { View,Text,StyleSheet,SafeAreaView, TouchableOpacity,ScrollView } from 'react-native'
import { colors } from '../../colors/colors'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Walkthrough({ navigation }) {
  const doneWithWalkthrough = async() => {
    await AsyncStorage.mergeItem('userData', JSON.stringify({
      walkthrough:'done'
    })
  )
  navigation.navigate('UserDashboard')
  }
  
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ paddingBottom:100,paddingTop:50 }}>
        <View>
          <Text style={{ fontFamily:'viga',textAlign:'center',textDecorationLine:'underline',fontSize:18,color:colors.yellow }}>A MUST READ!!!(A WALKTHROUGH)</Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            1) Any negative review from a customer can tremendiously affect your reputation/rating.
          </Text>
        </View>
        <View style={styles.steps}>
          <Text style={styles.text}>
            2) Regular Cleaning only involves sweeping and moping.
          </Text>
          <Text style={styles.text}>Deep Cleaning involves sweeping, mopping, dusting of surfaces,bed arrangements,window cleaning,environment arrangement.</Text>
        </View>
        <View style={styles.steps}>
          <Text style={{...styles.text, marginBottom:10}}>3) After every Cleaning, a customer has the choice to hire you or not.</Text>
          <Text style={{...styles.text, marginBottom:10}}>Every hire you get increases your ratings significantly, this portrays that you are trustworthy and you performed well</Text>
          <Text style={{...styles.text, marginBottom:10}}>When they hire you, this could significantly increase your revenue, so aim to do your best job.</Text>
        </View>
        <TouchableOpacity onPress={() => doneWithWalkthrough()}>
          <View style={styles.button}>
            <Text style={{ color:colors.white,fontFamily:'viga' }}>YES. I AM DONE READING</Text>
          </View>
        </TouchableOpacity>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    steps: {
      margin:10
    },
    text: {
      fontFamily:'viga',
      letterSpacing:1.1
    },
    button: {
      backgroundColor: colors.yellow,
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
})
