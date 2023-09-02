import { StyleSheet, Text, View,Image,FlatList,Animated,Dimensions,ScrollView, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons,Ionicons,FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../colors/colors';
import { useEffect, useRef, useState } from 'react';
import { AllKeys } from '../../keys/AllKeys';
import { useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
import ContentLoader from "react-native-easy-content-loader";
import { currency } from '../../currency/currency'
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window')
export default function RequestPages({ navigation }) {
    const [isPending, setIsPending] = useState(true)
    const [enterprises, setEnterprises] = useState(null)
    const { id,cleaner_id } = useSelector(state => state.login)
    const { state,country } = useSelector(state => state.location)
    const scrollY = useRef(new Animated.Value(0)).current
    const [viewHeight, setViewHeight] = useState(null)
    const [isLoadingViewHeight, setIsLoadingViewHeight] = useState(false)

    useEffect(() => {
      getRequest()
    }, [])
    const getRequest = async() => {
      setIsPending(true)
      const getHireTime = await fetch(`${AllKeys.ipAddress}/fetchCleanerWorkTime?cleanerId=${cleaner_id}`)
      const { success,row,message } = await getHireTime.json()
      if (!success && message) {
        setIsPending(false)
        showMessage({
          type:'danger',
          message:'Error',
          description:'Please set your work hours'
        })
        setTimeout(() => {
          navigation.navigate('HirePeriod')
        }, 500);
        return
      }
      if (success)
          var time = row.work_time.split(","); 
          var days = row.work_days.split(",");
          var arr = []
          var entId = ''
          var cusId = ''
            var request = await fetch(`${AllKeys.ipAddress}/getRequests?cleaner_id=${cleaner_id}&${cusId && cusId.length > 0 ? 'customerId='+cusId : 'customerId=""'}&${entId && entId.length > 0 ? 'businessId='+entId : 'businessId=""'}&state=${state}&country=${country}&time_period=${row.work_time}&day_period=${row.work_days}`)
            var res = await request.json()
            if (res.success) {
              if (res.customer && res.customer.length > 0) {
                
                // res.customer.map(sub => {
                //   arr.push({ 
                //     id:sub.id,
                //     name_of_business:sub.customer_name,
                //     type:'home',
                //     num_of_cleaners:sub.num_of_cleaners,
                //     num_of_supervisor:sub.num_of_supervisor,
                //     day_period:sub.day_period,
                //     time_period:sub.time_period,
                //     skill_level:'supervisor',
                //     monthly_cleaner_payment:sub.amount,
                //     location:`${sub.streetNumber},${sub.streetName},${sub.lga},${sub.estate && sub.estate + ','}${sub.city},${sub.state}`,
                //     estate:sub.estate,
                //     city:sub.city,
                //     lga:sub.lga,
                //     streetNumber:sub.streetNumber,
                //     streetName:sub.streetName,
                //     state:sub.state,
                //     country:sub.country 
                //   })
                // })
              }
              for (let i = 0; i < res.rows.length; i++) {
              if (res.rows.length > 0) {
                // if (res.rows[i].type === 'home') {
                //   if (cusId.length > 0) {
                //     cusId += "," + Number(res.rows[i].customer_id)  
                //   }else{
                //     cusId += Number(res.rows[i].customer_id)
                //   }
                // }else{
                //   if (entId.length > 0) {
                //     entId += "," + Number(res.rows[i].id)  
                //   }else{
                //     entId += Number(res.rows[i].id)
                //   }
                // }
                var req = await fetch(`${AllKeys.ipAddress}/checkCleanerEmployed?type=${res.rows[i].type}&cleaner_id=${cleaner_id}&enterprise_id=${res.rows[i].id}`)
                var response = await req.json()
                const { cleanerFilled, supervisorFilled } = response
                if (response.success) {
                  arr.push(Object.assign(res.rows[i], {cleanerFilled:cleanerFilled ,supervisorFilled:supervisorFilled}) )
                }else{
                  arr.push(res.rows[i])
                }
              }
            }
            }
      setEnterprises(arr)
      setIsPending(false)
    }
    const onLayout=(event)=> {
      setIsLoadingViewHeight(true)
      const {x, y, height, width} = event.nativeEvent.layout;
      if (!viewHeight) 
      setViewHeight(height)

      setIsLoadingViewHeight(false)
    }
    var num = 1
    var loaderArr = [1,2,3,4,5,6,7,8]
  return (
    <View style={styles.container}>
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
            <View style={{ width:'60%',opacity:0.6,height:'30%' }}>
              <Image source={{ uri:'https://f004.backblazeb2.com/file/blipmoore-cleaner/jobsearch.png' }} resizeMode='contain' style={{ width:'100%',height:'100%' }} />
            </View>
            <Text style={{ fontWeight:'bold',letterSpacing:1,fontSize:16 }}>No request found</Text>
        </View> 
        :
      <Animated.FlatList 
        keyExtractor={(item) => num++}
        refreshing={isPending}
        data={enterprises}
        onRefresh={getRequest}
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
              <Text style={{ fontSize:12,fontWeight:'bold',letterSpacing:1 }}>
                {item.time_period.includes('6am') && '6:00 am' }
                {item.time_period.includes('8am') && '8:00 am' }
                {item.time_period.includes('10am') && '10:00 am'} 
                {item.time_period.includes('12pm') && '12:00 pm' }
                {item.time_period.includes('2pm') && '2:00 pm'}
                {item.time_period.includes('4pm') && '4:00 pm'}
                {item.time_period.includes('6pm') && '6:00 pm'}
              </Text>
            </View>
          </View>
            <TouchableOpacity onPress={() => navigation.navigate('Overview',{item} )}>
                <View style={styles.button}>
                    <Text style={{ color:'white',textTransform:'capitalize' }}>View {item.type}</Text>
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
        marginVertical:10,
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
        borderRadius:10
    },
    lottie: {
      width: 100,
      height: 100
    },
})