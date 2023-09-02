import { StyleSheet, Text, TouchableNativeFeedback, View,ScrollView,InteractionManager, TouchableOpacity, Modal } from 'react-native'
import { MaterialIcons,MaterialCommunityIcons,FontAwesome } from '@expo/vector-icons';
import Progress from 'react-native-progress/Bar';
import { colors } from '../../../colors/colors'
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import { AllKeys } from '../../../keys/AllKeys';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';

export default function ListOfSpaces({ navigation,route }) {
    const { id } = useSelector(state => state.login)
    const isFocused = useIsFocused();
    const [instructions,setInstructions] = useState({ bedroom:[],closet:[],toilet:[],walkway:[],store:[],kitchen:[],balcony:[] })
    const [isPending,setIsPending] = useState(true)
    const [progress, setProgress] = useState({ bedroom:0,kitchen:0,balcony:0,toilet:0,walkway:0,store:0,closet:0 })
    const { customer_id,places,type,cleaner_id,amount,next_deep_clean,cleaning_interval,cleaning_interval_frequency,day_period } = route.params.activeOrder
    const [showEndOrderModal, setShowEndOrderModal] =  useState(false)
    const [isDeepClean,setIsDeepClean] = useState(false)

    useEffect(() => {
        if (moment(moment().valueOf()).isSame(next_deep_clean, 'day')) {
            setIsDeepClean(true)
        }
        InteractionManager.runAfterInteractions(async() => {
            await fetchInstr()
            await fetchProgress()
            setIsPending(false)
        })
    }, [isFocused])
    
    const fetchInstr = async() => {
        const req  = await fetch(`${AllKeys.ipAddress}/fetchInstructions?id=${customer_id}`)
        const { rows,success } = await req.json()
        if (success) {
            var bedroom = []
            var closet = []
            var balcony = []
            var toilet = []
            var store = []
            var kitchen = []
            var walkway = []
             for (let i = 0; i < rows.length; i++) {
                 if (rows[i].space === 'bedroom') {
                    bedroom.push(rows[i].instruction)
                 }else if (rows[i].space === 'closet') {
                    closet.push(rows[i].instruction)
                 }else if (rows[i].space === 'balcony') {
                    balcony.push(rows[i].instruction)
                 }else if (rows[i].space.includes('toilet')) {
                    toilet.push(rows[i].instruction)
                 }else if (rows[i].space === 'store') {
                    store.push(rows[i].instruction)
                 }else if (rows[i].space === 'kitchen') {
                    kitchen.push(rows[i].instruction)
                 }else if (rows[i].space === 'walkway') {
                    walkway.push(rows[i].instruction)
                 }
            }
            setInstructions(preEvents => {
                return {...preEvents, 
                    bedroom:[...bedroom],
                    closet:[...closet],
                    balcony:[...balcony],
                    toilet:[...toilet],
                    store:[...store],
                    kitchen:[...kitchen],
                    walkway:[...walkway],
                }
            })
        }
    }
    const fetchProgress = async() => {
        var time = moment().startOf('day') 
        const request = await fetch(`${AllKeys.ipAddress}/fetchSpaceProgress?sub_id=${route.params.activeOrder.id}&time=${time}`)
        const res =  await request.json()
        if (res.success) {
            var bedroom = 0
            var closet = 0
            var balcony = 0
            var toilet = 0
            var store = 0
            var kitchen = 0
            var walkway = 0
            for (let i = 0; i < res.rows.length; i++) {
                if (res.rows[i].place === 'bedroom') {
                    bedroom += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'closet') {
                    closet += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'balcony') {
                    balcony += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place.includes('toilet')) {
                    toilet += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'store') {
                    store += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'kitchen') {
                    kitchen += Number(res.rows[i].progress_bar)
                }else if (res.rows[i].place === 'walkway') {
                    walkway += Number(res.rows[i].progress_bar)
                }
            }
            setProgress(preEvents => {
                return {...preEvents,bedroom,closet,balcony,store,walkway,kitchen,toilet}
            })
        }
        setIsPending(false)
    }
    const endOrder = async() => {
        setIsPending(true)
        setShowEndOrderModal(false)
        var time = moment().startOf('day').valueOf()
        var end_time = moment().valueOf()
        var next_deep_clean = moment().startOf('day').add(1, 'months').valueOf()
        var next_cleaning_order
        var arr = []
        function capitalizeFirstLetter(string) {
            return string[0].toUpperCase() + string.slice(1);
        }
        if (cleaning_interval === 'weekly') {
            day_period.split(',').map(day => {
                arr.push(moment().startOf('day').day(`${capitalizeFirstLetter(day)}`).valueOf())
            })
            next_cleaning_order = moment.min(arr)
        }else if (cleaning_interval === 'monthly') {
            if (cleaning_interval_frequency == 1) {
                next_cleaning_order = moment().startOf('day').add(1, 'months').day(`${capitalizeFirstLetter(day_period)}`).valueOf()   
            }else if (cleaning_interval_frequency == 2) {
                next_cleaning_order = moment().startOf('day').add(2, 'weeks').day(`${capitalizeFirstLetter(day_period)}`).valueOf()
            }else if (cleaning_interval_frequency == 4) {
                next_cleaning_order = moment().startOf('day').day(`${capitalizeFirstLetter(day_period)}`).valueOf()
            }
        }
        console.log(moment(next_cleaning_order).format('ddd MMM YYYY'))
        // We are adding amount to check if its a free order. 0 means it's free therefore the sub should be deleted
        const req = await fetch(`${AllKeys.ipAddress}/endSubOrder?cleaner_id=${id}&day_period=${day_period}&next_cleaning_date=${next_cleaning_order}&next_deep_clean=${next_deep_clean}&isDeepClean=${isDeepClean}&amount=${amount}&sub_id=${route.params.activeOrder.id}&end_time=${end_time}&time=${time}`)
        const { success } = await req.json()
        setIsPending(false)
        if (success) {
            showMessage({
                message:'Congrats!',
                description:'Job marked as completed. Well done.',
                type:'success'
            })
            navigation.pop()
        }else{
            showMessage({
                message:'Error',
                description:'Could not end order. Please contact support',
                type:'danger'
            })
        }
    }
  return (
    <View style={styles.container}>
        {
            isPending
            ?
        <AnimatedLoader 
          visible={isPending}
          source={require('../../../lottie/circle2.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        :
        <>
        <Modal
            visible={showEndOrderModal}
            transparent={true}
            animationType='fade'
            statusBarTranslucent={true}
            onRequestClose={() => setShowEndOrderModal(false)}
        >
            <View style={{ flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:10 }}>
                <View style={{ alignItems:'center',padding:30,backgroundColor:colors.white,borderRadius:20 }}>
                    <Text style={{ fontFamily:'viga',alignItems:'center' }}>Are you sure you want end order?</Text>
                    <Text style={{ alignItems:'center',fontSize:14,textAlign:'center' }}>Ensure you have marked all the spaces as completed</Text>
                    <TouchableOpacity onPress={() => setShowEndOrderModal(false)}>
                        <View style={{ backgroundColor:colors.black,borderRadius:10,padding:10,marginVertical:15,paddingHorizontal:20 }}>
                            <Text style={{ color:colors.white }}>No, I'm not done</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={endOrder}>
                        <View>
                            <Text style={{ color:colors.purple }}>Yes, I'm done</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <ScrollView>
            {
              places.split(',').map(place => {
                var letters = place.replace(/[^a-z]/g, '')
                var number = place.replace(/[^0-9]/g, '')
                return (
                  <View style={styles.placeContainer} key={place}>
                      <TouchableNativeFeedback onPress={() => navigation.navigate('Space', {letters,number,activeOrder:route.params.activeOrder})}>
                            <View style={styles.place}>
                                <Text style={{ fontWeight:'bold',letterSpacing:1 }}>{number} {letters}</Text>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                            </View>
                      </TouchableNativeFeedback>
                      <View style={{ marginVertical:10 }}>
                        <Progress color={colors.purple} progress={
                            letters === 'bedroom' ? 
                            progress.bedroom / number :
                            letters === 'closet' ? 
                            progress.closet / number :
                            letters === 'balcony' ? 
                            progress.balcony / number :
                            letters.includes('toilet') ? 
                            progress.toilet / number :
                            letters === 'wallway' ? 
                            progress.walkway / number :
                            letters === 'store' ? 
                            progress.store / number :
                            letters === 'kitchen' ? 
                            progress.kitchen / number :
                            0
                        } width={null} borderWidth={1} />
                      </View>
                      <TouchableOpacity onPress={() => navigation.navigate('Space', {letters,number,activeOrder:route.params.activeOrder})}>
                        <View style={styles.button}>
                          <Text style={{ color:colors.white }}>Start Cleaning {letters}</Text>
                        </View>
                      </TouchableOpacity>
                        <View style={styles.instruction}>
                            <Text style={{ textAlign:'center',fontFamily:'viga',width:'100%' }}>Instructions on {letters}</Text>
                        </View>
                      {
                        letters === 'bedroom' && instructions.bedroom.length > 0 &&
                            <>
                                {
                                    instructions.bedroom.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'kitchen' && instructions.kitchen.length > 0 &&
                            <>
                                {
                                    instructions.kitchen.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'closet' && instructions.closet.length > 0 &&
                            <>
                                {
                                    instructions.closet.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'balcony' && instructions.balcony.length > 0 &&
                             <>
                                {
                                    instructions.balcony.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters.includes('toilet') && instructions.toilet.length > 0 &&
                            <>
                                {
                                    instructions.toilet.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'walkway' && instructions.walkway.length > 0 &&
                             <>
                                {
                                    instructions.walkway.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                      {
                        letters === 'store' && instructions.store.length > 0 &&
                            <>
                                {
                                    instructions.store.map(instr => (
                                        <View key={instr} style={{ flexDirection:'row',justifyContent:'space-between' }}>
                                            <View style={styles.instruction}>
                                                <Text>{instr}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </>
                        }
                  </View>
                )
              })
            }
        </ScrollView>
        </>   
        }
        {
            cleaner_id === id &&
            <TouchableNativeFeedback onPress={() => setShowEndOrderModal(true)}>
                <View style={{...styles.button,backgroundColor:'green',padding:20}}>
                    <Text style={{ color:'white',fontFamily:'viga',fontSize:18 }}>Mark Order as Complete</Text>
                </View>
            </TouchableNativeFeedback>
        }
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    placeContainer:{
        backgroundColor:'#dcdcdc',
        marginVertical:10,
        padding:10,
        borderRadius:5
    },
    place:{
        padding:5,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    instruction:{
        backgroundColor:'#FAF9F6',
        borderWidth:1,
        borderColor:'#c4c4c4',
        borderRadius:5,
        padding:5,
        flexDirection:'row',
        alignItems:'center',
        marginBottom:5,
        width:'100%'
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
    lottie:{
        height:100,
        width:100
    }
})