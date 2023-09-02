import { StyleSheet, Text, View,TouchableNativeFeedback,Dimensions,ImageBackground, Modal, Image, TouchableOpacity,InteractionManager } from 'react-native'
import * as Device from 'expo-device';
// import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context'
import openMap, {createOpenLink,createMapLink} from 'react-native-open-maps';
import { Feather,MaterialIcons,Entypo,AntDesign } from '@expo/vector-icons';
import { useEffect, useRef, useState,useMemo } from 'react';
import * as bonusScrollView from 'react-native-gesture-handler'
import { useSelector } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import AnimatedLoader from 'react-native-animated-loader';
import ContentLoader from "react-native-easy-content-loader";
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import { colors } from '../../../colors/colors';
import { AllKeys } from '../../../keys/AllKeys';
import { showMessage, hideMessage } from "react-native-flash-message";
import notifee, { TimestampTrigger, TriggerType, RepeatFrequency, AndroidImportance, EventType } from '@notifee/react-native';
import moment from 'moment';
import { currency } from '../../../currency/currency';
import MyModal from '../../../components/modal';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window')
export default function Overview({ navigation,route }) {
  const [isLoading, setIsLoading] = useState(true)
  const [cleanerSlotsLeft, setCleanerSlotsLeft] = useState(null)
  const [showImgModal, setShowImgModal] = useState(false)
  const [askAlarmModal, setAskAlarmModal] = useState(false)
  const [supervisorSlotsLeft, setSupervisorSlotsLeft] = useState(null)
  const [address,setAddress] = useState({ country:null,state:null,city:null,street_name:null,street_number:null,lga:null })
  const [cusLocation,setCusLocation] = useState({ latitude:null, longitude:null })
  const [isApplying, setIsApplying] = useState(false)
  const bonusBottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['70%'], []);
  const { id,displayName,rating,cleaner_id } = useSelector(state => state.login)
  const { name_of_business,customer_id,cleanerFilled,supervisorFilled,cleaner_pay,supervisor_pay,deadline,next_cleaning_order,num_of_cleaner,num_of_supervisor,type,time_period,day_period,state,country } = route.params.item
  var loaderArr = [1,2,3]
  useEffect(async() => {
    await checkSlots()
    await getAddress()
    setIsLoading(false)
    
  }, [])
  useEffect(() => {
    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.notification.id === 'complaint') {
        await fetch(`${AllKeys.ipAddress}/cleanerComplaint?cleaner_id=${detail.notification.data.cleanerId}&complaint=${detail.input}`);
        await notifee.cancelDisplayedNotifications()
        await notifee.cancelDisplayedNotification(detail.notification.id)
      }else if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'thanks') {
        await notifee.cancelDisplayedNotifications()
        await notifee.cancelDisplayedNotification(detail.notification.id)
      }
    });
  }, [])
  const getAddress = async() => {
    if (type === 'home') {
      const req = await fetch(`${AllKeys.ipAddress}/fetchUserAddress?id=${customer_id}`)
      const request = await fetch(`${AllKeys.ipAddress}/getCustomerLocation?customerId=${customer_id}`)
      const res = await request.json()

      var { latitude,longitude } = res.rows
      setCusLocation({ latitude,longitude })
      const { success,rows } = await req.json()
      if (success) {
        setAddress(rows) 
      }
    }else{
      const req = await fetch(`${AllKeys.ipAddress}/getEnterpriseInfo?id=${route.params.item.id}`)
      const { success,row } = await req.json()
      if (success) {
        const { state,country,street_name,street_number,lga,city } = row[0]
        setAddress({state,country,street_name,street_number,lga,city})
      }
    }
  }
  const checkSlots = async() => {
    console.log(route.params.item)
    const slots = await fetch(`${AllKeys.ipAddress}/checkSlots?enterprise_id=${route.params.item.id}&type=${type}`)
    const { cleanerSlotsFilled,supervisorSlotsFilled, success } = await slots.json()

    if (success) {
      if (cleanerSlotsFilled < 1) {
        setCleanerSlotsLeft(num_of_cleaner)
      }else{
        var totalSlotsLeft = num_of_cleaner - cleanerSlotsFilled
        setCleanerSlotsLeft(totalSlotsLeft)
      }
      if (supervisorSlotsFilled < 1) {
        setSupervisorSlotsLeft(num_of_supervisor)
      }else{
        var totalSlotsLeft = num_of_supervisor - supervisorSlotsFilled
        setSupervisorSlotsLeft(totalSlotsLeft)
      }
    }else{
      showMessage({
        message: "Error",
        description: "Could not Fetch Enterprise. Please try again later",
        type: "danger"
      });
    }
  }
  const addCleaner = async(role) => {
    // change this back to 50
    // if(rating < 10){
    //   showMessage({
    //     message: "Error",
    //     description: "You are not yet eligible to apply",
    //     type: "danger"
    //   });
    //   return
    // }
    if (cleanerSlotsLeft < 1 && role === 'cleaner') {
      return
    }else if (supervisorSlotsLeft < 1 && role === 'supervisor') {
      return
    }else{
      notifee.createChannel({
        id: 'apply_success',
        name: 'Successful Application',
        // Recommended to set importance to high
        importance: AndroidImportance.HIGH,
        vibration:false
      });
      const settings = notifee.getNotificationSettings();
      if ((Device.osVersion > 11 && settings.android.alarm == AndroidNotificationSetting.ENABLED) || Device.osVersion < 12) {
      setIsApplying(true)
      // Create a group
      var days = day_period.split(",");
      var time = time_period.split(",");
      var totalCleanersRemaining = Number(num_of_cleaner) + Number(num_of_supervisor)
      var apply
      if (type.toLowerCase() === 'home') {
        apply = await fetch(`${AllKeys.ipAddress}/applyToHome?cleanersNum=${totalCleanersRemaining}&active=${cleanerFilled ? 'cleaner' : supervisorFilled ? 'supervisor' : 'none' }&cus_id=${customer_id}&num_of_cleaner=${num_of_cleaner}&num_of_supervisor=${num_of_supervisor}&supervisorSlotsLeft=${supervisorSlotsLeft}&role=${role}&day_period=${day_period}&time_period=${time_period}&cleaner_id=${cleaner_id}&cleanerName=${displayName}&sub_id=${route.params.item.id}`)
      }else{
        apply = await fetch(`${AllKeys.ipAddress}/applyToEnterprise?cleaners=${totalCleanersRemaining}&active=${cleanerFilled ? 'cleaner' : supervisorFilled ? 'supervisor' : 'none' }&day_period=${day_period}&time_period=${time_period}&role=${role}&cleaner_id=${cleaner_id}&enterprise_id=${route.params.item.id}`)
      }
      const { success,reject } = await apply.json()
      if (success && !reject) {
        var futureTimestamp
        var futureHours
        var midnightTimestamp
        
        // This below commented code is to fetch all past completed order
        // const req = await fetch(`${AllKeys.ipAddress}/fetchCleanerOrders?cleanerId=${id}`)
        const getCleanerJobs = await fetch(`${AllKeys.ipAddress}/fetchCleanerJobs?cleanerId=${cleaner_id}`)
        const getSuperviosrJobs = await fetch(`${AllKeys.ipAddress}/fetchSupervisorJobs?cleanerId=${cleaner_id}`)
        const { rows } = await getCleanerJobs.json()
        const res = await getSuperviosrJobs.json()
        if (rows.length < 1 && res.rows.length < 1) {
          notifee.displayNotification({
            subtitle: '&#129395;',
            title:"<p><b>You are the best!!!</b></p>",
            body: '<p>This is your first job. Congrats!!!</p>',
            android: {
              channelId: 'apply_success',
            }
          });
        }else{
          notifee.displayNotification({
            id:'complaint',
            subtitle: '&#129395;',
            title:"<p><b>You are the best!!😊</b></p>",
            body: '<p>We appreciate your hardwork and consistency.</p>',
            data:{
              cleanerId:`${cleaner_id}`
            },
            android: {
              channelId: 'apply_success',
              actions: [
                {
                  title: '<b>Thank you</b> &#128111;',
                  pressAction: { id: 'thanks' },
                },
                {
                  title: '<p style="color: red;">I have a complaint.</p>',
                  pressAction: { id: 'complaint' },
                  input: {
                    placeholder: 'Write your complain...',
                  }, // enable free text input
                },
              ],
            }
          });
        }
        OneSignal.sendTags({subId: `${route.params.item.id}`,name:`${name_of_business}` });
        setIsApplying(false)
        if (role === 'supervisor') {
          navigation.navigate('ApplySuccess', {salary:supervisor_pay }) 
        }else if (role === 'cleaner') {
          navigation.navigate('ApplySuccess', {salary:cleaner_pay })
        }
      }else if (reject) {
        showMessage({
          message: "Rejected",
          description: "You already have a job around the same time period.",
          type: "warning"
        });
        return
      }else{
        showMessage({
          message: "Error",
          description: "Please try again later",
          type: "danger"
        });
      }
      setIsApplying(false)
    }else {
        setAskAlarmModal(true)
        // Show some user information to educate them on what exact alarm permission is,
      }
    }
  }
  const registerTrainee = async() => {
    const req = await fetch(`${AllKeys.ipAddress}/employTrainee?trainee_id=${cleaner_id}&sub_id=${route.params.item.id}&day_period=${day_period}`)
    const { success } = await req.json()
    if (success) {
      navigation.navigate('TraineeSuccess')
    }else{
      showMessage({
        message: "Error",
        description: "Please try again later",
        type: "danger"
      });
    }
  }
  const sendToAlarmSetting = async() => {
    // and why it is necessary for your app functionality, then send them to system preferences:
    await notifee.openAlarmPermissionSettings();
  }
  const openGoogleMaps = () => {
    // later check if rating is not up to 50
    if (!cleanerFilled && !supervisorFilled) {
      showMessage({
        message: "Error",
        description: "Apply to view direction",
        type: "danger"
      });
      return
    }
    const googleMaps = { navigate:true,end:`${address.street_name},${address.city},${address.country}`,query:`${address.street_name},${address.city},${address.country}` };
    openMap(googleMaps)
  }
  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLoader 
        visible={isApplying}
        overlayColor="rgba(0,0,0,0.75)"
        source={require('../../../lottie/circle2.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
      <Modal
        visible={showImgModal}
        onRequestClose={() => {
          setShowImgModal(false)
        }}
        transparent={false}
        animationType='fade'
        statusBarTranslucent={true}
      >
        <TouchableNativeFeedback onPress={() => setShowImgModal(false)}>
          <View style={{ backgroundColor:'black',flex:1,justifyContent:'center',alignItems:'center' }}>
            <Image resizeMode='contain' style={{ width:'100%' }} source={require('../../../assets/3.jpg')} />
          </View>
        </TouchableNativeFeedback>
      </Modal>
      <MyModal modalVisible={askAlarmModal} changeModal={() => setAskAlarmModal(false)} action={'Allow'} heading={"Please allow us to send you notifications when it's time to for your job."} modalFunc={sendToAlarmSetting} />
      {/* <Modal
        visible={askAlarmModal}
        onRequestClose={() => {
          setAskAlarmModal(false)
        }}
        transparent={true}
        animationType='fade'
        statusBarTranslucent={true}
      >
        <View style={{ backgroundColor:'rgba(0,0,0,0.7)',flex:1,justifyContent:'center',alignItems:'center' }}>
          <View style={{ backgroundColor:'white',padding:20,width:'80%',justifyContent:'center',alignItems:'center',borderRadius:10 }}>
            <Text style={{ textAlign:'center',marginVertical:10,letterSpacing:1,fontWeight:'bold' }}></Text>
            <TouchableNativeFeedback onPress={sendToAlarmSetting}>
              <View style={{ backgroundColor:colors.purple,padding:10,width:'80%',alignSelf:'center',marginVertical:10 }}>
                <Text style={{ textAlign:'center',fontWeight:'bold',letterSpacing:1,color:'white' }}>Allow</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal> */}
      <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={{ height:height / 2.5 }}>
        <View>
          <TouchableNativeFeedback onPress={() => navigation.pop()}>
            <View style={styles.imgBtn}>
              <MaterialIcons name="arrow-back-ios" size={20} color="black" />
            </View>
          </TouchableNativeFeedback>
        </View>
        {
          isLoading ?
          // <ImageBackground resizeMode='contain' imageStyle={{ height:'60%',top:50 }} style={{ height:'100%',width:'100%',opacity:0.6 }} source={require('../../../assets/brokenimage.png')}>
          //   <ContentLoader active title={false} pRows={1} pHeight={'100%'} pWidth={'100%'} paragraphStyles={{ top:-50 }} />
          // </ImageBackground>
          null
          :
          <View style={{ marginVertical:5,padding:10,flexDirection:'row',justifyContent:'space-between' }}>
            <View style={styles.avatar}>
                <Text style={{ fontFamily:'Funzi',fontSize:30,color:colors.whitishBlue }}>{name_of_business.slice(0,1)}</Text>
            </View>
            <View style={{ width:'30%',justifyContent:'center' }}>
              <Text numberOfLines={1} style={{ fontSize:28,fontFamily:'viga',letterSpacing:1.1,color:colors.grey }}>{name_of_business}</Text>
              <View style={{ backgroundColor:colors.lightPurple,alignItems:'center',justifyContent:'center',padding:3,borderRadius:5 }}>
                <Text style={{ color:colors.purple,fontWeight:'bold',letterSpacing:1,fontSize:16 }}>{type}</Text>
              </View>
            </View>
          </View>
        }
      </LinearGradient>
      <BottomSheet
        ref={bonusBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={ isLoading && { backgroundColor:'rgba(225,225,225,1)' }}
        style={{...styles.bottomSheetContainer, padding:5}}
      >
        <bonusScrollView.ScrollView>
        <View style={{ padding:10 }}>
          {
            isLoading ?
            <>
             <ContentLoader active title={false} pRows={1} pHeight={35} paragraphStyles={{ borderRadius:10,marginVertical:10 }} pWidth={'100%'} />
             <View style={{ marginVertical:20 }}>
              <ContentLoader active paragraphStyles={{ width:'20%',height:20 }} pRows={1} />
             </View>
             <View style={{ marginVertical:20,flexDirection:'row' }}>
              {
                loaderArr.map(arr => (
                  <View key={arr} style={{ flexDirection:'row',width:'30%', marginHorizontal:5 }}>
                    <ContentLoader active title={false} pRows={1} pWidth={'100%'} pHeight={100} paragraphStyles={{ borderRadius:10 }} />
                  </View>
                ))
              }
             </View>
              <View style={{ marginVertical:20 }}>
               <ContentLoader active pRows={1} pHeight={50} />
               <ContentLoader active pRows={1} pHeight={10} titleStyles={{ marginTop:20 }} pWidth={100} />
               <ContentLoader active pRows={1} pHeight={10} titleStyles={{ marginTop:20 }} pWidth={100} />
              </View>
            </>
            :
          <>
          <TouchableOpacity onPress={openGoogleMaps}>
            <View style={styles.button}>
              <Text style={{ color:colors.white,fontFamily:'viga' }}>View Directions on Map</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection:'row',justifyContent:'center',marginVertical:20 }}>
            <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.infoBox}>
              <Feather name="user" size={20} color={colors.grey} />
              <Text style={{ color:colors.grey }}>{num_of_cleaner}</Text>
              <Text style={{...styles.infoBoxText, marginVertical:5,color:colors.grey }} numberOfLines={1}>Cleaners</Text>
              <Text style={{ color:colors.grey }} numberOfLines={1}>{cleanerSlotsLeft} slots left</Text>
            </LinearGradient>
            <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.infoBox}>
              <Feather name="user" size={20} color={colors.white} />
              <Text style={{ color:colors.grey }}>{num_of_supervisor}</Text>
              <Text style={{...styles.infoBoxText, marginVertical:5,color:colors.grey }} numberOfLines={1}>Supervisors</Text>
              <Text style={{ color:colors.grey }} numberOfLines={1}>{supervisorSlotsLeft} slots left</Text>
            </LinearGradient>
            <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.infoBox}>
              <Feather name="user" size={20} color={colors.white} />
              <Text style={{...styles.infoBoxText,color:colors.grey}} numberOfLines={1}>Trainee</Text>
            </LinearGradient>
          </View>
          <View style={{ marginVertical:20 }}>
            {/* /change this rating back to 50 */}
            {
              !cleanerFilled &&
              <>
                <View>
                  <View style={styles.subInfo}>
                    <Entypo name="calendar" size={14} color="black" />
                    <Text style={{ opacity:0.6,margin:5 }}>Deadline</Text>
                  </View>
                  <Text style={{ ...styles.infoBoxText,marginVertical:5,fontSize:12,width:300,fontWeight:'normal' }}>Apply before <Text style={{ fontWeight:'bold' }}>{moment(Number(deadline)).format('MMMM Do, YYYY')}</Text> to increase your job recommendations</Text>
                </View>
                <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.line} />
              </>
            }
            {
              rating < 10 &&
              <View>
                <View style={styles.subInfo}>
                  <Entypo name="location-pin" size={14} color="black" />
                  <Text style={{ opacity:0.6,margin:5 }}>Address</Text>
                </View>
                <Text style={{...styles.infoBoxText,marginVertical:5,fontSize:16 }}>{address.street_number}, {address.street_name}, {address.city}, {address.state}</Text>
              </View>
            }
            <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.line} />
            <View>
              <View style={styles.subInfo}>
                <Entypo name="calendar" size={14} color="black" />
                <Text style={{ opacity:0.6,margin:5 }}>Day</Text>
              </View>
              <Text style={{ ...styles.infoBoxText,marginVertical:5,fontSize:16,width:300 }}>On {moment(Number(next_cleaning_order)).format('Do - MMMM - YYYY')}</Text>
            </View>
            <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.line} />
            <View>
              <View style={styles.subInfo}>
                <AntDesign name="clockcircle" size={14} color="black" />
                <Text style={{ opacity:0.6,margin:5 }}>Time</Text>
              </View>
              <Text style={{ ...styles.infoBoxText,marginVertical:5,fontSize:16,textTransform:'none' }}>By {moment(Number(next_cleaning_order)).format('h:mm a')}</Text>
            </View>
            <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.line} />
          </View>
          {/* {
            !cleanerFilled && !supervisorFilled && rating < 50 && rating > 10 &&
            <TouchableNativeFeedback onPress={registerTrainee}>
              <View style={{...styles.button,backgroundColor:colors.purple}}>
                <Text style={styles.btnText}>Apply as trainee</Text>
              </View>
            </TouchableNativeFeedback>
          } */}
          {
            cleanerFilled ?
              null
            :
            // change this rating back to 50
            cleanerSlotsLeft < 1 ? 
              <View style={{...styles.button, opacity:0.6}}>
                <Text style={styles.btnText}>Apply as cleaner</Text>
              </View>
            :
            <TouchableOpacity onPress={() => addCleaner('cleaner')}>
              <View style={styles.button}>
                <Text style={styles.btnText}>Apply as cleaner</Text>
              </View>
            </TouchableOpacity>
          }
          {
            supervisorFilled ?
            <TouchableNativeFeedback onPress={() => navigation.navigate('Teammates', { enterprise_id:route.params.item.id })}>
              <View style={{...styles.button, backgroundColor:colors.purple}}>
                <Text style={styles.btnText}>View Teammates</Text>
              </View>
            </TouchableNativeFeedback>
            :
            supervisorSlotsLeft < 1 || rating < 500 ?
            <View style={{...styles.button, backgroundColor:colors.lightPurple}}>
              <Text style={styles.btnText}>Apply as supervisor</Text>
            </View>
            :
            <TouchableNativeFeedback onPress={() => addCleaner('supervisor')}>
              <View style={{...styles.button, backgroundColor:colors.purple}}>
                <Text style={styles.btnText}>Apply as supervisor</Text>
              </View>
            </TouchableNativeFeedback>
          }
          </>
          }
        </View>
        </bonusScrollView.ScrollView>
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  avatar:{
    borderRadius:50,
    backgroundColor:colors.black,
    height:60,
    alignItems:'center',
    justifyContent:'center',
    width:60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom:10
  },
  imgBtn:{
    backgroundColor:'rgba(255,255,255,1)',
    padding:5,
    justifyContent:'center',
    width:40,
    height:40,
    elevation:3,
    alignItems:'center',
    borderRadius:10,
    zIndex:1,
    margin:10,
  },
  bottomSheetContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8
  },
  button:{
    backgroundColor:colors.black,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    width:'100%',
    alignSelf:'center',
    borderRadius:10,
    marginVertical:10
  },
  btnText:{
    color:colors.white,
    letterSpacing:1,
    fontFamily:'viga'
  },
  infoBox:{
    width:'30%',
    padding:10,
    alignItems:'center',
    marginHorizontal:10,
    borderWidth:0,
    borderColor:colors.purple,
    borderRadius:10,
    justifyContent:'space-between'
  },
  infoBoxText:{
    fontWeight:'bold',
    width:'80%',
    marginVertical:10,
    textTransform:'capitalize'
  },
  subInfo:{
    flexDirection:'row',
    width:'20%',
    alignItems:'center'
  },
  lottie: {
    width: 100,
    height: 100
  },
  line:{
    borderWidth:1,
    height:3,
    width:'100%',
    borderColor:colors.grey,
    marginVertical:5
  },
})