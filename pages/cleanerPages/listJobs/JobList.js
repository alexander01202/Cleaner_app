import { StyleSheet, Text, View,TouchableNativeFeedback,FlatList,Animated,Dimensions,ScrollView, TouchableOpacity, Image } from 'react-native'
import { MaterialCommunityIcons,Ionicons,FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../colors/colors';
import { useEffect, useRef, useState,useMemo, useCallback } from 'react';
import { AllKeys } from '../../../keys/AllKeys';
import { currency } from '../../../currency/currency'
import { useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
import ContentLoader from "react-native-easy-content-loader";
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import { showMessage, hideMessage } from "react-native-flash-message";
import notifee, { IntervalTrigger, TriggerType, TimeUnit } from '@notifee/react-native';
import OneSignal from 'react-native-onesignal';
import WarningModal from '../../../components/WarningModal';
import { StreamChat } from 'stream-chat';
// import { useChatClient } from '../../../hooks/UseChatClient';
import _ from 'underscore';

const { width } = Dimensions.get('window')
const client = StreamChat.getInstance('449vt742ex2f');
export default function RequestPages({ navigation }) {
    const [isPending, setIsPending] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [enterprises, setEnterprises] = useState(null)
    const BottomSheetRef = useRef(null)
    const BottomSheetSupervisorRef = useRef(null)
    const { id,displayName } = useSelector(state => state.login)
    const { state,country } = useSelector(state => state.location)
    const scrollY = useRef(new Animated.Value(0)).current
    const [viewHeight, setViewHeight] = useState(null)
    const [isLoadingViewHeight, setIsLoadingViewHeight] = useState(false)
    const [quitEnterprise, setQuitEnterprise] = useState(null)
    // const { clientIsReady } = useChatClient(id,displayName);
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
      setIsPending(true)
      const getRequest = async() => {
        const getCleanerJobs = await fetch(`${AllKeys.ipAddress}/fetchCleanerJobs?cleanerId=${id}`)
        const getCleanerSubs = await fetch(`${AllKeys.ipAddress}/fetchCleanerSubscription?id=${id}`)
        const getSuperviosrJobs = await fetch(`${AllKeys.ipAddress}/fetchSupervisorJobs?cleanerId=${id}`)
        const { success,rows } = await getCleanerJobs.json()
        const res = await getSuperviosrJobs.json()
        const subRes = await getCleanerSubs.json()
        
        if (success && res.success)
        var arr = []
        var nxtArr = []
        var cusArr = []
        for (let i = 0; i < rows.length; i++) {
          const getEnterpiseInfo = await fetch(`${AllKeys.ipAddress}/getEnterpriseInfo?id=${rows[i].enterprise_id}`);
          const jobRes = await getEnterpiseInfo.json()

          arr.push(Object.assign(jobRes.row[0],{cleanerFilled:true} ))
        }
        for (let s = 0; s < res.rows.length; s++) {
          const getEnterpiseInfo = await fetch(`${AllKeys.ipAddress}/getEnterpriseInfo?id=${res.rows[s].enterprise_id}`);
          const response = await getEnterpiseInfo.json()

          nxtArr.push(Object.assign(response.row[0],{supervisorFilled:true} ))
        }          
        for (let c = 0; c < subRes.rows.length; c++) {
          const req = await fetch(`${AllKeys.ipAddress}/fetchSubscriptionById?id=${subRes.rows[c].sub_id}`)
          const { rows } = await req.json()
          if (rows) {
            const fetchCusAddress = await fetch(`${AllKeys.ipAddress}/fetchUserAddress?id=${rows.customer_id}`)
            const address = await fetchCusAddress.json()
            const { state,country,lga,city,estate,street_name,street_number } = address.rows
            cusArr.push({ 
              id:rows.id,
              name_of_business:rows.customer_name,
              day_period:rows.day_period,
              time_period:rows.time_period,
              type:'home',
              num_of_cleaner:rows.num_of_cleaner,
              num_of_supervisor:rows.num_of_supervisor,
              location:`${street_number},${street_name},${estate && estate.length > 0 ? estate + ',' : ''}${city},${lga},${state}`,
              estate,
              city,
              lga,
              streetNumber:street_number,
              streetName:street_name,
              state,
              country 
            }) 
          }
        }
      
        let arr2Map =  _.uniq(nxtArr, ['id'])
        let combined = []
        if (arr.length > 0) {
          combined = arr.map(d => Object.assign(d, arr2Map[d.id])); 
        }else{
          arr2Map.map(arr => combined.push(arr))
        }
        cusArr.map(cus => combined.push(cus))
        // Do not remove the above code. It filters every duplicate to become unique
        setEnterprises(combined)
        setIsPending(false)
      }
      getRequest()
    }, [refresh])
    const onLayout=(event)=> {
      setIsLoadingViewHeight(true)
      const {x, y, height, width} = event.nativeEvent.layout;
      if (!viewHeight) 
      setViewHeight(height)

      setIsLoadingViewHeight(false)
    }
    const quitJob = async(role) => {
      var req
      setShowModal(false)
      if (quitEnterprise) {
        setIsPending(true)
        if (quitEnterprise.type === 'home') {
          var channelKey = quitEnterprise.id + '' + id
          const channel = client.channel('messaging', `${channelKey}`, {
            name: `${quitEnterprise.name_of_business}`,
          }); 
          channel.removeMembers([`${id}`], { text: `${displayName} left the channel.` })
          req = await fetch(`${AllKeys.ipAddress}/quitHome?day_period=${quitEnterprise.day_period}&sub_id=${quitEnterprise.id}&cleaner_id=${id}`)
        }else{
          req = await fetch(`${AllKeys.ipAddress}/quitEnterprise?day_period=${quitEnterprise.day_period}&enterprise_id=${quitEnterprise.id}&cleaner_id=${id}`)
        }
        const { success } = await req.json() 
        if (success) {
          setRefresh(!refresh) 
          OneSignal.deleteTag(`${quitEnterprise.name_of_business}`);
          notifee.displayNotification({
            subtitle: '😕',
            title:`<p><b>Uuggh ${displayName}.</b> We don't like quitters.</p>`,
            body: '<p>Hopefully you change your mind 😊.</p>',
            android: {
              channelId: 'apply_success',
            }
          });
        }else{
          showMessage({
            message: "Error",
            description: "Could not remove you from job. Please try again later.",
            type: "danger"
          });
        }
      }
    }
    const changeModalDisplay = () => {
      setShowModal(false)
    }
    var num = 1
    var loaderArr = [1,2,3,4,5,6,7,8]
    // renders
  return (
    <View style={styles.container}>
      <WarningModal acceptFunction={quitJob} title={'Are you sure you want to quit?'} positive={'Yes, I want to quit'} negative={"No, I don't want to quit"} declineFunction={changeModalDisplay} showModal={showModal} />
      <View style={{ marginVertical:10 }}>
        <Text style={{ fontFamily:'viga',fontSize:28,color:colors.black }}>Your Jobs</Text>
      </View>
      {
      isPending ? 
      <ScrollView>
        {
          loaderArr.map(arr => (
            <View key={arr} style={{ ...styles.orderBox,backgroundColor:'rgba(225,225,225,1)' }}>
            <ContentLoader active avatar pRows={1} titleStyles={{  }} />
            <ContentLoader
              title={false}
              active
              pRows={3}
              pWidth={['50%', '50%', '50%']}
              paragraphStyles={{ marginTop:20 }}
            />
            <ContentLoader active title={false} pRows={1} pWidth={[ '100%' ]} paragraphStyles={{ marginVertical:10 }} pHeight={[ 35 ]} />
          </View>
          ))
        }
      </ScrollView>
      :
      !enterprises || enterprises.length < 1 ?
        <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
            {/* <MaterialCommunityIcons name="file-document-edit-outline" size={154} color="grey" /> */}
            <View style={{ width:'60%',opacity:0.6,height:'30%' }}>
              <Image source={{uri:'https://f004.backblazeb2.com/file/blipmoore-cleaner/jobsearch.png'}} resizeMode='contain' style={{ width:'100%',height:'100%' }} />
            </View>
            <View>
              <Text style={{ fontWeight:'bold',letterSpacing:1,fontSize:20 }}>No Jobs Yet</Text>
            </View>
        </View> 
        :
      <Animated.FlatList 
        onRefresh={() => setRefresh(!refresh)}
        refreshing={isPending}
        keyExtractor={(item) => num++}
        data={enterprises}
        onScroll={
        Animated.event(
          [{ nativeEvent: { contentOffset:{y: scrollY} } }],
          { useNativeDriver:true },
        )}
        renderItem={({ item,index }) => {
          var inputRange = [-1,0,1,1]
          if (viewHeight) {
            inputRange = [
              -1, 0,((viewHeight * index) + (index * 20)),(viewHeight * (index + 5) + (index * 20))
            ]
          }
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1,1,1,0],
            extrapolate: "clamp"
          }) 
          return(
            <>
          <Animated.View onLayout={onLayout} style={{...styles.orderBox, transform:[{ scale }]}}>
            {
              item.cleanerFilled &&
              <Text style={{ color:'green',textAlign:'right',fontFamily:'viga',fontSize:12 }}>You are currently a cleaner here</Text>
            }
            {
              item.supervisorFilled &&
              <Text style={{ color:'green',textAlign:'right',fontFamily:'viga',fontSize:12 }}>You are currently a supervisor here</Text>
            }
          <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
            <View style={{ flexDirection:'row',alignItems:'center',marginVertical:10 }}>
              <View style={styles.avatar}>
                  <Text style={{ fontFamily:'Funzi',fontSize:24,color:colors.whitishBlue }}>{item.name_of_business.slice(0,1)}</Text>
              </View>
              <View style={{ margin:5,width:width - 200 }}>
                  <Text style={{fontFamily:'viga',color:colors.black,letterSpacing:1 }}>{item.name_of_business}</Text>
                  <Text numberOfLines={1} style={{ color:colors.black,opacity:0.6,fontSize:12 }}>{item.location}</Text>
              </View>
            </View>
            <View style={{ backgroundColor:colors.lightPurple,width:'20%',alignItems:'center',justifyContent:'center',height:20 }}>
                {/* <Ionicons name="call" size={14} color="white" /> */}
                <Text style={{ color:colors.purple,fontWeight:'bold',letterSpacing:1 }}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <View style={{ flexDirection:'row',alignItems:'center',marginVertical:5 }}>
                <Ionicons name="today-outline" size={14} style={{ marginRight:5 }} />
                <Text style={{ fontFamily:'viga',fontSize:12,letterSpacing:1,textTransform:'capitalize' }}>{item.day_period}</Text>
            </View> 
            <View style={{ flexDirection:'row',marginVertical:5,alignItems:'center' }}>
              <Ionicons name="time-outline" size={16} color={colors.darkPurple} style={{ marginRight:5 }} />
              <Text style={{ fontSize:12,fontWeight:'bold',letterSpacing:1 }}>{item.time_period.includes('6am') ? '6:00 am - 8:00 am' : item.time_period.includes('8am') ? '8:00 am - 10:00 am' : item.time_period.includes('10am') ? '10:00 am - 12:00 am' : item.time_period.includes('12pm') ? '12:00 pm - 2:00 pm' : item.time_period.includes('2pm') ? '2:00 pm - 4:00 pm' : item.time_period.includes('4pm') ? '4:00 pm - 6:00 pm' : item.time_period.includes('6pm') ? '6:00 pm - 8:00 pm' : '10:00 pm - 12:00 pm'}</Text>
            </View>
          </View>
            <TouchableOpacity onPress={() => navigation.navigate('HomePage',{ screen:'Enterprise', params:{ screen:'Overview',params: {item} }} )}>
                <View style={styles.button}>
                    <Text style={{ color:'white',fontWeight:'bold',textTransform:'capitalize' }}>View {item.type}</Text>
                </View>
            </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setQuitEnterprise(item)
                setShowModal(true)
                }}>
                <View style={{...styles.button, backgroundColor:'transparent',borderColor:colors.black,borderWidth:1 }}>
                  <Text style={{ color:colors.black,textAlign:'center',fontWeight:'bold' }}>Quit Job</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
        </>
        )
      }
      }
      />
    }
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    date:{
        color:colors.black,
        opacity:0.6
      },
      orderContainer:{
        flexDirection:'row',
        justifyContent:'space-around'
      },
      infoDets:{
        color:colors.black,
        fontFamily:'viga'
      },
      orderBox:{
        backgroundColor:colors.grey,
        padding:10,
        width:'100%',
        elevation:5,
        marginVertical:10,
        borderRadius:20
      },
      info: {
        width:'100%',
        marginVertical:10
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
      line:{
        borderWidth:1,
        borderColor:colors.purple,
        marginVertical:5
      },
    button:{
        backgroundColor:colors.black,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:'100%',
        alignSelf:'center',
        borderRadius:10,
        marginBottom:10
    },
    lottie: {
      width: 100,
      height: 100
    },
    bottomSheetContainer:{
        padding:10
    },
})