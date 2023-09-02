import {useEffect,useState,useRef} from 'react';
import { StyleSheet, Text, View,SafeAreaView,TextInput,ImageBackground,TouchableOpacity,Vibration, TouchableNativeFeedback } from 'react-native'
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from 'react-native-animatable';
import { Entypo,FontAwesome5,MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../colors/colors';
import { AllKeys } from '../../keys/AllKeys';
import MyModal from '../../components/modal';
import { showMessage } from 'react-native-flash-message';

export default function ResetPwd({ navigation,route }) {
    const [email,setEmail] = useState('')
    const [userId,setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [Rpassword, setRPassword] = useState('')
    const [empty, setEmpty] = useState({ password:false,Rpassword:false })
    const passowrdRef = useRef(null)
    const RpassowrdRef = useRef(null)
    const [isPending,setIsPending] = useState(false)
    const [error,setError] = useState({ field1:false,field2:false })
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const [showPassword,setShowPassword] = useState({
      eye: false,
      secureTextEntry: true
    })
    const [showRPassword,setShowRPassword] = useState({
      eye: false,
      secureTextEntry: true
    })
    const { id, userEmail } = route.params;

    useEffect(() => {
      if (userEmail && id) {
        setEmail(userEmail)
        setUserId(id)
      }else{
        showMessage({
          type:'danger',
          message:'Error',
          description:'Invalid parameters'
        })
        setTimeout(() => {
          navigation.push('ForgottenPwd')
        }, 1000);
      }  
    
    }, [userEmail,id])
    useEffect(() => {
      if (password !== Rpassword && password !== '' && Rpassword !== '') {
        setError({ field2:true, field1:false })
      } else {
        setError({ field2:false, field1:false })
      }
    }, [password,Rpassword])
    
    
    const ONE_SECOND_IN_MS = 50;
    const PATTERN = [
      1 * ONE_SECOND_IN_MS,
      2 * ONE_SECOND_IN_MS
    ];
    
    const resetPwd = async() => {
      setIsPending(true)
      var req = await fetch(`${AllKeys.ipAddress}/resetPwd?userId=${userId}&password=${password}`)
      const { success } = await req.json()
      setIsPending(false)
      if (success) {
          setEmail('')
          showMessage({
            type:'success',
            message:'Success',
            description:'Password Updated'
          })
          setTimeout(() => {
            navigation.push('LoginPage')
          }, 500);
          // setModalVisible({ show:true,text:'Success. Please check your email!!' })
      }else{
        showMessage({
          type:'danger',
          message:'Error',
          description:'Please try again later'
        })
      }
    }
    const updatePassword = (val) => {
        if (!val) {
          passowrdRef.current.shake(500)
          Vibration.vibrate(PATTERN)
          setEmpty(preEvents => {
            return {...preEvents, password:true}
          })
        }else if (empty.password) {
          setEmpty(preEvents => {
            return {...preEvents, password:false}
          })
        }
        setPassword(val)
    }
    const updateRpassword = (val) => {
        if (!val) {
          RpassowrdRef.current.shake(500)
          Vibration.vibrate(PATTERN)
          setEmpty(preEvents => {
            return {...preEvents, Rpassword:true}
          })
        }else if (empty.Rpassword) {
          setEmpty(preEvents => {
            return {...preEvents, Rpassword:false}
          })
        }
        setRPassword(val)
    }
    const changeModal = () => {
        setModalVisible({
          show:false,
          text:''
        })
    }
  return (
    <>
    <MyModal modalFunc={changeModal} action={'close'} heading={'Please check your email to complete reset'} changeModal={changeModal} modalVisible={modalVisible.show} />
    <ImageBackground style={{ flex:1 }} source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png'}}>
        <AnimatedLoader
        visible={isPending}
        overlayColor="rgba(0,0,0,0.7)"
        source={require('../../lottie/circle2.json')}
        animationStyle={styles.lottie}
        speed={1}
        />
        <SafeAreaView>
            <View style={styles.content}>
            <View style={{ marginBottom:50 }}>
                <Text style={{ fontFamily:'Funzi',fontSize:54,color:colors.whitishBlue }}>Enter New Password</Text>
                {/* <Text style={{ fontFamily:'viga',fontSize:20,color:colors.white,letterSpacing:1 }}>Reset Password</Text> */}
            </View>
            <Animatable.View ref={passowrdRef} style={error.field1 || empty.password ? {...styles.parentInput, borderColor:'red' } : styles.parentInput}>
                <MaterialIcons name="lock" size={24} color={colors.white} />
                <TextInput 
                    autoFocus style={styles.input} value={password} 
                    onChangeText={(val) => updatePassword(val)} 
                    placeholder='Enter new password' 
                    placeholderTextColor={colors.whitishBlue} 
                    secureTextEntry={showPassword.secureTextEntry}
                />
                <View style={{ position:'absolute',right:'5%' }}>
                   {!showPassword.eye && <Entypo name="eye" size={24} color={colors.white} onPress={() => setShowPassword({
                       eye: true,
                       secureTextEntry: false
                   })}/>}
                    {showPassword.eye && <Entypo name="eye-with-line" size={24} color={colors.white} onPress={() => setShowPassword({
                        eye: false,
                        secureTextEntry: true
                    })}/>}
                </View>
            </Animatable.View>
            <Animatable.View ref={RpassowrdRef} style={error.field2 || empty.Rpassword ? {...styles.parentInput, borderColor:'red' } : styles.parentInput}>
                <MaterialIcons name="lock" size={24} color={colors.white} />
                <TextInput 
                    style={styles.input} value={Rpassword} 
                    onChangeText={(val) => updateRpassword(val)} 
                    placeholder='Please Repeat Password' 
                    placeholderTextColor={colors.whitishBlue}
                    secureTextEntry={showRPassword.secureTextEntry}
                />
                <View style={{ position:'absolute',right:'5%' }}>
                   {!showRPassword.eye && <Entypo name="eye" size={24} color={colors.white} onPress={() => setShowRPassword({
                       eye: true,
                       secureTextEntry: false
                   })}/>}
                    {showRPassword.eye && <Entypo name="eye-with-line" size={24} color={colors.white} onPress={() => setShowRPassword({
                        eye: false,
                        secureTextEntry: true
                    })}/>}
                </View>
            </Animatable.View>
              {
                error.field2 ?
                <Text style={styles.errorText}>Your Password is not the same</Text>
                :
                null
              }
              {
                error.field1 || error.field2 || empty.Rpassword || empty.password
                ?
                <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                    <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Reset Password</Text>
                </View>
                :
                <TouchableNativeFeedback onPress={() => resetPwd()}>
                    <View style={styles.button}>
                        <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Reset Password</Text>
                    </View>
                </TouchableNativeFeedback>
              }
            {/* <TouchableOpacity onPress={() => navigation.pop()}>
                <View>
                    <Text style={{ fontFamily:'viga',color:'#004aad',textDecorationLine:'underline' }}>Go back</Text>
                </View>
            </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    </ImageBackground>
    </>
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
      borderWidth:2,
      borderColor:colors.purple,
      flexDirection:'row',
      alignItems:'center',
      marginVertical:10,
      paddingHorizontal:10,
    },
    input:{
      padding:10,
      paddingHorizontal:10,
      fontFamily:'viga',
      color:colors.white,
      width:'100%'
    },
    button: {
        backgroundColor:colors.purple,
        padding:10,
        marginVertical:10
    }
})