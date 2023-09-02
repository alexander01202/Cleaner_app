import { StyleSheet, Text, View,Dimensions,Image, Animated,Platform, Modal, TouchableOpacity } from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";
import Constants from 'expo-constants';

import StartUpScreen from './screens/StartUpScreen';
import AuthReducer from './redux/reducer/AuthReducer'
import CleanerOrderReducer from './redux/reducer/CleanerOrder';
import MapPreview from './pages/MapPreview'
import Settings from './pages/Settings'
import Support from './pages/support'
import Dashboard from './pages/cleanerPages/Dashboard'
import Walkthrough from './pages/cleanerPages/Walkthrough'
import CompanyAccountPage from './pages/CompanyAccountPage'
import RegisterAgent from './pages/AgentPages/RegisterAgent';
import AgentDashboard from './pages/AgentPages/AgentDashboard';
import ListOfChats from './pages/UserChats/ListOfChats';
import ChatPage from './pages/UserChats/ChatPage';
import HomeHeader from './components/headerComp/HomeHeader';
import UpdateAppModal from './pages/UpdateAppModal'

import Firstpage from './pages/firstpage';
import Login from './pages/AuthPages/Login';

import { createStore,combineReducers,applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import ReduxThunk from 'redux-thunk'
import messaging from '@react-native-firebase/messaging';
import { Buffer } from "buffer";
import * as Sentry from 'sentry-expo';

import 'react-native-gesture-handler';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Feather,MaterialIcons,AntDesign,Entypo,FontAwesome,Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationContainer,DefaultTheme, useNavigation } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets,CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import notifee from '@notifee/react-native';
// or with require() syntax:
// const mixpanel = require('mixpanel-browser');

import { CometChat } from '@cometchat-pro/react-native-chat'
import Rusha from 'rusha';
import * as ImagePicker from 'expo-image-picker';
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable';

import { useAssets,Asset } from 'expo-asset'
import * as Font from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { colors } from './colors/colors';
import LocationReducer from './redux/reducer/Location';
import HirePeriod from './pages/cleanerPages/HirePeriod';
import FutureOrder from './pages/cleanerPages/FutureOrder';
import PastOrders from './pages/cleanerPages/PastOrders';
import DirectionMapView from './pages/cleanerPages/MapView';
import RequestPages from './pages/cleanerPages/RequestPages';
import Overview from './pages/cleanerPages/enterprise/Overview';
import ApplySuccess from './pages/cleanerPages/enterprise/applySuccess';
import JobList from './pages/cleanerPages/listJobs/JobList';
import Teammates from './pages/cleanerPages/listJobs/Teammates';

import { Chat, OverlayProvider,ChannelList } from 'stream-chat-expo';
import { StreamChat } from 'stream-chat';
import { AllKeys } from './keys/AllKeys';
import MyModal from './components/modal';
import ListOfSpaces from './pages/cleanerPages/activeOrder/ListOfSpaces';
import EachSpace from './pages/cleanerPages/activeOrder/EachSpace';
import Task from './pages/cleanerPages/activeOrder/Task';
import ForgottenPwd from './pages/AuthPages/ForgottenPwd';
import ResetPwd from './pages/AuthPages/Reset-Pwd';
import Guarantor from './pages/cleanerPages/Guarantor';
import SecondGuarantor from './pages/cleanerPages/SecondGuarantor';

Sentry.init({
  dsn: "",
  enableInExpoDevelopment: true,
  enableNative: false,
  debug: __DEV__ ? true : false, 
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: __DEV__ ? 1.0 : 0.3,
})
const persistConfig = {
  key: 'root',
  storage:AsyncStorage,
}
const rootReducers = combineReducers({
  login:AuthReducer,
  location: LocationReducer,
  cleanerOrder:CleanerOrderReducer
})

const Tab = createMaterialTopTabNavigator();
const Tabs = createBottomTabNavigator();

const persistedReducer = persistReducer(persistConfig, rootReducers)
const AllReducers = createStore(persistedReducer,applyMiddleware(ReduxThunk))
let persistor = persistStore(AllReducers)

const {width, height } = Dimensions.get('window')
export default function App() {
  const [isReady,setIsReady] = useState(false)
  // const [assets, error] = useAssets([require('./assets/agent2.png')])
  const [showAvatarReminderModal, setShowAvatarReminderModal] = useState(false)
  const [getAuth,setAuth] = useState(null)
  const [role,setRole] = useState('worker')
  const [image, setImage] = useState(null);
  const [cleanerWalkthrough,setCleanerWalkthrough] = useState('incompleted')
  const [userDets, setUserDets] = useState({ AuthIsReady:false })
  const [streamChatConnected, setStreamChatConnected] = useState(false)
  const [avatarReminderCheck, setAvatarReminderCheck] = useState(null)
  const [initialChannelId, setInitialChannelId] = useState(null)
  const [updateApp, setUpdateApp] = useState(false)
  const nav = useRef()
  const onboardNav = useRef()
  const url = Linking.useURL();

  useEffect(() => {
    if (url && !userDets.AuthIsReady) {
      // console.log(Linking.parse(url))
      const verifyTokenValid = async() => {
        const { queryParams,path } = Linking.parse(url);
        if (queryParams.token) {
          const { email,id,token } = queryParams
          const req = await fetch(`${AllKeys.ipAddress}/verifyRestPwd?id=${Number(id)}&token=${token}`)
          const { success } = await req.json()
          
          if (success) {
            onboardNav.current?.navigate(`${path}`, { userEmail:email,id })
          }else{
            showMessage({
              type:'danger',
              message:'Error',
              description:'Link has expired',
              duration:3000
            })
          }
        }
      }
      verifyTokenValid()
    }  
  
  }, [onboardNav,url,userDets])
  
  useEffect(() => {
    const compareVersion = async() => {
      const req = await fetch(`${AllKeys.ipAddress}/checkBlipmooreCleanerVersion?ninKey=${AllKeys.verifyNINKey}&url=${AllKeys.ipAddress}&dev=${__DEV__}&version=${Application.nativeApplicationVersion}`)
      const { success } = await req.json()
      if (!success) {
        setUpdateApp(true)
      }else{
        setUpdateApp(false)
      }
    }
    compareVersion()
  }, [])
  useEffect(() => {
    if (nav.current) {
      bootstrap()
      if(Platform.OS == 'ios'){
      const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
        // Notification caused app to open from background state on iOS
        const channelId = remoteMessage.data?.channel_id;
        // The navigation logic, to navigate to relevant channel screen.
        if (channelId) {
          nav.current?.navigate('Chats', { channelId });
        }
      });
      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // Notification caused app to open from quit state on iOS
          const channelId = remoteMessage.data?.channel_id;
          // Start the app with the relevant channel screen.
          setInitialChannelId(channelId)
        }
      });
      }else{
        notifee.onBackgroundEvent(async ({ detail, type }) => {
          if (type === EventType.PRESS) {
            // user press on notification detected while app was on background on Android
            const channelId = detail.notification?.data?.channel_id;
            if (channelId) {
               nav.current?.navigate('Chats', { channelId });
            }
            await Promise.resolve();
          }
        });
      
        notifee.getInitialNotification().then(initialNotification => {
          if (initialNotification) {
            // Notification caused app to open from quit state on Android
            const channelId = initialNotification.notification.data?.channel_id;
            // Start the app with the relevant channel screen.
            setInitialChannelId(channelId)
          }
        });
      }
    }
  }, [nav.current]);
  
  useEffect(() => {
    let unsubscribeTokenRefreshListener;
    // Register FCM token with stream chat server.
    
    const fetchUserChatToken = async() => {
      // const { id,displayName } = userDets
      // const req = await fetch(`${AllKeys.ipAddress}/getUserToken?userid=${id}`)
      // const { token } = await req.json()
      // await client.connectUser(
      //     {
      //         id: `${id}`,
      //         name: `${displayName}`,
      //         image: `https://getstream.io/random_svg/?name=${displayName}`,
      //     },
      //    `${token}`,
      // );
      await requestPermission();
      // await registerPushToken(id);
    }
    if (userDets && !streamChatConnected) {
      fetchUserChatToken() 
      setStreamChatConnected(true)
    }
    return async() => {
      unsubscribeTokenRefreshListener?.()
    }
  }, [userDets,streamChatConnected])
  // Bootstrap sequence function
  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      nav.current.navigate('ActiveJobs')
      console.log('Notification caused application to open', initialNotification.notification);
      console.log('Press action used to open the app', initialNotification.pressAction);
    }
  }
  // Request Push Notification permission from device.
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
useEffect(() => {
  const unsubscribe = AllReducers.subscribe(() => {
    var newAuth = AllReducers.getState().login
    if (newAuth.user_img) {
      setAvatarReminderCheck(true)
      setImage(newAuth.user_img)
    }
    if (getAuth != AllReducers.getState().login.AuthIsReady) {
        setUserDets(newAuth)
        setRole(newAuth.role)
        unsubscribe()
        setAuth(newAuth.AuthIsReady)
    }
    if (role !== newAuth.role) {
        setRole(newAuth.role)
    }
  })

  return () => {
    unsubscribe()
  }
}, [getAuth])
useEffect(() => {
  // Fetch User Profile Image
  const fetchUserImage = async() => {
    const { cleaner_id,displayName } = userDets
      const encode = await fetch(`${AllKeys.ipAddress}/encode?string=${AllKeys.BACKBLAZE_APPLICATION_KEY_ID + ':' + AllKeys.BACKBLAZE_APPLICATION_KEY }`)
      const encodeRes = await encode.text()

      const authBackBlaze = await fetch(`https://api.backblazeb2.com/b2api/v2/b2_authorize_account`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json; charset=utf-8',
              'Authorization': `Basic ${encodeRes}`
          },
      })
      const { apiUrl,authorizationToken } = await authBackBlaze.json()
      var req = await fetch(`${apiUrl}/b2api/v2/b2_list_file_names`, {
          method: 'POST',
          headers: {
              "Authorization": `${authorizationToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              bucketId : __DEV__ ? "" : "",
              prefix: `avatar/${displayName}${cleaner_id}`
          })
      })
      var res = await req.json()
      if (res.files.length > 0) {
        setImage(`https://f004.backblazeb2.com/file/${__DEV__ ? 'blipmooretest' : 'blipmoore-cleaner'}/` + res.files[0].fileName)
      }else{
        setShowAvatarReminderModal(true)
      }
      if (userDets.AuthIsReady) {
        setAvatarReminderCheck(true) 
      }
  }
  if (userDets.AuthIsReady && !avatarReminderCheck) {
    fetchUserImage() 
  }
}, [userDets.AuthIsReady,avatarReminderCheck])

useEffect(() => {
  const checkUserExist = async(id) => {
    const res = await fetch(`${AllKeys.ipAddress}/fetchCleaner?id=${id}`)
    const { success } = await res.json()
    if (success) {
      return
    }else{
      CometChat.logout().then(
        () => {
          console.log("Logout completed successfully");
        },error=>{
          console.log("Logout failed with exception:",{error});
        }
      );
      AsyncStorage.removeItem('userData')
      setAuth(false)
      setUserDets(false)
    }
  }
  // userDets && !checkOrder
  if (userDets && userDets.AuthIsReady) {
    checkUserExist(userDets.id)
    var UID = `${userDets.id}` + `${userDets.cleaner_id}` ;
    var authKey = AllKeys.COMET_AUTH_KEY;
    CometChat.getLoggedinUser().then(
      user => {
        if(!user){
          CometChat.login(UID, authKey).then(
            user => {
              console.log("Login Successful:", { user });
            }, error => {
              console.log("Login failed with exception:", { error });
            }
          );
        }
      }, error => {
        console.log("Something went wrong", error);
      }
    ); 
  }
}, [userDets])

const pickImage = async () => {
  const { cleaner_id,displayName,id } = userDets
  setShowAvatarReminderModal(false)
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1.91, 1],
    exif:true,
    base64:true,
    quality: 1,
  });
  if (!result.cancelled && result.uri) {
      // FileSystem.read
      const fileAsync = await fetch(`${AllKeys.ipAddress}/readFileName?uri=${result.uri}`)
      const fileName = await fileAsync.text()
      const binaryImage = Buffer.from(result.base64, 'base64')
      const digest = Rusha.createHash().update(binaryImage).digest('hex'); 
  setImage(result.uri);
  const encode = await fetch(`${AllKeys.ipAddress}/encode?string=${AllKeys.BACKBLAZE_APPLICATION_KEY_ID + ':' + AllKeys.BACKBLAZE_APPLICATION_KEY}`)
  const encodeRes = await encode.text()
  var res = await fetch(`https://api.backblazeb2.com/b2api/v2/b2_authorize_account`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;charset=utf-8',
        "Authorization": "Basic "+ encodeRes
      },
  })
  let authRes = await res.json()
  res = await fetch(`${authRes.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
          "Authorization": `${authRes.authorizationToken}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          bucketId : __DEV__ ? "" : ""
      })
  })
  let { uploadUrl,authorizationToken } = await res.json()
  const uploadImage = await fetch(`${uploadUrl}`, {
      method:'POST',
      headers:{
          'Authorization': `${authorizationToken}`,
          'Content-Type' : 'b2/x-auto',
          'X-Bz-File-Name':`avatar/${displayName}${cleaner_id}/${fileName}`,
          'X-Bz-Content-Sha1' : `${digest}`,
          
      },
      body: binaryImage
  })
  const img = await uploadImage.json()
 
  }
};

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ justifyContent:'center',alignItems:'center' }}>
          <Image style={{ width:'60%',height:100 }} resizeMode={'contain'} source={{uri:'https://f004.backblazeb2.com/file/blipmoore-cleaner/logo.png'}}/>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }
  // const checkWalkthrough = async() => {
  //   const userData = await AsyncStorage.getItem('userData')
  //     if (userData) {
  //       const transformedData = JSON.parse(userData)
  //       const { walkthrough } = transformedData
  //       setCleanerWalkthrough(walkthrough)
  //     }
  //   }
  // checkWalkthrough()
  
function AllOrders() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle:{letterSpacing:1, fontFamily:'viga'},
        tabBarInactiveTintColor:colors.black,
        tabBarActiveTintColor:colors.purple,
        tabBarStyle:{borderRadius:10, backgroundColor:colors.white,overflow:'hidden', margin:10},
        tabBarIndicatorContainerStyle:{padding:5},
        tabBarIndicatorStyle:{backgroundColor:colors.grey,height:'100%',margin:5,borderRadius:10},
        tabBarPressColor:colors.whitishBlue,
      }}
    >
      <Tab.Screen options={{
        tabBarContentContainerStyle:{ padding:5 },
        title:'Future Orders'
      }} name="FutureOrder" component={FutureOrder} />
      <Tab.Screen options={{ 
        tabBarContentContainerStyle:{ padding:5 },
        title:'Past Orders'
       }} name="PastOrders" component={PastOrders} />
    </Tab.Navigator>
  );
}
const forSlide = ({ current, next, inverted,index, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          scaleY: Animated.multiply(
            progress.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [
                0, // Focused, but offscreen in the beginning
                1, // Fully focused
                1, // Fully unfocused
              ],
              extrapolate: 'clamp',
            }),
            inverted
          ),
        },
      ],
    },
  };
};
const Enterprise = (props) => {
  return(
    <Stack.Navigator>
      <Stack.Screen options={{ cardStyleInterpolator:forSlide,headerShown:true,headerTitleStyle:{fontFamily:'viga'},headerTitle:'Request Page',headerBackImage: () => <AntDesign name="arrowleft" size={24} color="black" /> }} name="RequestPage" component={RequestPages} />
      <Stack.Screen options={{ headerShown:false }} name='Overview' component={Overview} />
      <Stack.Screen options={{ cardStyleInterpolator:forSlide }} name="Teammates" component={Teammates} />
      <Stack.Screen options={{ headerShown:false }} name='ApplySuccess' component={ApplySuccess} />
    </Stack.Navigator>
  )
}
const TabButton = (props) => {
  const {item, onPress, accessibilityState,focusIcon,icon,iconType} = props
  const focused = accessibilityState.selected
  const viewRef = useRef(null)

  useEffect(() => {
    if (focused) {
      viewRef.current.bounceIn(1000)
    }
  }, [focused])
  
  return (
    <TouchableOpacity onPress={onPress} style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
      <Animatable.View duration={200} ref={viewRef} animation={'zoomIn'}>
        {
          iconType === 'materialIcons'
          ?
          <MaterialIcons name={focused ? focusIcon : icon} size={24} color={colors.black} />
          :
          <Ionicons name={focused ? focusIcon : icon} size={24} color={colors.black} />
        }
      </Animatable.View>
    </TouchableOpacity>
  )
}
const BottomTabsNav = () => (
  <Tabs.Navigator
    screenOptions={{
      tabBarShowLabel:false,
      tabBarStyle:{
        position:'relative',
        bottom:20,
        marginHorizontal:10,
        paddingHorizontal:10,
        borderRadius:10
      }
    }}
  >
    <Tabs.Screen options={{ 
       headerShown:false,
      tabBarIcon: ({ size,focused }) => (
        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={colors.black} /> 
      ),
      tabBarButton: (props) => <TabButton {...props} focusIcon={'home'} icon={'home-outline'} />
    }} name="Home" component={UserDashboard} />
    <Tabs.Screen
    options={{
      headerShown:false,
      tabBarIcon: ({ size,focused }) => (
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
       ),
      tabBarButton: (props) => <TabButton {...props} focusIcon={'chatbubble-ellipses'} icon={'chatbubble-ellipses-outline'} />
     }} name="Chats"  component={UserChats} />
     <Tabs.Screen
        options={{
         headerShown:false,
        tabBarButton: (props) => <TabButton {...props} iconType={'materialIcons'} focusIcon={'work'} icon={'work-outline'}/>
      }} name="ActiveJobs" component={ActiveJobs} />
     <Tabs.Screen
     options={{
      headerShown:false,
      tabBarButton: (props) => <TabButton {...props} focusIcon={'person'} icon={"person-outline"}/>
    }} name="Profile" component={Settings} />
  </Tabs.Navigator>
)
const UserDashboard = (props) => {
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown:false,
      }}
    >
      <Stack.Screen options={{ cardStyleInterpolator:forSlide }} name="UserDashboard" >
        {props => (
          <Dashboard pickImage={pickImage} image={image} {...props} />
        )}
      </Stack.Screen>
      {/* <Stack.Screen options={{ cardStyleInterpolator:forSlide}} name="HirePeriod" component={HirePeriod} /> */}
      <Stack.Screen options={{ 
        headerShown:true,
        header: (props) => (
          <View style={{ flexDirection:'row',alignItems:'center',padding:15 }}>
            <TouchableOpacity onPress={() => props.navigation.pop()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ marginHorizontal:30 }}>
              <Text style={{ fontFamily:'viga',color:colors.black,fontSize:22 }}>All orders</Text>
            </View>
          </View>
        )
       }} name="AllOrders" component={AllOrders} />
      <Stack.Screen options={{}} name="CompanyAccountPage" component={CompanyAccountPage} />
      <Stack.Screen options={{ cardStyleInterpolator:forSlide, headerShown:true,headerTitle:'Selected Spaces' }} name="ListOfSpaces" component={ListOfSpaces} />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }} name="Space" component={EachSpace}/>
      <Stack.Screen
        options={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }} name="Guarantor" component={Guarantor}/>
      <Stack.Screen
        options={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }} name="SecondGuarantor" component={SecondGuarantor}/>
      <Stack.Screen
        options={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }} name="Task" component={Task}/>
      <Stack.Screen options={{ cardStyleInterpolator:forSlide}} name='Enterprise' component={Enterprise} />
      <Stack.Screen options={{}} name="DirectionMapView" component={DirectionMapView} />
    </Stack.Navigator> 
  )
}
  const UserChats = () => {
    return(
      <Stack.Navigator>
        <Stack.Screen channelId={initialChannelId} options={{ headerShown: false}} name="ListOfChats" component={ListOfChats} />
      </Stack.Navigator>
    )
  }
  const ActiveJobs = () => {
    return(
      <Stack.Navigator
        screenOptions={{
          headerShown:false,
        }}
      >
        <Stack.Screen name="JobList" component={JobList} />
      </Stack.Navigator>
    )
  }
  const _loadAssetsAsync = async() => {
    FastImage.preload([
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore-cleaner/agent2.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore-cleaner/upwardmoney.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore/app+images/signup-page.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore-cleaner/medal.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore-cleaner/jobsearch.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background2_purple.png',
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png',
        headers: { Authorization: 'someAuthToken' },
      },
      {
        uri: 'https://f004.backblazeb2.com/file/blipmoore-cleaner/potofcoin.png',
        headers: { Authorization: 'someAuthToken' },
      },
  ])
    const imageAssets =  cacheImages([
     'https://f004.backblazeb2.com/file/blipmoore-cleaner/upwardmoney.png',
     'https://f004.backblazeb2.com/file/blipmoore-cleaner/potofcoin.png',
     'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background_purple.png',
     'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background2_purple.png',
     'https://f004.backblazeb2.com/file/blipmoore/app+images/login_background3_purple.png',
     'https://f004.backblazeb2.com/file/blipmoore-cleaner/jobsearch.png',
     'https://f004.backblazeb2.com/file/blipmoore-cleaner/medal.png',
     'https://f004.backblazeb2.com/file/blipmoore-cleaner/upwardmoney.png'
    ]);
    // const cacheImages = imageAssets.map(image => {
    //   return Asset.fromModule(image).downloadAsync();
    // });
    function cacheImages(images) {
      return images.map(image => {
        if (typeof image === 'string') {
          return Image.prefetch(image);
        } else {
          return Asset.fromModule(image).downloadAsync();
        }
      });
    }
    function cacheFonts(fonts) {
      return fonts.map(font => Font.loadAsync(font));
    }
    const fontAssets = cacheFonts([FontAwesome.font,Ionicons.font,Entypo.font,MaterialCommunityIcons.font,Feather.font]);
  
    await Promise.all([...imageAssets,...fontAssets])
  }
  const Drawer = createDrawerNavigator();
  let [fontsLoaded] = useFonts({
    'Itim': require('./Fonts/Itim-Regular.ttf'),
    'viga': require('./Fonts/Viga-Regular.ttf'),
    'Murecho': require('./Fonts/Murecho-SemiBold.ttf'),
    'LilitaOne': require('./Fonts/LilitaOne-Regular.ttf'),
    'Lalezar': require('./Fonts/Lalezar-Regular.ttf'),
    'UnicaOne': require('./Fonts/UnicaOne-Regular.ttf'),
    'Funzi': require('./Fonts/Funzi.ttf'),
    'Magison': require('./Fonts/Magison.ttf')
  });
  if(!fontsLoaded || !isReady){
    return <AppLoading 
      startAsync={_loadAssetsAsync}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
    />
  }else{
    return (
      <Provider store={AllReducers}>
        <PersistGate loading={null} persistor={persistor}>
        {
          getAuth === null || !isReady
          ?
          <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{
                headerShown: false,
              }}
            >
            <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
            </Stack.Navigator>
         </NavigationContainer>
         :
         getAuth && avatarReminderCheck ?
         <>
         <UpdateAppModal UpdateApp={updateApp} />
         <MyModal changeModal={null} modalFunc={pickImage} action={'Upload'} modalVisible={showAvatarReminderModal} heading={'Please upload your profile picture.'} />
         <NavigationContainer ref={nav}>
           <Drawer.Navigator initialRouteName='HomePage' screenOptions={{drawerLabelStyle:{color:colors.white,fontFamily:'viga'}, drawerStyle:{backgroundColor:colors.black} }} drawerContent={(props) => <CustomDrawerContent {...props} />}>
             <Drawer.Screen
             options={{
               drawerIcon: ({ size,focused }) => (
                 <Feather name="home" size={size} color={focused ? colors.yellow : colors.white} />
               ),
               headerShown:false,
             }}
             name="HomePage" component={BottomTabsNav} />
             {
               role !== 'agent' ?
               null
              :
              <Drawer.Screen 
               options={{
                drawerIcon: ({ size,focused }) => (
                  <AntDesign name="team" size={size} color={focused ? colors.yellow : colors.white} />
                ),
              }}
              name="Agent Dashboard" component={AgentDashboard} />
             }
             <Drawer.Screen 
              options={{
              headerTitleStyle: {fontFamily:'viga'},
              drawerLabel:'Change Work Hours',
              headerShown:false,
               drawerIcon: ({ size,focused }) => (
                 <MaterialIcons name="published-with-changes" size={size} color={focused ? colors.yellow : colors.white} />
               ),
             }}
             name="HirePeriod" component={HirePeriod} />
            <Drawer.Screen 
              options={{
              headerTitleStyle: {fontFamily:'viga'},
              headerShown:false,
               drawerIcon: ({ size,focused }) => (
                 <MaterialIcons name="support-agent" size={size} color={focused ? colors.yellow : colors.white} />
               ),
             }}
             name="Support" component={Support} />
           </Drawer.Navigator>
          </NavigationContainer>
          </>
        :
        !getAuth ?
        <>
        <UpdateAppModal UpdateApp={updateApp} />
          <NavigationContainer ref={onboardNav}>
          <Stack.Navigator 
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                ...TransitionPresets.SlideFromRightIOS,
              }}
            >
            <Stack.Screen name="firstPage" component={Firstpage} />
            {/* <Stack.Screen name="SignUpForm" component={SignUpForm} /> */}
            <Stack.Screen name="LoginPage" component={Login} />
            <Stack.Screen name="ForgottenPwd" component={ForgottenPwd} />
            <Stack.Screen name="ResetPwd" component={ResetPwd} />
            {/* <Stack.Screen name="SignupPage" component={Signup} /> */}
          </Stack.Navigator>
          </NavigationContainer>
        </>
        :
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerShown: false,
            }}
          >
           <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        }
        <FlashMessage duration={2000} position="bottom" />
        </PersistGate>
      </Provider>
    );
  }
}
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
