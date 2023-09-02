import React, { useState, useEffect,useRef } from 'react'
import { View,StyleSheet,Text,ActivityIndicator,Dimensions,TouchableOpacity,Easing,Alert,Vibration,Platform } from 'react-native'
import Animated, { color } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { colors } from '../colors/colors';
import MapView,{ Marker,PROVIDER_GOOGLE } from 'react-native-maps'
import { TapGestureHandler } from 'react-native-gesture-handler';
import * as TaskManager from 'expo-task-manager';

import { useDispatch } from 'react-redux';
import { LOCATION } from '../redux/actions/actions';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import AnimatedLoader from 'react-native-animated-loader';

import { GOOGLE_MAPS_APIKEY } from '../apikey';
import MapViewDirections from 'react-native-maps-directions';
import Default from '../component/default';
import MyModal from '../components/modal';
import ViewBox from '../component/viewBox';
import { AllKeys } from '../keys/AllKeys';


const {width,height} = Dimensions.get('window')

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

export default function CleanerMapPreview({ route,navigation }) {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [error,setError] = useState(null)
    const [isPending,setIsPending] = useState(false)
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [runLocation,setRunLocation] = useState(true)
    const locationInterval = useRef()
    const orderStatusInterval = useRef()
    const compareLocation = useRef()
    const [customerLocation,setCustomerLocation] = useState({ latitude:null,longitude:null })
    const [customerOrderState,setCustomerOrderState] = useState('order')
    const [customerOrderInfo, setCustomerOrderInfo] = useState(null)
    const mapRef = useRef(null)

    const dispatch = useDispatch()
    const selector = useSelector(state => state.location)
    const login = useSelector(state => state.login)
    const { active,orderId,address } = useSelector(state => state.cleanerOrder)

    useEffect(async() => {
      const getNotificationId = async() => {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge:true,
          }),
        });
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
            allowCriticalAlerts: true,
          }
        }).then(async() => {
          if (Platform.OS === 'ios') {
            const checkNotificationStatus = await Notifications.getPermissionsAsync()
            if (!checkNotificationStatus.status || checkNotificationStatus.ios.status !== Notifications.IosAuthorizationStatus.AUTHORIZED) {
              throw new Error('Did not allow notifications')
            } 
          }
        }).then(() => {
          return Notifications.getExpoPushTokenAsync()
        }).then(response => {
          const notificationId = response.data
          fetch(`${AllKeys.ipAddress}/updateNotificationId?notificationId=${notificationId}&id=${login.id}`)
        })
      }
      getNotificationId()
      if (Platform.OS === 'android') {
       await Notifications.deleteNotificationChannelAsync('order1')
        Notifications.setNotificationChannelAsync("order2", {
          name: "order2",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 500, 750,1000,1250,1500,1750,2000,2250,2500,2750,3000,3250,3500,3750,4000,4250,4500,4750,5000,5250,5500,5750,6000,6250,6500,6750,7000],
          lightColor: "#FF231F7C",
          sound:'default',
          enableVibrate:true,
          lockscreenVisibility:1,
        })
        console.log(await Notifications.getNotificationChannelsAsync())
      }
    }, [])
    
    // Reacting to notifications
    useEffect(() => {
      Vibration.cancel()
      // Android apps should request the android.permission.VIBRATE permission by adding <uses-permission android:name="android.permission.VIBRATE"/> to AndroidManifest.xml.
      const ONE_SECOND_IN_MS = 1000;

      const PATTERN = [
        1 * ONE_SECOND_IN_MS,
        2 * ONE_SECOND_IN_MS,
        3 * ONE_SECOND_IN_MS
      ];
      TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
        console.log('Received a notification in the background!');
        // Do something with the notification data
      });
      
      Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(async(response) => {
        Vibration.cancel()
        const { orderId,customerId,customerName,number,ssa,msa,lsa,elsa,cleaningType,amount,address,cleanerId } = response.notification.request.content.data
        setCustomerOrderInfo(response.notification.request.content.data)
        const getOrderStatus = await fetch(`${AllKeys.ipAddress}/checkOrderExist?orderId=${orderId}`)
        const { rows,success } = await getOrderStatus.json()
        if (success && rows.state === 'accepted') {
          return
        }else{
          dispatch({ type:'CUSTOMER_ORDER',payload:{ orderId,active:true,address,number } })
          fetch(`${AllKeys.ipAddress}/updateOrderStatus?state=accepted&id=${orderId}&cleanerId=${cleanerId}`)
          fetch(`${AllKeys.ipAddress}/updateInvoice?invoice=${amount * 0.1}&cleanerId=${cleanerId}`)
          const fetchCusLocation = await fetch(`${AllKeys.ipAddress}/getCustomerLocation?customerId=${customerId}`)
          const { latitude,longitude } = await fetchCusLocation.json()
          setCustomerLocation({ latitude,longitude })
          setCustomerOrderState('accepted')
        }
      })
      const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
        // Vibration.vibrate(PATTERN, true)
      })
    
      return () => {
        foregroundSubscription.remove()
        backgroundSubscription.remove()
      }
    }, [])

    // Check if there's an active order
    useEffect(() => {
      const getOrder = async() => {
      if (active) {
        const CheckifOrderActive = await fetch(`${AllKeys.ipAddress}/checkOrderExist?orderId=${orderId}`)
        const { success,rows } = await CheckifOrderActive.json()
        if (success && rows.state !== 'completed' || rows.state !== 'declined') {
          const fetchCusLocation = await fetch(`${AllKeys.ipAddress}/getCustomerLocation?customerId=${rows.customer_id}`)
          const { row,success } = await fetchCusLocation.json()
          const { latitude,longitude,firstname,number,customer_id } = row
          setCustomerLocation({ latitude,longitude })
          setCustomerOrderInfo({ orderId,customerId:customer_id,customerName:firstname,number,ssa:rows.ssa,msa:rows.msa,elsa:rows.elsa,cleaningType:rows.cleaningType,address,amount:rows.amount })
          setCustomerOrderState(rows.state)
        }
      }
    }
    getOrder()
    }, [])
    useEffect(() => {
        const getUserLocations = async() => {
          const { id } = login
          let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setModalVisible({
                  show: true,
                  text: 'Please Enable Location to use this app'
                })
                return;
              }
              
              setIsPending(true)
              try {
                let { latitude,longitude } = (await Location.getCurrentPositionAsync({})).coords;
                const res = await fetch(`${AllKeys.ipAddress}/updateLocation?latitude=${latitude}&longitude=${longitude}&id=${id}`)
                const result = await res.json();
                if (result.success) {
                  dispatch(LOCATION(latitude,longitude))
                  setCurrentLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0012,
                    longitudeDelta: 0.002
                  }); 
                }
              } catch (err) {
                  setCurrentLocation(null)
                  setModalVisible({
                    show: true,
                    text: 'Could not fetch Location'
                  })
                  console.log(err.message)
              }
              setIsPending(false)
        }
      getUserLocations()
  
    }, [runLocation]);

    // second useEffect
    useEffect(() => {
      let Newlocation;
      
      if (currentLocation !== null) {
        locationInterval.current = setInterval(() => {
          a()
        }, 15000);
        const a = async() => {
          Newlocation = await Location.getCurrentPositionAsync({  })
          if(Newlocation.coords.latitude < (selector.latitude + 0.00001) && Newlocation.coords.longitude < (selector.longitude + 0.00001)){
           
          }else{
            console.log('Cleaner distance changed')
            const res = await fetch(`${AllKeys.ipAddress}/updateLocation?latitude=${Newlocation.coords.latitude}&longitude=${Newlocation.coords.longitude}&id=${login.id}`)
            dispatch(LOCATION(Newlocation.coords.latitude,Newlocation.coords.longitude))
          }
        }
      }
    
      return () => {
        clearInterval(locationInterval.current)
      };
    }, [currentLocation,runLocation]);

    useEffect(() => {
      let Newlocation;
      compareLocation.current = setInterval(async() => {
        Newlocation = await Location.getCurrentPositionAsync({ })
        // Check if cleaner has arrived
        if (customerOrderState === 'accepted') {
          if (Newlocation.coords.latitude < (Number(customerLocation.latitude) + 0.001) && Newlocation.coords.longitude < (Number(customerLocation.longitude) + 0.001)) {
            const res = await fetch(`${AllKeys.ipAddress}/updateOrderStatus?state=arrived&id=${orderId}&cleanerId=${login.id}`)
            const resultSuc = await res.json()
            if (resultSuc.success) {
              setCustomerOrderState('arrived')
              clearInterval(orderStatusInterval.current)
              clearInterval(locationInterval.current)
              clearInterval(compareLocation.current)
            }
          }
        }
      }, 3000);
    
    }, [customerOrderState])
    

    useEffect(() => {
    if (customerOrderState === 'accepted') {
      orderStatusInterval.current = setInterval(async() => {
        const getOrderStaus = await fetch(`${AllKeys.ipAddress}/checkOrderExist?orderId=${orderId}`)
        const { rows,success } = await getOrderStaus.json()
        if (!success) {
          clearInterval(locationInterval.current)
          clearInterval(orderStatusInterval.current)
          setModalVisible({
            show:true,
            text: 'This request has been cancelled by the customer.'
          })
          dispatch({ type:'CUSTOMER_ORDER',payload:{ orderId:null,active:false,address:null,number:null } })
          dispatch({ type:'START_ORDER', payload: { time:null,status:'inactive' } })
          setTimeout(() => {
            // navigation.navigate('UserDashboard')
            setCustomerOrderState('order')
          }, 3000);
          return
        }
        // Remember to proscheck
        if (success) {
          if (rows.cleaner_id !== login.id) {
            clearInterval(locationInterval.current)
            clearInterval(orderStatusInterval.current)
            setModalVisible({
              show:true,
              text: 'Sorry, Another Cleaner has already accepted this job'
            })
            setCustomerOrderState('order')
            return
          }
        }
      }, 3000);
    }
      return () => {
        clearInterval(orderStatusInterval.current)
      }
    }, [customerOrderState])
    
    
    // Third UseEffect
    useEffect(() => {
      if (!customerLocation || !selector ||!mapRef.current || customerOrderState !== 'accepted') { 
        setRunLocation(!runLocation) 
        return
      };
      setTimeout(() => {
        mapRef.current.fitToSuppliedMarkers(['origin','destination'], {
          edgePadding: {top: 50, right:50, left:50,bottom:50 },
        }) 
      }, 5000);
    }, [mapRef,customerOrderState])
    
    
    let markerLocation;
    if(currentLocation !==  null){
        markerLocation = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
        }
    }
    const changeModal = (show,text) => {
      setModalVisible({
        show:show,
        text: text
      })
    }

    const changeOrderState = (state) => {
      setCustomerOrderState(state)
    }
  return (
      <>
        {currentLocation === null ? 
          isPending ? 
            <AnimatedLoader 
              visible={isPending}
              overlayColor="rgba(255,255,255,0.75)"
              source={require('../lottie/circle2.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
          :
          <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
            <Text style={{ fontFamily:'viga',fontSize:18 }}>Please Enable Your Location</Text>
              <TouchableOpacity onPress={() => setRunLocation(!runLocation)}>
                <View style={{ backgroundColor:colors.yellow,borderRadius:30,width:200,justifyContent:'center',alignItems:'center' }}>
                  <Text style={{ margin:20,color:colors.white,fontSize:16 }}>SET LOCATION</Text>
                </View>
              </TouchableOpacity>
          </View>
        : isPending ? 
          <AnimatedLoader 
            visible={isPending}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../lottie/circle-loader.json')}
            animationStyle={styles.lottie}
            speed={5}
          /> 
        : 
        <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={{ width:'100%',height:'80%' }} region={selector}>
          {
            customerOrderState === 'accepted' && customerLocation.latitude && customerLocation.longitude
            ?
            <MapViewDirections 
              origin={selector}
              destination={customerLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
            />
            : null
          }
            <Marker identifier='origin' coordinate={{latitude:selector.latitude,longitude:selector.longitude}}>
              <View style={styles.circle}/>  
              <View style={styles.stroke}/>  
              <View style={styles.core}/>  
            </Marker>
            {
              customerOrderState !== 'order' && customerLocation.latitude && customerLocation.longitude ?
              <Marker identifier='destination' coordinate={{latitude:Number(customerLocation.latitude),longitude:Number(customerLocation.longitude)}}>
                <View style={styles.circle}/>  
                <View style={styles.stroke}/>  
                <View style={{...styles.core,backgroundColor:colors.black}}/>  
              </Marker>
              :
              null
            }
          </MapView>}
          {currentLocation?  
            <>
              <MyModal changeModal={changeModal} modalVisible={modalVisible} />
              <View style={{ ...styles.view,backgroundColor:colors.black,width:'100%',height:height /3,zIndex:1,top:null }}>
                { 
                  customerOrderState === 'order' ? <Default /> : customerOrderState === 'pending' ? <SkeletonLoader changeOrderState={changeOrderState} /> : customerOrderState === 'accepted' || customerOrderState === 'started' || customerOrderState === 'arrived' ? <ViewBox login={login} customerOrderInfo={customerOrderInfo} customerOrderState={customerOrderState} changeOrderState={changeOrderState} /> : <Default />
                }
              </View>
            </>
            :
            null
          }
      </>
  );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor:colors.yellow,
        padding:20,
        width:'100%',
        height:'100%',
        alignSelf:'center',
        borderRadius:250,
        justifyContent:'center',
        alignItems:'center',
        elevation: 20,
        position:'absolute'
      },
      view: {
        flex: 1,
        justifyContent:'flex-end',
        bottom:0,
        position:'absolute',
        zIndex:0,
        width: '50%',
        height:'30%',
        alignSelf:'center',
      },
      text: {
        fontFamily:'viga',
        fontSize: 18,
        textAlign:'center',
        color:colors.black
      },
      circle: {
        width:26,
        height:26,
        borderRadius:50
      },
      stroke: {
        width:26,
        height:26,
        borderRadius:50,
        backgroundColor:'#fff',
        zIndex:1,
        position:'absolute'
      },
      core: {
        width:24,
        height:24,
        position:'absolute',
        top:1,
        left:1,
        right:1,
        bottom:1,
        backgroundColor:colors.yellow,
        zIndex:2,
        borderRadius:50
      },
      lottie: {
        width: 100,
        height: 100
      },
});

