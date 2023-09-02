import { StyleSheet, Text, View,Vibration,TouchableWithoutFeedback,FlatList,ActivityIndicator } from 'react-native'
import React, { useEffect,useState } from 'react'
import { colors } from '../../colors/colors';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { Ionicons,FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';

export default function FutureOrder({ navigation }) {
  const [orderLists,setOrderList] = useState(null)
  const [isPending,setIsPending] = useState(false)
  const { id } = useSelector(state => state.login)
  const ONE_SECOND_IN_MS = 50;
  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS
  ];
  useEffect(() => {
    const fetchAllOrders = async() => {
      setIsPending(true)
      const res = await fetch(`http://192.168.100.12:19002/fetchCleanerOrders?cleanerId=${id}`)
      const orders = await res.json()
      setOrderList(orders)
      setIsPending(false)
    }
    fetchAllOrders()
  }, [])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      // Prevent default behavior
      Vibration.vibrate(PATTERN)
    });
  
    return unsubscribe
  }, [navigation])
  
  return (
    <View style={styles.container}>
      <AnimatedLottieView 
          source={require('../../lottie/update3.json')}
          autoPlay={true}
          loop={true}
          resizeMode={'contain'}
          style={{ width:'100%' }}
      />
      <View style={{ marginVertical:5 }}>
          <Text style={{ fontFamily:'Magison',fontSize:30 }}>Coming soon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:10
  }
})