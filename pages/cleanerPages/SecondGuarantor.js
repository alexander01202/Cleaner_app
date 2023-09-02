import { StyleSheet, Text, View,TextInput,Dimensions,TouchableNativeFeedback,Keyboard,TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback,useEffect,useMemo,useRef,useState } from 'react'
import { Bar } from 'react-native-progress'
import AnimatedLoader from "react-native-animated-loader";
import { BarIndicator } from 'react-native-indicators';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { Entypo,Ionicons,MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../colors/colors'
import Rusha from 'rusha';
import { Buffer } from "buffer";
import * as ImagePicker from 'expo-image-picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import { AllKeys } from '../../keys/AllKeys';
import { useSelector,useDispatch } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import WarningModal from '../../components/WarningModal';
import BankAccountModal from './components/BankAccountModal';

export default function Guarantor({ navigation }) {
    const [isPending, setIsPending] = useState(false)
    const [firstname, setFirstName] =  useState('')
    const [lastname, setLastName] =  useState('')
    const [number, setNumber] =  useState('')
    const [relationship, setRelationShip] =  useState('')
    const [nin, setNin] =  useState('')
    const [address, setAddress] = useState('')
    const [accountName,setAccountName] = useState('')
    const [bankModalVisible, setBankModalVisible] = useState(false);
    const [bankName,setBankName] = useState('')
    const [bvn,setBvn] = useState('')
    const [accountNumber,setAccountNumber] = useState('')
    const [img, setImage] = useState('')
    const [imgInfo, setImageInfo] = useState({fileId:'',fileName:''})
    const [progress, setProgress] = useState(0.33)
    const [uploadingImage, setUploadingImage] = useState(false)
    const { cleaner_id,displayName } = useSelector(state => state.login)
    const [showFinishModal, setShowFinishModal] = useState(false)
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const dispatch = useDispatch()

    useEffect(() => {
        const getGuarantor = async() => {
            var req = await fetch(`${AllKeys.ipAddress}/getSecondGuarantor?cleaner_id=${cleaner_id}`)
            const { success,rows } = await req.json()

            if (success) {
                setAddress(rows.address)
                setNin(rows.nin)
                setNumber(rows.number)
                setLastName(rows.lastname)
                setFirstName(rows.firstname)
                setImage(rows.img)
                setRelationShip(rows.relationship)
                setBvn(rows.bvn)
                setAccountName(rows.account_name)
                setAccountNumber(rows.account_number)
                setBankName(rows.bank_name)
                setImage(img)
                setImageInfo({ fileId:rows.fileId,fileName:rows.fileName })
            }
        }
        getGuarantor()
    }, [])

    const updateDetails = () => {
        fetch(`${AllKeys.ipAddress}/updateSecondGuarantor?accountName=${accountName}&accountNumber=${accountNumber}&bankName=${bankName}&bvn=${bvn}&cleaner_id=${cleaner_id}&img=${img}&fileId=${imgInfo.fileId}&fileName=${imgInfo.fileName}&firstname=${firstname}&lastname=${lastname}&nin=${nin}&number=${number}&address=${address}&relationship=${relationship}`)
    }
    const next = (page) => {
        if (page === 2) {
            setProgress(0.66)
        }else if (page === 3) {
            setProgress(1)
        }
        updateDetails()
    }
    const finish = async() => {
        setShowFinishModal(false)
        setIsPending(true)
        var req = await fetch(`${AllKeys.ipAddress}/getGuarantor?cleaner_id=${cleaner_id}`)
        const { success,rows } = await req.json()
        if (success) {
            if (rows.bvn && rows.bvn.length > 0) {
                if (bvn == rows.bvn) {
                    setIsPending(false)
                    showMessage({
                        type:'danger',
                        message:'Error',
                        description:'Cannot use same guarantor twice',
                        duration:5000
                    })
                    return
                }else{
                    updateDetails()
                    setIsPending(false)
                    fetch(`${AllKeys.ipAddress}/updateStatus?status=pending&cleaner_id=${cleaner_id}`)
                    dispatch({ type:'UPDATE_STATUS',payload: {status:'pending'} })
                    showMessage({
                        type:'success',
                        message:'Verification in review',
                        description:'Verification might take 3 - 5 days.',
                        duration:5000
                    })
                }
            }
        }
        navigation.pop()
    }
    const pickGuarantor = (relation) => {
        setRelationShip(relation)
        bottomSheetRef.current.close()
    }
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1.91, 1],
          exif:true,
          base64:true,
          quality: 1,
        });
        if (!result.cancelled && result.uri) {
            setUploadingImage(true)
            // FileSystem.read
            const fileAsync = await fetch(`${AllKeys.ipAddress}/readFileName?uri=${result.uri}`)
            const fileName = await fileAsync.text()
            const binaryImage = Buffer.from(result.base64, 'base64')
            const digest = Rusha.createHash().update(binaryImage).digest('hex'); 
        const encode = await fetch(`${AllKeys.ipAddress}/encode?string=${'11198404582a' + ':' + '0040d76aa68144c725cb19a193f1f5ce68b4afc037'}`)
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
                bucketId : __DEV__ ? "f1216149f884f0348518021a" : "01a1c1f9f8e420448548021a"
            })
        })
        let { uploadUrl,authorizationToken } = await res.json()
        const uploadImage = await fetch(`${uploadUrl}`, {
            method:'POST',
            headers:{
                'Authorization': `${authorizationToken}`,
                'Content-Type' : 'b2/x-auto',
                'X-Bz-File-Name':`secondguarantor/${displayName}${cleaner_id}/${fileName}`,
                'X-Bz-Content-Sha1' : `${digest}`,
                
            },
            body: binaryImage
        }).then(async(result) => {
            const data = await result.json()
            setImageInfo({fileName:data.fileName, fileId:data.fileId})
            setImage(`https://f004.backblazeb2.com/file/${__DEV__ ? 'blipmooretest' : 'blipmoore'}/secondguarantor/${displayName}${cleaner_id}/${fileName}`);
            setUploadingImage(false)
        }).catch(err => {
            showMessage({
                type:'danger',
                description:'Please contact the admin',
                message:'Error'
            })
        })
        }
    };
    const deleteImage = async() => {
        setUploadingImage(true)
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
                description: "Couldn't get auth token. Please contact support or try again later",
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
                fileId : imgInfo.fileId,
                fileName: imgInfo.fileName
            })
        })
        var req = await res.json()
        if (req.fileId) {
            fetch(`${AllKeys.ipAddress}/deleteSecondGuarantorImage?cleaner_id=${cleaner_id}&fileId=${imgInfo.fileId}`)
            setUploadingImage(false)
            setImage('')
            setImageInfo({ fileId:null, fileName:null })
            showMessage({
                type:'success',
                message:'Success',
                description:'Image successfully deleted!'
            })
        }
    }
    const declineSubmission = () => {
        setShowFinishModal(false)
    }
    const changeBankModalVisible = (status,data) => {
        setBankModalVisible(false)   
    }
    const completedBankDetails = (bvn,accountName,accountNumber,bankName) => {
        setAccountName(accountName)
        setAccountNumber(accountNumber)
        setBankName(bankName)
        setBvn(bvn)
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
  return (
    <SafeAreaView style={styles.container}>
        <BankAccountModal completedBankDetails={completedBankDetails} bankModalVisible={bankModalVisible} changeBankModalVisible={changeBankModalVisible} />
        <WarningModal acceptFunction={finish} positive={'Submit'} negative={'Cancel'} declineFunction={declineSubmission} title={'All info would be verified including address. Any false information would require you to pay again.'} showModal={showFinishModal} />
        <Bar animated={true} progress={progress} color={colors.purple} animationType='spring' width={null} borderColor={colors.purple} borderRadius={5} />
        <View style={{ marginVertical:10,padding:10 }}>
            <View style={{ marginVertical:5 }}>
                <Text style={{ opacity:0.6 }}>A guarantor is anyone who can be called upon incase of emergencies</Text>
            </View>
            {
            progress === 0.33
            ?
            <>
            <View style={styles.parentInput}>
                <View style={styles.inputContainerTitle}>
                    <Text style={styles.title}>Second Guarantor's FirstName</Text>
                </View>
                <Animatable.View>
                    <TextInput 
                        style={styles.input}
                        autoFocus 
                        value={firstname} 
                        onChangeText={(val) => setFirstName(val)} 
                        placeholder="What is your guarantor's firstname?" 
                    />
                </Animatable.View>
            </View>
            <View style={styles.parentInput}>
                <View style={styles.inputContainerTitle}>
                    <Text style={styles.title}>Second Guarantor's LastName</Text>
                </View>
                <Animatable.View>
                    <TextInput 
                        style={styles.input}
                        value={lastname} 
                        onChangeText={(val) => setLastName(val)} 
                        placeholder="What is your guarantor's lastname?" 
                    />
                </Animatable.View>
            </View>
            <View style={styles.parentInput}>
                <View style={styles.inputContainerTitle}>
                    <Text style={styles.title}>Second Guarantor's NIN</Text>
                </View>
                <Animatable.View>
                    <TextInput 
                        style={styles.input}
                        keyboardType='numeric'
                        maxLength={11}
                        value={nin} 
                        onChangeText={(val) => setNin(val)} 
                        placeholder="What is your guarantor's NIN?" 
                    />
                </Animatable.View>
            </View>
            {
                firstname && nin && lastname
                ?
                <TouchableOpacity onPress={() => next(2)}>
                <View style={styles.button}>
                    <Text style={{ color:'white',fontFamily:'Murecho' }}>NEXT</Text>
                </View>
                </TouchableOpacity>
                :
                <View style={{...styles.button,opacity:0.6}}>
                    <Text style={{ color:'white',fontFamily:'Murecho' }}>NEXT</Text>
                </View>
            }
            </>
            :
            progress === 0.66
            ?
            <>
            <View style={styles.parentInput}>
                <View style={styles.inputContainerTitle}>
                    <Text style={styles.title}>Second Guarantor's Mobile number</Text>
                </View>
                <Animatable.View>
                    <TextInput 
                        style={styles.input}
                        autoFocus 
                        keyboardType='numeric'
                        maxLength={11}
                        value={number} 
                        onChangeText={(val) => setNumber(val)} 
                        placeholder="What is your guarantor's mobile number?" 
                    />
                </Animatable.View>
            </View>
            <View style={styles.parentInput}>
                <View style={styles.inputContainerTitle}>
                    <Text style={styles.title}>Second Guarantor's Home Address</Text>
                </View>
                <Animatable.View>
                    <TextInput 
                        style={styles.input}
                        value={address} 
                        onChangeText={(val) => setAddress(val)} 
                        placeholder="What is your guarantor's Home Address?" 
                    />
                </Animatable.View>
            </View>
            <View style={styles.parentInput}>
                <View style={styles.inputContainerTitle}>
                    <Text style={styles.title}>Second Guarantor's Relationship With You</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    Keyboard.dismiss()
                    bottomSheetRef.current.expand()
                }}>
                    <Animatable.View>
                        <TextInput 
                            style={{...styles.input, textTransform:'capitalize',color:colors.black}}
                            editable={false}
                            value={relationship}
                            placeholder="What is your relationship with your guarantor?" 
                        />
                    </Animatable.View>
                </TouchableOpacity>
            </View>
            {
                number && address && relationship
                ?
                <TouchableOpacity onPress={() => next(3)}>
                <View style={styles.button}>
                    <Text style={{ color:'white',fontFamily:'Murecho' }}>NEXT</Text>
                </View>
                </TouchableOpacity>
                :
                <View style={{...styles.button,opacity:0.6}}>
                    <Text style={{ color:'white',fontFamily:'Murecho' }}>NEXT</Text>
                </View>
            }
            </>
            :
            <>
                <View style={styles.parentInput}>
                    <View style={styles.inputContainerTitle}>
                        <Text style={styles.title}>Second Guarantor's BVN</Text>
                    </View>
                    <Animatable.View>
                        <TextInput 
                            style={styles.input}
                            value={bvn} 
                            editable={false}
                            onChangeText={(val) => setBvn(val)} 
                            placeholder="Enter bank account details below" 
                        />
                    </Animatable.View>
                </View>
                <View style={{ marginVertical:10 }}>
                    <Text style={{ fontFamily:'viga',fontSize:16 }}>Enter Your Second Guarantor's bank details</Text>
                </View>
                <TouchableNativeFeedback onPress={() => setBankModalVisible(!bankModalVisible)}>
                    <View style={styles.chooseImageBox}>
                        <View>
                          <Ionicons name="add" size={24} color="black" />
                        </View>
                        <View style={{ margin:3 }}>
                        {   bankName && bankName.length > 0 
                            ? 
                            <>
                              <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{accountName}</Text>
                              <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{bankName}</Text>
                              <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{accountNumber}</Text>
                            </>
                            : 
                            <Text>Add Bank Account</Text>
                        }
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <View style={{ marginVertical:10 }}>
                    <Text style={{ fontFamily:'viga',fontSize:16 }}>Upload Second Guarantor's Picture</Text>
                </View>
                    <View style={styles.chooseImageBox}>
                    {
                        uploadingImage
                        ?
                        <View style={{ flexDirection:'row',alignItems:'center' }}>
                            <LottieView
                                autoPlay
                                source={require('../../lottie/circle2.json')}
                                style={styles.smallLottie}
                            />
                            <Text style={{ fontSize:12,marginLeft:10 }}>Loading...</Text>
                        </View>
                        :
                        !uploadingImage && img && img.length > 0
                        ?
                        <>
                            <TouchableOpacity onPress={deleteImage}>
                                <MaterialIcons name="cancel" size={24} color="red" />
                            </TouchableOpacity>
                            <FastImage 
                                source={{ uri:img,priority:FastImage.priority.high }}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ width:100,height:100,borderRadius:100,marginTop:5 }}
                            />
                        </>
                        :
                        <TouchableNativeFeedback onPress={pickImage}>
                            <View>
                                <Text style={{ color:colors.purple,fontWeight:'bold',fontSize:14 }}>Choose Image</Text>
                            </View>
                        </TouchableNativeFeedback>
                    }
                    </View>
                {
                    isPending
                    ?
                      <View style={{...styles.button,backgroundColor:colors.grey}}>
                         <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
                      </View>
                    :
                    firstname && lastname && number && address && relationship && imgInfo.fileId && imgInfo.fileName && img && img.length > 5 && bankName && bankName.length > 0 && accountName && accountName.length > 0 && bvn && bvn.length > 0
                    ?
                    <TouchableOpacity onPress={() => setShowFinishModal(true)}>
                        <View style={styles.button}>
                            <Text style={{ color:'white',fontFamily:'Murecho' }}>FINISH</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <View style={{...styles.button,opacity:0.6}}>
                        <Text style={{ color:'white',fontFamily:'Murecho' }}>FINISH</Text>
                    </View>
                }
            </>
            }
        </View>
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            style={styles.bottomSheetContainer}
            backdropComponent={renderBackdrop}
        >
            <View style={styles.bottomSheetOption}>
                <TouchableNativeFeedback onPress={() => pickGuarantor('mother')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/mother.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Mother</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => pickGuarantor('father')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/father.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Father</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={styles.bottomSheetOption}>
                <TouchableNativeFeedback onPress={() => pickGuarantor('sibling')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/siblings.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Sibling</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => pickGuarantor('friend')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/friend.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Friend</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={styles.bottomSheetOption}>
                <TouchableNativeFeedback onPress={() => pickGuarantor('husband')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/husband.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Husband</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => pickGuarantor('wife')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/wife.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Wife</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={styles.bottomSheetOption}>
                <TouchableNativeFeedback onPress={() => pickGuarantor('neighbor')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/neighbor.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Neighbor</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => pickGuarantor('others')}>
                    <View style={styles.bottomSheetImage}>
                        <FastImage source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app images/others.png',priority:FastImage.priority.high }} resizeMode={FastImage.resizeMode.contain} style={{ width:20,height:20 }} />
                        <Text style={{ fontSize:15,fontFamily:'viga' }}>Others</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    parentInput:{
        marginVertical:10
    },
    inputContainerTitle:{
        marginBottom:10
    },
    title:{
        fontFamily:'viga',
        fontSize:15
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
    bottomSheetContainer:{
        padding:10
    },
    bottomSheetOption:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginVertical:10
    },
    bottomSheetImage:{
        borderRadius:10,
        borderColor:colors.purple,
        borderWidth:2,
        padding:10,
        width:'40%',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    input:{
        backgroundColor:colors.grey,
        padding:10,
        borderRadius:10
    },
    chooseImageBox:{
        borderStyle:'dashed',
        padding:30,
        borderColor:colors.purple,
        borderWidth:1.2,
        borderRadius:10,
        width:'100%',
        backgroundColor:colors.lightPurple,
        justifyContent:'center',
        alignItems:'center'
    },
    smallLottie:{
        width: 12,
        height: 12,
        transform:[ { scale:1.7 } ]
    },
})