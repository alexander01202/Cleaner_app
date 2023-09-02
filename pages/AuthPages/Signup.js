import React,{useEffect,useState,useRef} from 'react';
import { StyleSheet, View,Text,Image,Dimensions, TouchableOpacity,SafeAreaView,TextInput,ImageBackground,TouchableWithoutFeedback } from 'react-native';
import { colors } from '../../colors/colors';
import { Entypo,AntDesign,MaterialIcons,FontAwesome } from '@expo/vector-icons';
import AnimatedLoader from "react-native-animated-loader";
import Onboarding from 'react-native-onboarding-swiper';
import PhoneInput from 'react-native-phone-input';
import Otp from '../../components/Signupsteps/Otp';
import { SignupUser } from '../../redux/actions/actions';
import { useDispatch } from 'react-redux';
import MyModal from '../../components/modal';

const {width,height} = Dimensions.get('window')
export default function Signup({ navigation }) {
    const dispatch = useDispatch()
    const onboardingRef = useRef(null)
    const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
    const [isPending,setIsPending] = useState(false)
    const [error,setError] = useState({ numberField:false,otp:false,firstname:false,lastname:false,email:false,password:false,text:'' })
    // Phone number states
    const [number,setNumber] = useState('')
    const input = useRef(null);

    const otpId = useRef(null)
    // user field states
    const [firstname,setFirstname] = useState('')
    const [lastname,setLastname] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [showPassword,setShowPassword] = useState({
        eye: false,
        secureTextEntry: true
      })
    
    const submitNumber = () => {
        if (number > 10) {
            sendVerification()
        }else{
            setError(preEvents => {
                return{
                    ...preEvents,
                    numberField:true,
                    text:'Not a valid Number'
                }
            })
        }
    }
    const sendVerification = async() => {
        setError(preEvents => {
            return {
                ...preEvents,
                numberField:false,
                otp:false,
                firstname:false,
                lastname:false,
                email:false,
                password:false,
                text:''
            }
        })
        if (isPending) {
          return
        }
        setIsPending(true)
        // var newNum = number.replace(/0+(\d+)/g, "$1")
        const resNumber = await fetch(`http://192.168.100.12:19002/queryUser?number=${number}&email=${email}`)
        const resultNumber = await resNumber.json()
    
        if (resultNumber.success && resultNumber.result.length > 0) {
          setError(preEvents => {
            return{
                ...preEvents,
                numberField:true,
                text:'Number Already exist'
            }
          })
          setIsPending(false)
          return
        }else if(!resultNumber.success){
            setError(preEvents => {
                return{
                    ...preEvents,
                    numberField:true,
                    text:'Please Try Again Later'
                }
            })
          setIsPending(false)
          return
        }
        const sendOtp = await fetch(`http://192.168.100.12:19002/sendOtp?number=${number}`)
        const { response } = await sendOtp.json()
        setIsPending(false)
        if (response.status === 'sent') {
            otpId.current = response.id
            onboardingRef.current.goNext()
        }else{
            setError(preEvents => {
                return{
                    ...preEvents,
                    numberField:true,
                    text:'Could not send otp'
                }
            })
        }
      };
    const confirmCode = async(code) => {
        setIsPending(true)
        const verifyOtp = await fetch(`http://192.168.100.12:19002/verifyOtp?token=${code}&id=${otpId.current}`)
        const { response,success } = await verifyOtp.json()
        if (response.status === 'verified') {
          onboardingRef.current.goNext()
        }else if (!success) {
          setError(preEvents => {
              return {
                ...preEvents,
                otp:true,
                text:'OTP has expired.'
              }
          })
        }
        setIsPending(false)
      }
    const proceedToEmail = () => {
        setError(prevEvents => {
            return {
                ...prevEvents,
                firstname:false,
                lastname:false,
            }
        })
        if (firstname !== '' || firstname || lastname !== '') {
            onboardingRef.current.goNext()
        }else{
            setError(prevEvents => {
                return {
                    ...prevEvents,
                    firstname:true,
                    lastname:true,
                    text:'Fields cannot be left empty'
                }
            })
        }
    }
    // FUNCTION THAT STORES DATA IN STORAGE
  const setStorageData = async(id) => {
    await AsyncStorage.setItem('cleanerData', JSON.stringify({
      id
    })
    )
  }
    //  signup Users
  const signUpUsers = async() => {
    setError(preEvents => {
        return {
            ...preEvents,
            email:false,
            password:false,
            text:''
        }
    })
    if (email === '' || !email || password === '' || !password || firstname === '' || !firstname || lastname === '' || !lastname) {
        setError(prevEvents => {
            return {
                ...prevEvents,
                email:true,
                password:true,
                text:'Please fill in all the fields.'
            }
        })
      return
    }
    setIsPending(true)
    const resNumber = await fetch(`http://192.168.100.12:19002/queryUser?number=${number}&email=${email}`)
    const resultNumber = await resNumber.json()

    if (resultNumber.success && resultNumber.result.length > 0) {
        setError(prevEvents => {
            return {
                ...prevEvents,
                email:true,
                text:'Email already exist.'
            }
        })
      setIsPending(false)
      return
    }else if(!resultNumber.success){
      setIsPending(false)
      setModalVisible({ show:true,text:'Please try again Later' })
      return
    }

    // Add user to Mysql database
    const res = await fetch(`http://192.168.100.12:19002/SignupUser?email=${email}&number=${number}&firstname=${firstname}&lastname=${lastname}&password=${password}`)
    const result = await res.json()

    if (result.success) {
      let obj = {
        id:result.userID,
        firstname,
        number,
        lastname,
        email
      }

      setStorageData(result.userID)
      setIsPending(false)
      dispatch(SignupUser(obj)) 
    }else{
      setIsPending(false)
      setModalVisible({ show:true,text:'There was an error connecting to the database' })
      setError('There was an error connecting to the database')
    }
  }
  // END OF SIGNUP USERS

    const changeModal = () => {
        setModalVisible({
          show:false,
          text:''
        })
    }
    // const updatePin = (pin) => {
    //     setOtpCode(pin)
    // }
  return (
      <>
        <MyModal changeModal={changeModal} modalVisible={modalVisible} />
        <AnimatedLoader
          visible={isPending}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../../lottie/circle-loader.json')}
          animationStyle={styles.lottie}
          speed={5}
        />
    <Onboarding
    subTitleStyles={{ width:width,zIndex:2,fontFamily:'viga',fontSize:20,alignSelf:'center',color:colors.white}}
    ref={onboardingRef}
    bottomBarHeight={0}
    bottomBarHighlight={false}
    pages={[
    {
      backgroundColor: `${colors.black}`,
      title: '',
      image: <ImageBackground 
        style={{width:'100%',height:'100%'}}
        resizeMode="cover"
        source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png'}}
    />,
      subtitle: 
        <View style={styles.content}>
            <View style={{ flexDirection:'row' }}>
                <Text style={styles.heading}>Signup and <Text style={{ fontFamily:'Funzi',fontSize:24,color:colors.whitishBlue }}>Keep your hygiene to the max</Text></Text>
            </View>
            <PhoneInput
              onChangePhoneNumber={(val) => setNumber(val)}
              initialValue={number}
              style={styles.textInput}
              flagStyle={{ marginHorizontal:10 }}
              allowZeroAfterCountryCode={false}
              textStyle={{ letterSpacing:1 }}
              ref={input}
              initialCountry={'ng'}
              translation="eng"
            />
            {
              error.numberField ?
              <Text style={styles.errorText}>{error.text}</Text>
              :
              null
            }
            <TouchableOpacity onPress={() => submitNumber()}>
                <View style={styles.button}>
                    <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>SEND OTP</Text>
                </View>
            </TouchableOpacity>
        </View>,
    },
    {
      backgroundColor: `${colors.black}` ,
      title: '',
      image: <ImageBackground 
      style={{width:'100%',height:'100%',bottom:0}}
    resizeMode="cover"
      source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background2_purple.png'}} />,
      subtitle: <View style={styles.content}>
      <View style={{ flexDirection:'row',marginBottom:30 }}>
          <Text style={styles.heading}>Verify OTP</Text>
      </View>
      <Otp confirmCode={confirmCode} />
      <TouchableOpacity onPress={() => confirmCode()}>
        <View style={styles.button}>
            <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Verify OTP</Text>
        </View>
      </TouchableOpacity>
        {/* <TouchableWithoutFeedback onPress={() => onboardingRef.current.goToPage(0, true)}>
            <View style={styles.backButton}>
                <AntDesign name="arrowleft" style={{ top:Dimensions.get('window').height < 596 ? 30 : 0,shadowColor:'black' }} size={24} color="black" />
            </View>
        </TouchableWithoutFeedback> */}
  </View>,
    },
    {
      backgroundColor: `${colors.black}` ,
      title: '',
      image: <ImageBackground 
      style={{width:'100%',height:'100%',bottom:0}}
    resizeMode="cover"
      source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png' }} />,
      subtitle: 
      <View style={{...styles.content, top:'5%'}}>
      <View style={{ marginBottom:30 }}>
          <Text style={{...styles.heading,fontSize:40}}>We're almost there...</Text>
      </View>
     <View style={styles.parentInput}>
        <View style={{ position:'absolute',left:'5%' }}>
            <FontAwesome name="user" size={24} color={colors.white} />
        </View>
        <TextInput
            style={error.firstname ? {...styles.input, borderColor:'red' } : styles.input} 
            value={firstname} 
            onChangeText={(val) => setFirstname(val)} 
            placeholder='Please Enter Firstname' 
            placeholderTextColor={colors.whitishBlue} 
        />
     </View>
        {
            error.firstname ?
            <Text style={styles.errorText}>{error.text}</Text>
            :
            null
        }
     <View style={styles.parentInput}>
        <View style={{ position:'absolute',left:'5%' }}>
            <FontAwesome name="user" size={24} color={colors.white} />
        </View>
        <TextInput 
            style={error.lastname ? {...styles.input, borderColor:'red' } : styles.input} 
            value={lastname} 
            onChangeText={(val) => setLastname(val)} 
            placeholder='Please Enter Lastname' 
            placeholderTextColor={colors.whitishBlue} 
        />
     </View>
        {
            error.lastname ?
            <Text style={styles.errorText}>{error.text}</Text>
            :
            null
        }
      <TouchableOpacity onPress={() => proceedToEmail()}>
        <View style={styles.button}>
            <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Next</Text>
        </View>
      </TouchableOpacity>
  </View>,
    },
    {
      backgroundColor: `${colors.black}` ,
      title: '',
      image: <ImageBackground 
      style={{width:'100%',height:'100%',bottom:0}}
    resizeMode="cover"
      source={{uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png'}} />,
      subtitle: 
      <View style={{...styles.content, top:'5%'}}>
      <View style={{ marginBottom:30 }}>
          <Text style={styles.heading}>Hurray!!!</Text>
          <Text style={{ ...styles.heading,fontSize:24 }}>Let's finish this together</Text>
      </View>
      <View style={styles.parentInput}>
        <View style={{ position:'absolute',left:'5%' }}>
          <MaterialIcons name="email" size={24} color={colors.white} />
        </View>
        <TextInput 
            style={error.email ? {...styles.input, borderColor:'red' } : styles.input} 
            value={email} 
            onChangeText={(val) => setEmail(val)} 
            placeholder='Please Enter Email' 
            placeholderTextColor={colors.whitishBlue} 
        />
        </View>
        {
            error.email ?
            <Text style={styles.errorText}>{error.text}</Text>
            :
            null
        }
        <View style={styles.parentInput}>
           <View style={{ position:'absolute',left:'5%' }}>
             <MaterialIcons name="lock" size={24} color={colors.white} />
           </View>
           <TextInput 
               style={error.password ? {...styles.input, borderColor:'red' } : styles.input} 
               value={password} 
               onChangeText={(val) => setPassword(val)} 
               placeholder='Please Enter Password' 
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
        </View>
        {
            error.password ?
            <Text style={styles.errorText}>{error.text}</Text>
            :
            null
        }
      <TouchableOpacity onPress={() => signUpUsers()}>
        <View style={styles.button}>
            <Text style={{ textAlign:'center',fontSize:16,fontFamily:'viga',color:colors.whitishBlue }}>Sign Up</Text>
        </View>
      </TouchableOpacity>
  </View>,
    },
  ]}
/>
</>
  )
}

const styles = StyleSheet.create({
    heading:{
        fontFamily:'Funzi',
        fontSize:54,
        color:colors.whitishBlue
    },
    errorText:{
        fontSize:12,
        color:'red'
    },
    content:{
        padding:20,
        marginTop:40,
        position:'absolute',
        top:'10%'
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
        borderWidth:2,
        borderColor:colors.yellow,
        padding:10,
        fontFamily:'viga',
        paddingHorizontal:50,
        color:colors.white
    },
    textInput: {
        height: 60,
        marginTop:30,
        borderRadius: 10,
        alignItems:'center',
        alignSelf:'center',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor:colors.white
      },
    button: {
        backgroundColor:colors.yellow,
        padding:10,
        marginVertical:10
    },
    backButton: {
        shadowOpacity:0.2,
        shadowOffset:{ width:5,height:5 },
        borderRadius:20,
        height:30,
        width:30,
        backgroundColor:colors.white,
        justifyContent:'center',
        alignItems:'center',
        elevation:3,
        marginTop:20
    }
})
