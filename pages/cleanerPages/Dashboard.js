import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback,Modal,ScrollView,Switch,TouchableNativeFeedback } from 'react-native'
import React, { useEffect, useState,useCallback,useMemo,useRef, Fragment } from 'react'
import { Buffer } from "buffer";
import { SafeAreaView } from 'react-native-safe-area-context'
import Carousel from 'react-native-snap-carousel';
import { colors } from '../../colors/colors'
import { useIsFocused } from '@react-navigation/native';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import AnimatedLoader from 'react-native-animated-loader';
import LottieView from 'lottie-react-native';
import { Camera } from 'expo-camera';
import { Ionicons,FontAwesome,MaterialIcons,Fontisto,AntDesign,Octicons,Entypo } from '@expo/vector-icons';
import OneSignal from 'react-native-onesignal';
import notifee,{ AndroidCategory,AndroidImportance } from '@notifee/react-native';
import { useDispatch, useSelector } from 'react-redux'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as bonusScrollView from 'react-native-gesture-handler'
import ContentLoader from "react-native-easy-content-loader";
import MyModal from '../../components/modal';
import { AllKeys } from '../../keys/AllKeys';
import FastImage from 'react-native-fast-image'
import { showMessage, hideMessage } from "react-native-flash-message";
import Constants from "expo-constants";
import * as Location from  'expo-location'
import Rusha from 'rusha';
import { currency } from '../../currency/currency';
import { mixpanel } from '../../components/MixPanel'
import moment from 'moment';
import CleaningImagesModal from './components/CleaningImagesModal';
import ImageModal from './components/ImageModal';
import WarningModal from '../../components/WarningModal';
import TawkTo from '../webView/TawkTo';
import WebViewMainModal from '../webView/WebView';
import LgaModal from './components/LgaModal';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);
const { width,height } = Dimensions.get('window')

export default function Dashboard({ navigation,pickImage,image }) {
const { displayName, id,cleaner_id, lastName,rating,level,status,email,number,user_img } = useSelector(state => state.login)
const { city,state,street_name,street_number,estate,lga } = useSelector(state => state.location)
const dispatch = useDispatch()
const isFocused = useIsFocused();
const carousel = useRef(null)
const cameraRef = useRef(null)
const [photoUploadIsLoading,setPhotoUploadIsLoading] = useState(false)
const [starReview,setStarReview] = useState(0)
const [showCameraModal, setShowCameraModal] = useState(null);
const [cameraIsReady, setCameraIsReady] = useState(null);
const [type, setType] = useState(Camera.Constants.Type.back);
const [flash, setFlash] = useState(Camera.Constants.FlashMode.auto);
const [isPending, setIsPending] = useState(true)
const bottomSheetRef = useRef(null);
const anotherSnapPoints = useMemo(() => ['50%'], []);
const snapPoints = useMemo(() => ['70%'], []);
const [modalVisible,setModalVisible] = useState({ show:false, text:'' })
const [isHome, setIsHome] = useState(true)
const [isEnterprise, setIsEnterprise] = useState(false)
const [isOnline, setIsOnline] = useState(true)
const [activeOrder, setActiveOrder] = useState(null)
const [orderBegan, setOrderBegan] = useState(false)
const [beginCleaning, setBeginCleaning] = useState(null)
const [steps, setSteps] = useState({ one:'ongoing',two:false,three:false,four:false,five:false,six:false,seven:false,eight:false })
const [cusArr, setCusArr] = useState([])
const [showCleaningImagesModal, setShowCleaningImagesModal] = useState({ show:false,imageId:null })
const [showImageModal, setShowImageModal] = useState({ show:false,url:null })
const [submitVerification, setSubmitVerification] = useState(false)
const [showFuturePay, setShowFuturePay] = useState(false)
const [showWebView, setShowWebView] = useState({ url:null,show:false })
const [showTawkModal, setShowTawkModal] = useState({ url:null,show:false })
const [showLGAModal, setShowLGAModal] = useState(false)
const [completedFirstGuarantorForm,setCompletedFirstGuarantorForm] = useState(false)
const [completedSecondGuarantorForm,setCompletedSecondGuarantorForm] = useState(false)
const [verificationImages, setVerificationImages] = useState([
    {id:1,url:null,loading:true,fileName:null,fileId:null},
    {id:2,url:null,loading:true,fileName:null,fileId:null},
    {id:3,url:null,loading:true,fileName:null,fileId:null},
    {id:4,url:null,loading:true,fileName:null,fileId:null},
    {id:5,url:null,loading:true,fileName:null,fileId:null},
    {id:6,url:null,loading:true,fileName:null,fileId:null},
    {id:7,url:null,loading:true,fileName:null,fileId:null},
    {id:8,url:null,loading:true,fileName:null,fileId:null},
    {id:9,url:null,loading:true,fileName:null,fileId:null},
    {id:10,url:null,loading:true,fileName:null,fileId:null},
])
const [equipmentImageId, setEquipmentImageId] = useState()
// const snapPointsForBonusSheets = useMemo(() => ['25%', '50%'], []);
mixpanel.init()
mixpanel.identify(`${displayName}${id}`)
mixpanel.getPeople().set("level", `${level}`);
mixpanel.setLoggingEnabled(true);
// console.log(useSelector(state => state.login))
const star = []
const data = [
    {id: 1, type: 'order'},
    {id: 2, type: 'steps'}
  ];
for (let i = 0; i < 5; i++) {
    star.push(i)
}
const arr = [1,2,3,4,5,6]
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var application_key_id = "11198404582a"; // Obtained from your B2 account page
var application_key = "004a3ff84614f01fe5a6f17c78611128fd3016f631"; // Obtained from your B2 account page
var equipments = [
    {id:1,name:'Vim classic scourer',required:true,price:'1,200',item:1},
    {id:2,name:'White vinegar',required:true,price:'510',item:3,note:'Not cleaning vinegar/industrial vinegar'},
    {id:3,name:'All purpose cloth',required:true,price:'3,200',item:1},
    {id:4,name:'Plastic spray bottle',required:true,price:'5,100',item:3,note:'Any spray bottle would serve. As far as it can spray and be refilled.'},
    {id:5,name:'Hand gloves',required:true,price:'1,000',item:1},
    {id:6,name:'Multi purpose cleaner',required:true,price:'1,700',item:1},
    {id:7,name:'Sponge scouring pad',required:true,price:'900',item:9},
    {id:8,name:'Baking soda',required:true,price:'1800',item:1},
    {id:9,name:'Masculine tape',required:true,price:'900',item:1},
    {id:10,name:'Pure Black/grey t-shirt',required:true,price:'1500',item:1,note:'Preferrably with a touch of purple.'},
]

useEffect(() => {
  if (image !== user_img) {
    dispatch({ type:'CHANGE_USER_IMG', payload:{ user_img:image } })
  }
}, [image])
useEffect(() => {
    const checkGuarantorsDets = async() => {
        if (status === 'guarantor') {
            var req = await fetch(`${AllKeys.ipAddress}/getSecondGuarantor?cleaner_id=${cleaner_id}`)
            const { success,rows } = await req.json()

            if (success && rows.bvn) {
                setCompletedSecondGuarantorForm(true)
            }
            req = await fetch(`${AllKeys.ipAddress}/getGuarantor?cleaner_id=${cleaner_id}`)
            const res = await req.json()

            if (res.success && res.rows.bvn) {
                setCompletedFirstGuarantorForm(true)
            }
        }   
    }
    checkGuarantorsDets()
}, [])


useEffect(() => {
    (async () => {
        if (status !== 'verified') {
            const req = await fetch(`${AllKeys.ipAddress}/getVerificationInfo?cleaner_id=${cleaner_id}`)
            const { success,rows } = await req.json()
            if (success) {
                var Obj = [...equipments]
                var newObj = null
                var newArr = []
                for (let i = 0; i < rows.length; i++) {
                    for (let v = 0; v < equipments.length; v++) {
                        if (rows[i].equipment_id == equipments[v].id) {
                            newObj = Obj.filter(img => img.id != rows[i].equipment_id )
                            newArr.push({ id:Number(rows[i].equipment_id ),url:rows[i].url, loading:false,fileName:rows[i].file_name,fileId:rows[i].file_id })
                        }
                    }
                    if (i + 1 === rows.length) {
                        var loadingTrueObj = []
                        var loadingFalseObj = []
                        // console.log(newArr,'newArr')
                        // newArr.filter(img => img.loading === false).map(obj => {
                        //     loadingFalseObj.push(obj)
                        // })
                        Obj.filter(img => !newArr.some(arr => arr.id === img.id)).map(obj => {
                            loadingTrueObj.push({ id:obj.id,url:null,loading:false,fileName:null,fileId:null })
                        })
                        var finalArr = [...loadingTrueObj,...newArr]
                        setVerificationImages(finalArr)
                    }
                }
            }else{
                var Obj = [...verificationImages]
                var newArr = []
                Obj.map(img => {
                    newArr = [...newArr,{ id:img.id,url:img.url, loading:false,fileName:img.fileName,fileId:img.fileId }]
                })
                setVerificationImages(newArr)
            }
        }
      })()
    //   console.log(verificationImages,'verificationImages')
}, [])

const refetchImageVerification = async() => {
    const req = await fetch(`${AllKeys.ipAddress}/getVerificationInfo?cleaner_id=${cleaner_id}`)
    const { success,rows } = await req.json()

    if (success) {
        // var obj = [...verificationImages]
        // var newObj = obj.filter(img => rows.filter(row => row.equipment_id == img.id))
        var arr = []
        rows.map(row => {
            arr.push({ id:row.equipment_id,url:row.url, loading:false,fileName:row.file_name,fileId:row.file_id })
        })
        setVerificationImages(preEvents => {
            var newObj = preEvents.filter(img => !rows.some(row => row.equipment_id == img.id))
            return [...newObj, ...arr]
        })
    }
}

useEffect(async() => {
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    // notifee.displayNotification({
    //     // title: 'Notification Title',
    //     body: 'Full-screen notification',
    //     android: {
    //         channelId,
    //       // Recommended to set a category
    //       category: AndroidCategory.CALL,
    //       // Recommended to set importance to high
    //       importance: AndroidImportance.HIGH,
    //       fullScreenAction: {
    //         id: 'default',
    //       },
    //       actions: [
    //     {
    //       title: 'Decline',
    //       pressAction: {
    //         id: 'decline-call',
    //       },
    //     },
    //     {
    //       title: 'Answer',
    //       pressAction: {
    //         id: 'answer-call',
    //       },
    //     },
    //   ],
    //     },
    // });
    const fetchAllOrders = async() => {
        const fetchCleanerInfo = await fetch(`${AllKeys.ipAddress}/fetchCleaner?id=${id}`)
        const { success,rows } = await fetchCleanerInfo.json()
        if (success) {
            setStarReview(Number(rows.rating))
            OneSignal.deleteTags(["recruit", "practitioner","senior_practitioner","intermediate","supervisor"])
            OneSignal.sendTag(`${rows.level}`, "true");
            if (rating > 20) {
                fetch(`${AllKeys.ipAddress}/deleteTraineeWorkDays?trainee_id=${id}`)
            }
            dispatch({ type:"CHANGE_LEVEL",payload:{ level:rows.level,rating:rows.rating } })
            dispatch({ type:"UPDATE_STATUS",payload:{ status:rows.status } })
            if (rows.availability == 'true') {
                setIsOnline(true)
            }else{
                setIsOnline(false)
            }   
        }
    }
    fetchAllOrders()
    function isEven(n) {
        return n % 2 == 0;
     }
    const fetchActiveOrder = async() => {
        setIsPending(true)
        const d = new Date();
        let day = weekday[d.getDay()].toLowerCase();
        let hour = d.getHours();
        if (!isEven(hour)) {
            hour = hour - 1
        }
        if (hour == 12) {
            hour =+ 'pm'  
        }else if (hour > 11) {
            hour = (hour - 12) + 'pm'
        }else{
            hour += 'am'
        }
        var date = moment().startOf('day').valueOf()
        const req = await fetch(`${AllKeys.ipAddress}/fetchCurrentOrder?date=${date}&day=${day}&hour=${hour}&cleanerId=${cleaner_id}`)
        const { success,rows,cooperate,home } = await req.json()
        if (success) {
            var time = moment().startOf('day').valueOf()
            if (cooperate) {
                setIsHome(false)
                setIsEnterprise(true)
                setActiveOrder(rows[0])
            }else if (home) {
                const request = await fetch(`${AllKeys.ipAddress}/fetchExactStartedOrder?sub_id=${rows[0].id}&time=${time}&cleaner_id=${cleaner_id}`)
                const req = await fetch(`${AllKeys.ipAddress}/fetchExactEndOrder?sub_id=${rows[0].id}&time=${time}`)
                const { success } = await req.json()
                const res = await request.json()
                if (res.success && !success) {
                    setOrderBegan(true)
                }
                if (success) {
                    setActiveOrder({})
                    setCusArr([])
                    setIsPending(false)
                    return
                }
                setIsEnterprise(false)
                setIsHome(true)
                setActiveOrder(rows[0])
                // later change all your customer_name/name_of_business to just name
                setCusArr({ 
                    id:rows[0].id,
                    name_of_business:rows[0].customer_name,
                    customer_id:rows[0].customer_id,
                    type:'home',
                    num_of_cleaner:rows[0].num_of_cleaner,
                    num_of_supervisor:rows[0].num_of_supervisor,
                    day_period:rows[0].day_period,
                    time_period:rows[0].time_period,
                    cleaner_pay:rows[0].cleaner_pay,
                    supervisor_pay:rows[0].supervisor_pay,
                    state:rows[0].state,
                    country:rows[0].country,
                    deadline:rows[0].deadline,
                    next_cleaning_order:rows[0].next_cleaning_order,
                    cleanerFilled:true
                })
            }else{
                setActiveOrder({})
            }
            setIsPending(false)
        }else{
            showMessage({
                message: "Error",
                description: "Could not get active order. Please restart app",
                type: "danger"
            });
        }
    }
    fetchActiveOrder()
  
}, [isFocused])
  
useEffect(() => {
    let externalUserId = id + ''
    // Setting External User Id with Callback Available in SDK Version 3.9.3+
OneSignal.setExternalUserId(externalUserId);
    // const checkCleanerLvl = async() => {
    //     const getCleanerlvl = await fetch(`${AllKeys.ipAddress}/fetchCleanerlevel?cleanerId=${id}`)
    //     const { row,success } = await getCleanerlvl.json()
    //     if (success) {
           
    //     }
    // }
    // checkCleanerLvl()
}, [])

const toggleSwitch = () => {
    fetch(`${AllKeys.ipAddress}/updateAvailablity?available=${isOnline ? 'false' : 'true'}&id=${id}`)
    setIsOnline(!isOnline)
}
const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
);   
// console.log(rating,level)
const changeModal = (val) => {
    setModalVisible({ show:!modalVisible.show, text:val })
}
const startCleaning = async(activity) => {
    const { granted } = await Location.requestForegroundPermissionsAsync()
    if (!granted) {
        showMessage({
            type:'danger',
            message:'Error',
            description:"Please allow location to start cleaning"
        })
        return
    }
    if (orderBegan) {
        navigation.navigate('ListOfSpaces', { activeOrder })
    }
    let {latitude,longitude} =  (await Location.getCurrentPositionAsync({})).coords;
    const req = await fetch(`${AllKeys.ipAddress}/GetId?id=${activeOrder.customer_id}`)
    const { success,rows } = await req.json()

    if (success) {
        if ((latitude - 0.001 < rows.latitude < latitude + 	0.001) && (longitude - 	0.001 < rows.longitude < longitude + 0.001)) {
            if (activity === 'started') {
                var time = moment().valueOf()
                fetch(`${AllKeys.ipAddress}/insertSubOrder?sub_id=${activeOrder.id}&cleaner_id=${cleaner_id}&time=${time}`)   
            }
            navigation.navigate('ListOfSpaces', { activeOrder })
        }else{
            showMessage({
                type:'danger',
                message:'Cannot start cleaning.',
                description:"You are not yet at the customer's home"
            })
        }
    }else{
        showMessage({
            type:'danger',
            message:'Error',
            description:"Customer does not exist. Please try again later."
        })
    }
}
const toggleEquImages = (id) => {
    setShowCleaningImagesModal({ show:!showCleaningImagesModal.show, imageId:id })
}
const takePhoto = async(id) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showMessage({
          message: "Error",
          description: "Please enable camera permission in order to take photo.",
          type: "danger"
      });
    }else{
        setEquipmentImageId(id)
        setShowCameraModal(true)
    }
}
const startUploadingImage = async(photo) =>{
    setShowCameraModal(false)
    var cleaningEquipId = equipmentImageId
      var Obj = [...verificationImages]
      var newObj = Obj.filter(img => img.id != cleaningEquipId)
      var newArr = [...newObj,{ id:Number(cleaningEquipId),url:null, loading:true,fileName:null,fileId:null }]
      setVerificationImages(newArr)
      const { uri,base64 } = photo
      const fileAsync = await fetch(`${AllKeys.ipAddress}/readFileName?uri=${uri}`)
      const fileName = await fileAsync.text()
      const binaryImage = Buffer.from(base64, 'base64')
      const digest = Rusha.createHash().update(binaryImage).digest('hex'); 
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
        if (!authRes.apiUrl) {
            showMessage({
                message: "Error",
                description: "Could upload image. Please contact support or try again",
                type: "danger"
            });
            return
        }
        res = await fetch(`${authRes.apiUrl}/b2api/v2/b2_get_upload_url`, {
            method: 'POST',
            headers: {
                "Authorization": `${authRes.authorizationToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bucketId : __DEV__ ? "f1216149f884f0348518021a" : "01a1c1f9f8e420448548021a"
            })
        })
        let { uploadUrl,authorizationToken } = await res.json()
        if (!uploadUrl || !authorizationToken) {
            showMessage({
                message: "Error",
                description: "Could upload image. Please try again",
                type: "danger"
            });
            return
        }
        const uploadImage = await fetch(`${uploadUrl}`, {
            method:'POST',
            headers:{
                'Authorization': `${authorizationToken}`,
                'Content-Type' : 'b2/x-auto',
                'X-Bz-File-Name':`verification/cleaning_equipments/${displayName}${cleaner_id}/${cleaningEquipId}/${fileName}`,
                'X-Bz-Content-Sha1' : `${digest}`,
            },
            body: binaryImage
        })
        var imageRes = await uploadImage.json()
        if (imageRes.accountId && imageRes.fileName) {
            // Obj = [...verificationImages]
            // newObj = Obj.filter(img => img.id != cleaningEquipId)
            // newArr = [...newObj,{ id:cleaningEquipId,url:uri, loading:false,fileName:imageRes.fileName,fileId:imageRes.fileId }]
            // setVerificationImages(newArr)
            fetch(`${AllKeys.ipAddress}/insertEquipmentVerification?fileId=${imageRes.fileId}&fileName=${imageRes.fileName}&equipment_id=${cleaningEquipId}&cleaner_id=${cleaner_id}&url=https://f004.backblazeb2.com/file/${__DEV__? 'blipmooretest' : 'blipmoore-cleaner'}/${imageRes.fileName}`)
            setPhotoUploadIsLoading(false)
            refetchImageVerification()
        }
}
const snap = async () => {
    if (cameraRef) {
      cameraRef.current.takePictureAsync({quality:1,base64:true,exif:true,onPictureSaved: startUploadingImage}).then(img => cameraRef.current.pausePreview());
    }
};
const toggleImagesModal = (url) => {
    setShowImageModal({ show:!showImageModal.show, url})
}
const submitApplication = async() => {
    setSubmitVerification(true)
    const req = await fetch(`${AllKeys.ipAddress}/updateStatus?status=payment&cleaner_id=${cleaner_id}`)
    const { success } = await req.json()
    if (success) {
        showMessage({
            message: "Success",
            description: "Application submitted.",
            type: "success"
        });
        dispatch({ type:'UPDATE_STATUS',payload: {status:'payment'} })
    }else{
        showMessage({
            message: "Error",
            description: "Please try again later.",
            type: "danger"
        });
    }
    setSubmitVerification(false)
}
const deleteImage = async(img) => {
    var Obj = [...verificationImages]
    var newObj = Obj.filter(image => image.id !== img.id)
    var newArr = [...newObj,{ id:img.id,url:'', loading:false,fileName:null,fileId:null }]
    setVerificationImages(newArr)
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
    if (!authRes.apiUrl) {
        showMessage({
            message: "Error",
            description: "Couldn't upload image. Please contact support or try again later",
            type: "danger"
        });
        return
    }
    res = await fetch(`${authRes.apiUrl}/b2api/v2/b2_delete_file_version`, {
        method: 'POST',
        headers: {
            "Authorization": `${authRes.authorizationToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileId : img.fileId,
            fileName: img.fileName
        })
    })
    var req = await res.json()
    if (req.fileId) {
        fetch(`${AllKeys.ipAddress}/deleteImageVerification?cleaner_id=${cleaner_id}&fileId=${img.fileId}`)
    }
}
const acceptFuturePay = async() => {
    setIsPending(true)
    dispatch({ type:'UPDATE_STATUS',payload: {status:'payment'} })
    const req = await fetch(`${AllKeys.ipAddress}/updateStatus?status=payment&cleaner_id=${cleaner_id}`)
    const { success } = await req.json()
    if (success) {
        setShowFuturePay(false)
        setIsPending(false)
    }else{
        showMessage({
            message: "Error",
            description: "Please try again later",
            type: "danger"
        })
    }
}
const closeTawkModal = () => {
    setShowTawkModal({ show:false, url:null })
}
const closeWebView = async(option) => {
    if (option === 'verified') {
        const fetchCleaner = await fetch(`${AllKeys.ipAddress}/fetchCleaner?id=${id}`)
        const { success,rows } = await fetchCleaner.json()
        if (success) {
            const addressReq = fetch(`${AllKeys.verifyNINurl}/verifications/addresses`, {
                headers:{
                    'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
                    'Content-Type': 'application/json'
                },
                method:'POST',
                body:JSON.stringify({
                    'reference':`${cleaner_id}`,
                    'city':`${city}`,
                    'state':`${state}`,
                    'landmark':`${city} ${estate && estate + ' estate'}`,
                    'lga': `${lga}`,
                    'street':`${street_number} ${street_name} ${estate} ${city}`,
                    "applicant": {
                        'firstname':`${displayName}`,
                        'lastname':`${lastName}`,
                        'dob':`${rows.birth_info}`,
                        'phone':`${number.includes('234') ? number.replace('234', '0').trim()  : number}`,
                        'idType':'KYC',
                        'idNumber':`${number.includes('234') ? number.replace('234', '0').trim()  : number}`,
                    }
                })
            }).then(async(res) => {
                var data = await res.json()
                if (data.error) {
                    showMessage({ 
                        type:'danger',
                        message:`${data.error}`,
                        description:`${data.message}`,
                        duration:5000
                    })
                }else{
                    showMessage({
                        type:'success',
                        message:'Success',
                        description:'Payment Successful'
                    })
                    const req = await fetch(`${AllKeys.ipAddress}/updateStatus?name=${displayName}&status=guarantor&email=${email}&cleaner_id=${cleaner_id}`)
                    const { success } = await req.json()
                    if (success) {
                        dispatch({ type:'UPDATE_STATUS',payload: {status:'guarantor'} })   
                    }else{
                        showMessage({ 
                            type:'danger',
                            message:`Error`,
                            description:`Failed to update status. Please try again later`,
                            duration:5000
                        })
                    }
                }
            }).catch(err => console.log(err))
        }
    }
    setShowWebView({ show:false, url:null })
}
const declineFuturePay = async() => {
    setShowFuturePay(false)
}
const verificationPayment = async() => {
    setSubmitVerification(true)
    // This uses id instead of cleaner_id because address info is a public information/usecase instead of specified to cleaners only
    const fetchUserAddress = await fetch(`${AllKeys.ipAddress}/fetchUserAddress?id=${id}`)
    const { success, rows } = await fetchUserAddress.json()
    if (success && rows.lga && rows.lga !== '') {
        var date = moment().startOf('day')
        const req = await fetch(`${AllKeys.ipAddress}/verificationPayment?amount=${2500}&email=${email}&cleanerId=${cleaner_id}&date=${date}`)
        const { success,url } = await req.json()
        setSubmitVerification(false)
        if (success) {
            setShowWebView({ show:success,url })
        }else{
            showMessage({
                message: "Error",
                description: "Could not initialize payment. Try again later",
                type: "danger"
            })
        }   
    }else{
        setShowLGAModal(true)
    }
}
const SubmitLga = async(lga) => {
    // This uses id instead of cleaner_id because address info is a public information/usecase instead of specified to cleaners only
    const req = await fetch(`${AllKeys.ipAddress}/SubmitLga?id=${id}&lga=${lga}`)
    const {success} = await req.json()

    if (success) {
        setShowLGAModal(false)
        dispatch({ type:'UPDATE_LGA',payload: {lga} })
        showMessage({
            type:'success',
            message:'Success',
            description:'LGA successfully updated'
        })
        verificationPayment()
    }
}
const closeLgaModal = () => {
    setShowLGAModal(false)
}
return (
    <ScrollView style={styles.container}>
    {
        __DEV__
        ?
        <StatusBar translucent={true} backgroundColor={colors.white} />
        :
        null
    }
    <SafeAreaView>
    <AnimatedLoader 
      visible={submitVerification}
      overlayColor="rgba(0,0,0,0.75)"
      source={require('../../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    <LgaModal SubmitLga={SubmitLga} showLGAModal={showLGAModal} closeLgaModal={closeLgaModal} />
    <WebViewMainModal webViewModal={showWebView} amount={2500} closeWebView={closeWebView} cleanerId={cleaner_id} />
    <TawkTo showTawkModal={showTawkModal} closeTawkModal={closeTawkModal} />
    <ImageModal toggleImagesModal={toggleImagesModal} showImageModal={showImageModal} />
    <MyModal modalVisible={modalVisible} changeModal={changeModal} />
    <CleaningImagesModal toggleEquImages={toggleEquImages} showCleaningImagesModal={showCleaningImagesModal}  />
    <WarningModal showModal={showFuturePay} positive={'Yes'} negative={'Cancel'} acceptFunction={acceptFuturePay} declineFunction={declineFuturePay} title={'Are you sure you want us to take out of your future pay?'} />
    <Modal
        visible={showCameraModal}
        transparent={false}
        animationType='slide'
        statusBarTranslucent={true}
        onRequestClose={() => setShowCameraModal(false)}
    >
        <Camera ref={cameraRef} onCameraReady={() => setCameraIsReady(true)} style={styles.camera} flashMode={flash} type={type}>
            {
                cameraIsReady
                ?
                <View>
                    <TouchableOpacity onPress={snap}>
                        <View style={styles.cameraBtn} >
                            <View style={{ width:100,height:100,borderRadius:100,backgroundColor:colors.purple }} />
                        </View>
                    </TouchableOpacity>
                </View>
                :
                <View style={styles.cameraBtn} >
                    <View style={{ width:100,height:100,borderRadius:100,backgroundColor:colors.lightPurple,opacity:0.6 }} />
                </View>
            }
            
        </Camera>
    </Modal>
    <LinearGradient colors={[colors.purple, colors.darkPurple, colors.black]} style={styles.header}>
        <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center', padding:20 }}>
            <TouchableNativeFeedback onPress={() => navigation.openDrawer()}>
                <View style={{ marginVertical:20 }}>
                    <FontAwesome name="navicon" size={24} color={colors.white} />
                </View>
            </TouchableNativeFeedback>    
            <View style={{ alignSelf:'center' }}>
                <Text style={{ fontFamily:'viga',fontSize:15,color:colors.white,letterSpacing:1.3 }}>Hi {displayName}</Text>
                <View style={{ alignItems:'center',justifyContent:'space-around',flexDirection:'row' }}>
                {status === 'verified' ?
                    <>
                        <MaterialIcons name="verified" size={10} color="green" />
                        <Text style={{ color:'green',fontSize:12 }}>Verified</Text>
                    </>
                    :
                    status === 'pending'
                    ?
                    <>
                        <Entypo name="back-in-time" size={10} color={colors.grey} />
                        <Text style={{ color:colors.grey,fontSize:12 }}>Pending</Text>
                    </>
                    :
                    <>
                        <Octicons name="unverified" size={10} color="red" />
                        <Text style={{ color:'red',fontSize:12 }}>Unverified</Text>
                    </>
                }
                </View>
            </View>
        </View>
    </LinearGradient>
    <View style={{ alignSelf:'center',top:height / 4.2,position:'absolute' }}>
        <TouchableNativeFeedback onPress={() => pickImage()}>
            {
                image ?
                <View style={status === 'verified' ? styles.picBorder :  status === 'pending' ? { ...styles.picBorder,borderColor:'grey' } : { ...styles.picBorder,borderColor:'red' }}>
                    <View style={{ width:70,height:70,overflow:'hidden',borderRadius:100 }}>
                        <FastImage source={{ uri: `${image}`,priority:FastImage.priority.normal }} resizeMode={FastImage.resizeMode.contain} style={{ width:'100%',height:'100%' }} />
                    </View>
                </View>
                :
                <View style={styles.photo}>
                    <Ionicons name="add" size={width > 598 ? 22 : 18} style={{ backgroundColor:'#f0f8ff',marginVertical:5 }} color="black" />
                </View>
            }
        </TouchableNativeFeedback>
    </View>

    <View style={{ marginVertical:10 }}>
    <View style={{ height:'100%' }}>
            <View style={{ justifyContent:'space-between',flexDirection:'row',marginBottom:5,marginTop:30,padding:10 }}>
                <View>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <Ionicons name="time-outline" size={16} color={colors.darkPurple} style={{ marginRight:5 }} /><Text style={{ fontFamily:'viga' }}>{new Date().getHours()}:00{new Date().getHours() >= 12 ? 'pm' : 'am'}</Text>
                    </View>   
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('AllOrders')}>
                    <Text style={{ fontFamily:'viga',opacity:0.6 }}>View Future & Past Orders <Fontisto name="angle-right" size={12} color="black" /></Text>
                </TouchableOpacity>
            </View>
            <View style={{height: 65, marginHorizontal:10}} >
                <Text style={{ fontFamily:'viga',paddingHorizontal:5,color:colors.black,textDecorationLine:'underline' }}>Quick Links</Text>
                <ScrollView horizontal={true} style={{ flexWrap:'wrap' }}>
                    <TouchableNativeFeedback onPress={() => navigation.navigate('HirePeriod')}>
                        <View style={styles.quickNav}>
                            <Text style={{ color:colors.black,fontSize:10,fontWeight:'bold' }}>Change work hours</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => setShowWebView({ show:true,url:'https://tawk.to/chat/636a8ef9b0d6371309cdfe8d/1ghc3t0hi' })}>
                        <View style={styles.quickNav}>
                            <Text style={{ color:colors.black,fontSize:10,fontWeight:'bold' }}>Support</Text>
                        </View>
                    </TouchableNativeFeedback>
                    {/* <TouchableNativeFeedback>
                        <View style={styles.quickNav}>
                            <Text style={{ color:colors.black,fontSize:10 }}>change work hours</Text>
                        </View>
                    </TouchableNativeFeedback> */}
                </ScrollView>
            </View>
            <View style={styles.activeOrder}>
            <View style={{ padding:10 }}>  
            {
                isPending || !activeOrder ?
                    <View style={{ backgroundColor:'rgba(225,225,225,1)',padding:10,borderRadius:10,marginVertical:10 }}>
                        <ContentLoader active avatar pRows={1} titleStyles={{  }} />
                        <View style={{ marginTop:10 }}>
                            <ContentLoader active title={false} pRows={1} paragraphStyles={{ width:'80%',height:20,alignSelf:'center' }} />
                        </View>
                        <View style={{ marginBottom:10 }}>
                            <View >
                                <ContentLoader active title={false} pRows={1} paragraphStyles={{ width:'100%',height:30,borderRadius:10 }} />
                            </View>
                            <View style={{ marginVertical:5 }}>
                                <ContentLoader active title={false} pRows={1} paragraphStyles={{ width:'100%',height:30,borderRadius:10 }} />
                            </View>
                        </View>
                    </View>
                :
                Object.keys(activeOrder).length > 0 ?
                    <View style={styles.orderBox}>
                        <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
                          <View style={{ flexDirection:'row',alignItems:'center',marginVertical:10 }}>
                            <View style={styles.avatar}>
                                <Text style={{ fontFamily:'Funzi',fontSize:24,color:colors.whitishBlue }}>{isHome ? activeOrder.customer_name.slice(0,1) : activeOrder.name_of_business.slice(0,1)}</Text>
                            </View>
                            <View style={{ margin:5 }}>
                                <Text style={{fontFamily:'viga',color:colors.black,letterSpacing:1 }}>{isHome ? activeOrder.customer_name : activeOrder.name_of_business}</Text>
                                <Text style={{ color:colors.black,opacity:0.6,fontSize:12 }}>{activeOrder.location}</Text>
                            </View>
                          </View>
                          <View style={ activeOrder.type === 'home' ? styles.type : {...styles.type, backgroundColor:'lightblue'}}>
                              {/* <Ionicons name="call" size={14} color="white" /> */}
                              <Text style={ activeOrder.type === 'home' ? { color:colors.purple,fontWeight:'bold',letterSpacing:1 } : { color:'red',fontWeight:'bold',letterSpacing:1 }}>{activeOrder.type}</Text>
                          </View>
                        </View>
                        <View style={styles.info}>
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <FontAwesome name="calendar" size={14}  style={{ marginRight:5 }} color={colors.black} />
                                <Text style={{ fontFamily:'viga',color:colors.black }}>
                                  {moment(activeOrder.next_cleaning_order).format('dddd')} - {''}
                                  {moment(activeOrder.next_cleaning_order).format('DD')} {''} 
                                  {moment(activeOrder.next_cleaning_order).format('MMM')} {''}
                                  {moment(activeOrder.next_cleaning_order).format('YYYY')} - {''}
                                  {moment(activeOrder.next_cleaning_order).format('h:mm a')}
                                </Text>
                            </View>
                        </View>
                        {
                            orderBegan
                            ?
                            <TouchableOpacity onPress={startCleaning}>
                                <View style={styles.button}>
                                    <Text style={{ color:'white',textTransform:'capitalize' }}>Continue Cleaning</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            activeOrder.next_cleaning_order <= moment().valueOf() ?
                            <TouchableOpacity onPress={() => startCleaning('started')}>
                                <View style={styles.button}>
                                    <Text style={{ color:'white',textTransform:'capitalize' }}>Start Cleaning</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={{...styles.button, opacity:0.6}}>
                                <Text style={{ color:'white',textTransform:'capitalize' }}>Start Cleaning</Text>
                            </View>
                        }
                        <TouchableOpacity onPress={() => navigation.navigate('Enterprise', { screen:'Overview',params:{item:Object.keys(cusArr).length > 0 ? cusArr : activeOrder} })}>
                            <View style={{...styles.button,backgroundColor:'transparent',marginVertical:10,borderColor:colors.black,borderWidth:1}}>
                                <Text style={{ color:'black',textTransform:'capitalize' }}>View {activeOrder.type}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
            :
            status === 'verified'
            ?
            <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
                <Ionicons name="ios-today-sharp" size={154} color="grey" />
                <Text style={{ fontWeight:'bold',letterSpacing:1,fontSize:16 }}>No active order</Text>
            </View>
            :
            status === 'payment'
            ?
            <View style={styles.bgVerify}>
                <View>
                    <Text style={{ textAlign:'center',fontSize:20,fontFamily:'viga',textTransform:'uppercase' }}>Full Verification</Text>
                </View>
                <View style={{ marginVertical:15 }}>
                    <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                        <Text style={{ fontFamily:'viga' }}>Guarantor Verification</Text>
                        <Text>{currency.naira}1000</Text>
                    </View>
                    <View>
                        <Text>A Guarantor is someone who would recommend you to be hired by us and also would be contacted if there's 
                            any breach of contract between you and blipmoore. The fee is associated with verifying the guarantor's NIN on NIMC.
                        </Text>
                    </View>
                </View>
                <View style={{borderColor:colors.purple,borderWidth:1}} />
                <View style={{ marginVertical:15 }}>
                    <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                        <Text style={{ fontFamily:'viga' }}>Address Verification</Text>
                        <Text>{currency.naira}1000</Text>
                    </View>
                    <View>
                        <Text>We would send an agent to come and confirm your home address. This fee is used for transportation and unexpected expenses</Text>
                    </View>
                </View>
                <View style={{borderColor:colors.purple,borderWidth:1}} />
                <View style={{ marginVertical:15 }}>
                    <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                        <Text style={{ fontFamily:'viga' }}>NIN Verification</Text>
                        <Text>{currency.naira}500</Text>
                    </View>
                    <View>
                        <Text>This is to verify your NIN to be ensure details given to us was correct. The fee is associated with verifying the your NIN on NIMC.</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={verificationPayment}>
                    <View style={styles.submitBtn}>
                        <Text style={{ color:colors.grey,fontFamily:'viga',textAlign:'center' }}>Complete Verification</Text>
                    </View>
                </TouchableOpacity>
            </View>
            :
            status === 'guarantor'
            ?
                <View style={styles.bgVerify}>
                    <View>
                        <Text style={{ fontFamily:'viga',fontSize:20 }}>Almost there, Fill in the form</Text>
                        <Text style={{ color:colors.black,opacity:0.6 }}>Enter the details of your guarantor</Text>
                    </View>
                    <View style={{ marginTop:50 }}>
                        {
                            completedFirstGuarantorForm
                            ?
                            <View style={{...styles.button,marginBottom:10,backgroundColor:colors.darkPurple,opacity:0.6}}>
                                <Text style={{ color:colors.white,textTransform:'uppercase',fontFamily:'Murecho' }}>Fill in first guarantor form</Text>
                            </View>
                            :
                            <TouchableOpacity onPress={() => navigation.navigate('Guarantor')}>
                                <View style={{...styles.button,marginBottom:10,backgroundColor:colors.darkPurple}}>
                                    <Text style={{ color:colors.white,textTransform:'uppercase',fontFamily:'Murecho' }}>Fill in first guarantor form</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        {
                            completedSecondGuarantorForm
                            ?
                            <View style={{...styles.button,backgroundColor:colors.darkPurple,opacity:0.6}}>
                                <Text style={{ color:colors.white,textTransform:'uppercase',fontFamily:'Murecho' }}>Fill in second guarantor form</Text>
                            </View>
                            :
                            <TouchableOpacity onPress={() => navigation.navigate('SecondGuarantor')}>
                                <View style={{...styles.button,backgroundColor:colors.darkPurple}}>
                                    <Text style={{ color:colors.white,textTransform:'uppercase',fontFamily:'Murecho' }}>Fill in second guarantor form</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            :
            status === 'pending'
            ?
                <View style={{...styles.bgVerify,justifyContent:'center',alignItems:'center'}}>
                    <Entypo name="back-in-time" size={100} style={{ opacity:0.6 }} color="black" />
                    <View style={{ marginVertical:10 }}>
                        <Text style={{ fontFamily:'viga',fontSize:20,textAlign:'center' }}>Verification In Review</Text>
                        <Text style={{ opacity:0.6,textAlign:'center' }}>Please wait for your application to be reviewed. You would receive an email on your application in 2 - 5 days.</Text>
                    </View>
                </View>
            :
            <View style={{ padding:10 }}>
                <View style={{ marginBottom:10 }}>
                    <Text style={{ fontFamily:'viga',fontSize:16 }}>You are currently {status === 'unverified' ? <Text style={{ color:'red' }}>{status}</Text> :<Text style={{ color:colors.lightPurple }}>awaiting verification</Text>}</Text>
                    <Text style={{ fontSize:12 }}>You need to buy the following cleaning equipments then take a photo of each.</Text>
                </View>
                <View style={{ padding:5 }}>
                    {
                        equipments.map(equ => (
                            <View key={equ.id} style={styles.equipmentsCont}>
                                <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                    <Text style={{ fontFamily:'viga',fontSize:14 }}>{equ.name} x{equ.item}</Text>
                                    <Text>{currency.naira}{equ.price}</Text>
                                </View>
                                <View style={{ marginVertical:10 }}>
                                    <View style={styles.equipmentsInfo}>
                                        <AntDesign name={equ.required ? "checkcircle" : "closecircle"} size={12} color={equ.required ? "green" : "red"} />
                                        <Text style={{ fontSize:12 }}>Required</Text>
                                    </View>
                                    <View style={styles.equipmentsInfo}>
                                        {
                                            verificationImages.filter(img => img.id == equ.id).map(img => (
                                                <Fragment key={img.id}>
                                                    {
                                                        img.loading
                                                        ?
                                                        <>
                                                            <LottieView 
                                                                autoPlay
                                                                source={require('../../lottie/circle2.json')}
                                                                style={styles.smallLottie}
                                                            />
                                                            <Text style={{ fontSize:12 }}>Loading...</Text>
                                                        </>
                                                        :
                                                        img.url
                                                        ?
                                                        <>
                                                            <AntDesign name="checkcircle" size={12} color="green" />
                                                            <Text style={{ fontSize:12 }}>Uploaded</Text>
                                                        </>
                                                        :
                                                        <>
                                                            <AntDesign name="closecircle" size={12} color="red" />
                                                            <Text style={{ fontSize:12 }}>Uploaded</Text>
                                                        </>
                                                    }
                                                </Fragment>
                                            ))
                                        }
                                    </View>
                                    {
                                        verificationImages.filter(img => img.id == equ.id).filter(img => img.url).map(img => (
                                            <View key={img.id} style={{...styles.equipmentsInfo,width:'100%' }}>
                                                <TouchableNativeFeedback onPress={() => toggleImagesModal(img.url)}>
                                                    <View>
                                                        <Text style={{ fontSize:12,fontWeight:'bold',textDecorationLine:'underline',color:colors.purple }}>See your image</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                                {
                                                    status === 'unverified' &&
                                                    <TouchableNativeFeedback onPress={() => deleteImage(img)}>
                                                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                                                            <AntDesign name="delete" size={12} color="red" />
                                                            <Text style={{ fontSize:12,fontWeight:'bold',textDecorationLine:'underline',color:'red',marginLeft:3 }}>Delete image</Text>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                }
                                            </View>
                                        ))
                                    }
                                    {
                                        equ.note &&
                                        <View style={{ marginVertical:10 }}>
                                            <Text style={{ fontSize:12,fontWeight:'bold' }}>NOTE: {equ.note}</Text>
                                        </View>
                                    }
                                </View>
                                <View style={styles.equipmentsBtnCont}>
                                    <TouchableNativeFeedback onPress={() => toggleEquImages(equ.id)}>
                                        <View style={{...styles.equipmentsBtn,backgroundColor:'transparent' }}>
                                            <Text style={styles.equipmentsBtnText}>View Images</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    {
                                        verificationImages.filter(img => img.id == equ.id).filter(img => img.url).length > 0 || verificationImages.filter(img => img.id == equ.id).filter(img => img.loading).length > 0
                                        ?
                                        <View style={{...styles.equipmentsBtn, backgroundColor:colors.grey,borderWidth:0}}>
                                            <Text style={{...styles.equipmentsBtnText, color:colors.black,opacity:0.6 }}>Take photo</Text>
                                        </View>
                                        :
                                        <TouchableNativeFeedback onPress={() => takePhoto(equ.id)}>
                                            <View style={styles.equipmentsBtn}>
                                                <Text style={{...styles.equipmentsBtnText, color:colors.grey }}>Take photo</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    }
                                </View>
                            </View>
                        ))
                    }
                    {
                        verificationImages.filter(img => img.url).length === verificationImages.length && status === 'unverified'
                        ?
                            <TouchableOpacity onPress={submitApplication}>
                                <View style={styles.submitBtn}>
                                    <Text style={{ color:colors.grey,fontFamily:'viga',textAlign:'center' }}>Submit Application</Text>
                                </View>
                            </TouchableOpacity>
                        :
                            <View style={{ backgroundColor:colors.grey,padding:10,borderRadius:10,marginVertical:10 }}>
                                <Text style={{ color:colors.black,fontFamily:'viga',textAlign:'center',opacity:0.6 }}>Submit Application</Text>
                            </View>
                    }
                </View>
                <View>
                    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
                        <View style={styles.line} />
                        <Text>OR</Text>
                        <View style={styles.line} />
                    </View> 
                    <TouchableOpacity onPress={() => setShowFuturePay(true)}>
                        <View style={styles.submitBtn}>
                            <Text style={{ color:colors.grey,fontFamily:'viga',textAlign:'center' }}>Take out of my future pay</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            }
             </View>
             {
                status === 'verified' &&
                <View style={{ marginTop:20 }}>
                    <TouchableNativeFeedback onPress={() => navigation.navigate('Enterprise')}>
                        <View style={{...styles.customBtn, backgroundColor:colors.black}}>
                            <Text style={{ fontFamily:'viga',textTransform:'uppercase',color:colors.white }}>View Requests</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            }
        </View>
    </View>
    </View>
   
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={anotherSnapPoints}
            enablePanDownToClose={true}
            style={styles.bottomSheetContainer}
            backdropComponent={renderBackdrop}
        >
            <Image style={{ width:'100%',height:'40%' }} resizeMode={'contain'} source={require('../../assets/verified.png')} />
            <View style={{ padding:20,alignItems:'center',justifyContent:'center',marginVertical:20 }}>
                <Text style={{ fontSize:24,textAlign:'center',fontFamily:'Funzi',letterSpacing:1 }}>{rating > 0 ? 'You are now Verified 🎉' :'Need Verification?'}</Text>
                <Text style={{ textAlign:'center',marginVertical:20,fontSize:18 }}>{rating > 0 ? 'You can now receive orders and apply for cleaner jobs.' :'We have training at least once every month. Attend and you would be verified.'}</Text>
                {rating > 0 ? <Text style={{ textAlign:'center',marginVertical:-20,fontSize:18 }}>Always attend training atleast every 3 months else you would be removed from our platform.</Text> : null}
            </View>
        </BottomSheet>
        </SafeAreaView>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    line:{
        borderWidth:1,
        borderColor:colors.purple,
        marginVertical:5
    },
    header: {
        height: height / 5,
        margin:10,
        borderRadius:20,
        alignSelf:'center',
        width:'95%',
        overflow:'hidden',
        backgroundColor:colors.black
    },
    photo:{
        backgroundColor:'grey',
        borderRadius:50,
        height:50,
        width:50,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
    },
    picBorder:{
        borderColor:colors.grey,
        borderRadius:100,
        borderWidth:2,
        padding:5
    },
    quickNav:{
        backgroundColor:colors.lightPurple,
        borderColor:colors.purple,
        borderWidth:1,
        borderRadius:20,
        margin:5,
        alignItems:'center',
        width:110,
        padding:5,
        paddingHorizontal:10,
        justifyContent:'center',
    },
    bgVerify:{
        backgroundColor:colors.grey,
        borderRadius:15,
        paddingVertical:30,
        padding:15,
        marginBottom:30
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
    activeOrder: {
        marginVertical:10,
        height:'100%'
    },
    orderBox:{
      backgroundColor:colors.lightPurple,
      padding:10,
      width:'100%',
      marginVertical:10,
      borderRadius:10
    },
    info: {
      width:'100%',
      marginVertical:10,
      justifyContent:'center',
      alignItems:'center'
    },
    infoTitle: {
        color:colors.black,
    },
    infoDets:{
        color:colors.darkPurple,
        fontFamily:'viga'
    },
    type:{
        backgroundColor:colors.grey,
        width:'20%',
        alignItems:'center',
        justifyContent:'center',
        height:20
    },
    avatar:{
        borderRadius:50,
        backgroundColor:colors.black,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        width:40,
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    timeRow:{
        flexDirection:'row',
        marginVertical:5,
        alignItems:'center' 
    },
    button:{
        backgroundColor:colors.black,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:'100%',
        alignSelf:'center',
        borderRadius:10
    },
    customBtn: {
        alignItems:'center',
        padding:10,
        // borderColor:colors.purple,
        borderWidth:2,
        borderRadius:10,
        margin:10
    },
    eachAction:{
        width:'100%',
        flexDirection:'row'
    },
    doneBtn:{
        backgroundColor:colors.black,
        borderRadius:5,
        marginHorizontal:10,
        opacity:0.6,
        padding:10
    },
    actionText:{
        marginLeft:10,
        fontFamily:'viga',
    },
    actionLine:{
        borderLeftColor:colors.black,
        borderLeftWidth:2,
        height:30,
        marginLeft:5
    },
    equipmentsCont:{
        backgroundColor:colors.lightPurple,
        borderRadius:15,
        padding:20,
        marginVertical:10
    },
    equipmentsBtnCont:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%' 
    },
    equipmentsBtn:{
        backgroundColor:colors.black,
        borderRadius:5,
        width:'40%',
        padding:5,
        borderColor:colors.black,
        borderWidth:1
    },
    equipmentsBtnText:{
        fontSize:12,
        textAlign:'center'
    },
    equipmentsInfo:{
        flexDirection:'row',
        alignItems:'center',
        width:'25%',
        justifyContent:'space-between',
        marginBottom:5
    },
    camera:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    cameraBtn:{
        width:120,
        height:120,
        borderRadius:100,
        borderColor:colors.lightPurple,
        borderWidth:2,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:20
    },
    lottie: {
        width: 100,
        height: 100
    },
    smallLottie:{
        width: 12,
        height: 12,
        transform:[ { scale:1.7 } ]
    },
    submitBtn:{
        backgroundColor:colors.black,
        padding:10,
        borderRadius:10,
        marginVertical:10
    },
    line:{
        borderWidth:1,
        height:'3%',
        width:'40%',
        borderColor:colors.grey,
        marginVertical:5
    },
})