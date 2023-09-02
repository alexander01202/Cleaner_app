import { StyleSheet, Text, View,Vibration,TouchableNativeFeedback,Animated,Dimensions,ScrollView,TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../colors/colors';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { Ionicons,FontAwesome } from '@expo/vector-icons';
import { AllKeys } from '../../keys/AllKeys';
import ContentLoader from "react-native-easy-content-loader";
import { useSelector } from 'react-redux';
import { currency } from '../../currency/currency';
import moment from 'moment';
import { Fragment } from 'react';

export default function FutureOrder({ navigation }) {
  const { id } = useSelector(state => state.login)
  const [jobs, setJobs] = useState(null)
  const scrollY = useRef(new Animated.Value(0)).current
  const [viewHeight, setViewHeight] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [isLoadingViewHeight, setIsLoadingViewHeight] = useState(false)
  const ONE_SECOND_IN_MS = 50;
  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS
  ];
  var num = 1
  var loaderArr = [1,2,3,4,5,6,7,8]
  var futureDayCount = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
  const onLayout=(event)=> {
    setIsLoadingViewHeight(true)
    const {x, y, height, width} = event.nativeEvent.layout;
    if (!viewHeight) 
    setViewHeight(height)

    setIsLoadingViewHeight(false)
  }
  useEffect(() => {
    setIsPending(true)
    const fetchFutureOrders = async() => {
      const req = await fetch(`${AllKeys.ipAddress}/fetchAllCleanerJobs?cleanerId=${id}`)
      const { enterprise,customer,success } = await req.json()
      var fullArr = []
      var arr = []
      if (customer) {
        customer.map(sub => {
          arr.push({ id:sub.id,name_of_business:sub.customer_name,type:'home',num_of_cleaner:sub.num_of_cleaner,num_of_supervisor:sub.num_of_supervisor,day_period:sub.day_period,time_period:sub.time_period,monthly_cleaner_payment:sub.amount,location:'Click button to view', })
        })
      }
      fullArr.push(...arr,...enterprise)
      setJobs(fullArr)
      setIsPending(false)
    }
    fetchFutureOrders()
  
  }, [])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      // Prevent default behavior
      Vibration.vibrate(PATTERN)
      
    });
    return () => unsubscribe()
  }, [navigation])
  
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
      <ScrollView>
        {
      futureDayCount.map(count => {
       var reduced = jobs.reduce((filtered, option) => {
          if (option.day_period.includes((moment().startOf('day').add(count,'days').format('dddd')).toLowerCase())) {
            filtered.push(option)
          }
          return filtered
        }, [])
      //  var oppositeReduced = jobs.reduce((filter, option) => {
      //     if (!option.day_period.includes((moment().startOf('day').add(count,'days').format('dddd')).toLowerCase())) {
      //       filter.push(option)
      //     }
      //     return filter
      //   }, [])
        return (
      <>
      <View style={{ margin:5,flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
        <Text style={{ fontFamily:'viga' }}>{moment().startOf('day').add(count, 'days').format('Do')} {moment().startOf('day').add(count, 'days').format('MMMM')} {moment().startOf('day').add(count, 'days').format('YYYY')}</Text>
        <Text style={{ opacity:0.6,fontFamily:'Murecho',textTransform:"uppercase" }}>{moment().startOf('day').add(count,'days').format('dddd')}</Text>
      </View>
      <View style={styles.line} />
      {
        reduced.map(item => (
          <Fragment key={item.id}>
          <Animated.View onLayout={onLayout} style={styles.orderBox}>
          <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
            <View style={{ flexDirection:'row',alignItems:'center',marginVertical:10 }}>
              <View style={styles.avatar}>
                  <Text style={{ fontFamily:'Funzi',fontSize:24,color:colors.whitishBlue }}>{item.name_of_business.slice(0,1)}</Text>
              </View>
              <View style={{ margin:5 }}>
                  <Text style={{fontFamily:'viga',color:colors.black,letterSpacing:1 }}>{item.name_of_business}</Text>
                  <Text style={{ color:colors.black,opacity:0.6,fontSize:12 }}>{item.location}</Text>
              </View>
            </View>
            <View style={{ backgroundColor:colors.lightPurple,width:'20%',alignItems:'center',justifyContent:'center',height:20 }}>
                {/* <Ionicons name="call" size={14} color="white" /> */}
                <Text style={{ color:colors.purple,fontWeight:'bold',letterSpacing:1 }}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <View style={{ flexDirection:'row',alignItems:'center' }}>
              <Ionicons name="today-outline" size={16} color={colors.darkPurple} style={{ marginRight:5 }} />
              <Text style={{ fontSize:12,fontWeight:'bold',letterSpacing:1 }}>{item.day_period}</Text>
            </View>
          </View>
          <View style={styles.info}>
            <View style={{ flexDirection:'row',alignItems:'center' }}>
              <Ionicons name="time-outline" size={16} color={colors.darkPurple} style={{ marginRight:5 }} />
              <Text style={{ fontSize:12,fontWeight:'bold',letterSpacing:1 }}>{item.time_period}</Text>
            </View>
          </View>
            <TouchableOpacity onPress={() => navigation.navigate('Enterprise',{screen:'Overview',params:{item}} )}>
                <View style={styles.button}>
                    <Text style={{ color:'white',textTransform:'capitalize' }}>View {item.type}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
        </Fragment>
       ))
      }
      {/* {
          oppositeReduced.map(item => (
          <View style={{ marginVertical:5 }}>
            <Text style={{ fontStyle:'italic',color:'grey' }}>{item.type}</Text>
          </View>
        ))
      } */}
      </>
      )   
})
}
</ScrollView>
     
    }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:10
  },
  date:{
    color:colors.black,
    opacity:0.6
  },
  orderContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
  },
  infoDets:{
    color:colors.black,
    fontFamily:'viga'
  },
  orderBox:{
    backgroundColor:colors.grey,
    borderRadius:20,
    padding:10,
    width:'100%',
    elevation:5,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical:10,
  },
  info: {
    width:'100%',
    marginVertical:5
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
})