import { useEffect,useState,useRef } from 'react';
import { StyleSheet, View,Text,Image,TextInput,ImageBackground,TouchableOpacity,Vibration, TouchableNativeFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../colors/colors';
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from 'react-native-animatable';
import { Entypo,MaterialIcons } from '@expo/vector-icons';
import { BarIndicator } from 'react-native-indicators';
import { useDispatch, useSelector } from 'react-redux';
import { ADDRESS, LoginUser } from '../../redux/actions/actions';
import { AllKeys } from '../../keys/AllKeys';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const emailInput = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [isPending,setIsPending] = useState(false)
    const [error,setError] = useState({ field1:false,field2:false,text:'' })
    const dispatch = useDispatch()
    const [showPassword,setShowPassword] = useState({
      eye: false,
      secureTextEntry: true
    })
    const ONE_SECOND_IN_MS = 50;
    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS
    ];

    // FUNCTION THAT STORES DATA IN STORAGE
    const setStorageData = async(id) => {
      await AsyncStorage.setItem('cleanerData', JSON.stringify({
        id
      }))
      // const checkStorage = await AsyncStorage.getItem('userData')
    }
    const LoginInUsers = async() => {
      setError(preEvents => {
        return {
          ...preEvents,
          field1:false,
          field2:false
        }
      }) 
        if (email === '' || !email) {
          setError(preEvents => {
            return {
              ...preEvents,
              field1:true,
              text: 'Fill in the fields'
            }
          }) 
          return
        }
        if (password === '' || !password) {
          setError(preEvents => {
            return {
              ...preEvents,
              field2:true,
              text: 'Fill in the fields'
            }
          }) 
          return
        }
        if (isPending) {
          return
        }
        setIsPending(true)
        const fetchUser = await fetch(`${AllKeys.ipAddress}/FetchCleanerInfo?email=${email}&password=${password}`)
        const fetchUserRes = await fetchUser.json();
        if (fetchUserRes.success) {
          const fetchCleaner = await fetch(`${AllKeys.ipAddress}/fetchCleaner?id=${fetchUserRes.rows.id}`)
          const { rows } = await fetchCleaner.json()
          const fetchAddress = await fetch(`${AllKeys.ipAddress}/fetchUserAddress?id=${fetchUserRes.rows.id}`)
          const resAddress = await fetchAddress.json()
          setStorageData(fetchUserRes.rows.id)
          const { rating,level,bank_name,account_number,account_name,status } = rows
          let newList =  Object.assign(fetchUserRes.rows,{rating},{ level },{status},{ cleaner_id:rows.id },{ bank_name },{ account_number },{account_name})
          dispatch(ADDRESS(resAddress.rows))
          dispatch(LoginUser(newList))
        }else{
          if (fetchUserRes.error === 'noEmail') {
            emailRef.current.shake(1000)
            Vibration.vibrate(PATTERN)
            setError(preEvents => {
              return {
                ...preEvents,
                field1:true,
                text: 'Email does not exist. Please register on our main app'
              }
            }) 
          }else if (fetchUserRes.error === 'wrongPassword') {
            passwordRef.current.shake(1000)
            Vibration.vibrate(PATTERN)
            setError(preEvents => {
              return {
                ...preEvents,
                field2:true,
                text: 'Your Password is Incorrect'
              }
            }) 
          }else if(fetchUserRes.error === 'NoCleaner'){
            emailRef.current.shake(1000)
            passwordRef.current.shake(1000)
            Vibration.vibrate(PATTERN)
            setError(preEvents => {
              return {
                ...preEvents,
                field1:true,
                text: 'Please register as a cleaner.'
              }
            }) 
            emailInput.current.focus()
            setPassword('')
            setEmail('')
          }
          setIsPending(false)
        }
      }
  return (
    <ImageBackground style={{ flex:1 }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png'}}>
        {/* <AnimatedLoader
          visible={isPending}
          overlayColor="rgba(0,0,0,0.75)"
          source={require('../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        /> */}
        <SafeAreaView>
            <View style={styles.content}>
                <View style={{ marginBottom:50,flexDirection:'row' }}>
                    <Text style={{ fontFamily:'Funzi',fontSize:54,color:colors.whitishBlue }}>Welcome Back</Text>
                </View>
                <Animatable.View ref={emailRef} style={styles.parentInput}>
                  <View style={{ left:'3%',position:'absolute',elevation:2,zIndex:2 }}>
                    <MaterialIcons name="email" size={24} color={colors.purple} />
                  </View>
                  <TextInput 
                    autoFocus style={error.field1 ? {...styles.input, backgroundColor:'pink' } : styles.input} value={email} 
                    onChangeText={(val) => setEmail(val)} 
                    ref={emailInput}
                    placeholder='Please Enter Email' 
                    placeholderTextColor={colors.black} 
                  />
                </Animatable.View>
                  {
                    error.field1 ?
                    <Text style={styles.errorText}>{error.text}</Text>
                    :
                    null
                  }
                <Animatable.View ref={passwordRef} style={styles.parentInput}>
                  <View style={{ position:'absolute',left:'3%',elevation:2,zIndex:2 }}>
                    <MaterialIcons name="lock" size={24} color={colors.purple} />
                  </View>
                    <TextInput 
                      style={error.field2 ? {...styles.input, backgroundColor:'pink' } : styles.input} 
                      value={password} 
                      onChangeText={(val) => setPassword(val)} 
                      placeholder='Please Enter Password' 
                      placeholderTextColor={colors.black}
                      secureTextEntry={showPassword.secureTextEntry}
                    />
                    <View style={{ position:'absolute',right:'5%' }}>
                       {!showPassword.eye && <Entypo name="eye" size={24} color={colors.purple} onPress={() => setShowPassword({
                           eye: true,
                           secureTextEntry: false
                       })}/>}
                        {showPassword.eye && <Entypo name="eye-with-line" size={24} color={colors.purple} onPress={() => setShowPassword({
                            eye: false,
                            secureTextEntry: true
                        })}/>}
                    </View>
                </Animatable.View>
                  {
                    error.field2 ?
                    <Text style={styles.errorText}>{error.text}</Text>
                    :
                    null
                  }
                  {
                    isPending
                    ?
                      <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                         <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
                      </View>
                    :
                    <TouchableNativeFeedback onPress={() => LoginInUsers()}>
                      <View style={styles.button}>
                          <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>LOGIN</Text>
                      </View>
                    </TouchableNativeFeedback>
                  }
                <TouchableOpacity onPress={() => navigation.push('ForgottenPwd')}>
                  <View>
                      <Text style={{ fontFamily:'viga',color:'#004aad',textDecorationLine:'underline' }}>Forgotten Password?</Text>
                  </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  errorText:{
    fontSize:12,
    color:'red'
  },
  content:{
      padding:20,
      marginTop:40
  },
  lottie: {
      width: 100,
      height: 100
  },
  parentInput:{
      marginVertical:10,
      justifyContent:'center'
  },
  input:{
      backgroundColor:colors.grey,
      padding:10,
      borderRadius:10,
      paddingHorizontal:50,
      fontFamily:'viga',
      color:colors.black,
  },
  button: {
      backgroundColor:colors.purple,
      padding:10,
      marginVertical:10,
      borderRadius:10
  }
})
