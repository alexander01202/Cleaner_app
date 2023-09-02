import React, { useEffect } from 'react'
import { ActivityIndicator,StyleSheet,View,Image } from 'react-native'
import { colors } from '../colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import AnimatedSplash from "react-native-animated-splash-screen";
import { useState } from 'react';
import { AllKeys } from '../keys/AllKeys';

export default function StartUpScreen() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
      setTimeout(() => {
        setIsLoaded(true)
      }, 2000);
      const tryLogin = async() => {
        // AsyncStorage.clear()
        const cleanerData = await AsyncStorage.getItem('cleanerData')
        if (!cleanerData) {
            dispatch({ type: 'AUTH_IS_READY', isLogin:false})
            return
        }else{
          const transformedData = JSON.parse(cleanerData)
          const { id } = transformedData
          const res = await fetch(`${AllKeys.ipAddress}/GetId?id=${id}`)
          const { success } = await res.json()
          setIsLoaded(true)
          if (success && isLoaded) {
            dispatch({ type: 'AUTH_IS_READY', isLogin:true})
            return
          }
        }
        // console.log(rows)
        // if (rows.banned) {
        //   dispatch({ type: 'AUTH_IS_READY', isLogin:true})
        //   return
        // }
        // const expirationDate = new Date(expiryDate)
        // if (!id) {
        //   await AsyncStorage.removeItem('userData')
        //   dispatch({ type: 'AUTH_IS_READY', isLogin:false})
        //   return
        // }
        // if (expirationDate <= new Date() || !token || !userId) {
        //   const response = await fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyCO43Oldf5A3hIxmhsALwsAYXmWzoSVDkM', {
        //     headers: {
        //       'Content-Type':'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify({
        //       grant_type: 'refresh_token',
        //       refresh_token:refreshToken
        //     })
        //   })
        //   if(!response.ok){
        //     await AsyncStorage.removeItem('userData')
        //     dispatch({ type: 'AUTH_IS_READY', isLogin:false})
        //     return
        //   }
        //   const resData = await response.json() 
        //   const newExpiryDate = new Date(new Date().getTime() + parseInt(resData.expires_in) * 1000)
  
        //   await AsyncStorage.mergeItem('userData', JSON.stringify({
        //     token:resData.refresh_token,
        //     expiryDate:newExpiryDate.toISOString()
        //   })
        //   )
        //   const newData = await AsyncStorage.getItem('userData')
        //   const newTransformedData = JSON.parse(newData)

        //  const res = await fetch(`http://192.168.100.12:19002/GetId?id=${newTransformedData.id}`)
        //  const { rows } = await res.json()
         
        //   dispatch({ 
        //   type: 'LOGIN',
        //   payload: {
        //     id:rows.id, email:rows.email,displayName:rows.firstname,role:rows.role,number:rows.number,banned:rows.banned
        //   }
        // })
        //   return;
        // }

        // const res = await fetch(`http://192.168.100.12:19002/GetId?id=${id}`)
        // const { rows } = await res.json()
        // dispatch({
        //   type: 'LOGIN',
        //   payload: {
        //     id:rows.id, email:rows.email,displayName:rows.firstname,role:rows.role,number:rows.number,banned:rows.banned
        //   }
        // })
      }

      tryLogin()
    }, [isLoaded]);
    

  return (
    <View style={{ backgroundColor:colors.black, flex:1,justifyContent:'center',alignItems:'center' }}>
      <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={require("../assets/logo.png")}
        logoHeight={350}
        logoWidth={150}
      />
          {/* <Image resizeMode={'contain'} style={{width:'80%' }} source={require('../assets/logo/BlipmooreLogo(light).png')} /> */}
        
        {/* <View>
          <Image style={{width:'100%',height:150,alignSelf:'center'}} source={require('../assets/logo/newlogo.png')} />
        </View> */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:colors.black
  }
});
