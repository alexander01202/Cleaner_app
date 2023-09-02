import { Text, StyleSheet, View, ScrollView, TouchableWithoutFeedback,Platform,TouchableOpacity,TouchableNativeFeedback } from 'react-native'
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo,FontAwesome } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import { showMessage, hideMessage } from "react-native-flash-message";
// import { ipaddress } from '../../hostIPaddress';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
import { colors } from '../../colors/colors';
import { AllKeys } from '../../keys/AllKeys'

export default function HirePeriod({ navigation }) {
    const { displayName, email, id,cleaner_id } = useSelector(state => state.login)
    const [isPending, setIsPending] = useState(true)
    const [timePeriod, setTimePeriod] = useState({ six:false,eight:true,ten:false,twelvePM:false,twoPM:false,fourPM:false,sixPM:false,allTime:false })
    const [dayOfWeek, setDayOfWeek] = useState({ monday:false,tuesday:false,wednesday:false,thursday:false,friday:false,saturday:false,sunday:false,all:false })
    const [isFourDays, setIsFourDays] = useState(false)
    const [error, setError] = useState({ error:false, text:'' })
   
    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const snapPointsForBonusSheets = useMemo(() => ['25%', '50%'], []);

    // callbacks
    const handleSheetChanges = useCallback(() => {
    //   console.log('handleSheetChanges');
    }, []);
    const fetchHirePeriod = async() => {
        const getHireTime = await fetch(`${AllKeys.ipAddress}/fetchCleanerWorkTime?cleanerId=${cleaner_id}`)
        const { success,row } = await getHireTime.json()

        if (success) {
            var times = row.work_time.split(","); 
            var days = row.work_days.split(","); 

            days.map(day => {
                if (day === 'monday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, monday:true}
                    })
                }else if (day === 'tuesday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, tuesday:true}
                    })
                }else if (day === 'wednesday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, wednesday:true}
                    })
                }else if (day === 'thursday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, thursday:true}
                    })
                }else if (day === 'friday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, friday:true}
                    })
                }else if (day === 'saturday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, saturday:true}
                    })
                }else if (day === 'sunday') {
                    setDayOfWeek(prevEvents => {
                        return {...prevEvents, sunday:true}
                    })
                }
            })
            times.map(time => {
                if (time === '8am') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, eight:true}
                    })
                }else if (time === '6am') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, six:true}
                    })
                }else if (time === '10am') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, ten:true}
                    })
                }else if (time === '12pm') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, twelvePM:true}
                    })
                }else if (time === '2pm') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, twoPM:true}
                    })
                }else if (time === '4pm') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, fourPM:true}
                    })
                }else if (time === '6pm') {
                    setTimePeriod(prevEvents => {
                        return {...prevEvents, sixPM:true}
                    })
                }
            })
        }
        setIsPending(false)
    }
useEffect(() => {
    fetchHirePeriod()
}, [])

useEffect(() => {
    var count = 0;
    // var blockCode = false;
    Object.entries(dayOfWeek).map(item => {
        if (item[1]) {
            count++
        }if (count >= 4) {
            setIsFourDays(true) 
        }else{
            setError({ error:true, text:'Must be atleast 4 days' })
            setIsFourDays(false)
        }
    })

  
}, [dayOfWeek.sunday, dayOfWeek.monday, dayOfWeek.tuesday, dayOfWeek.wednesday, dayOfWeek.thursday, dayOfWeek.friday, dayOfWeek.saturday, dayOfWeek.sunday])

const updateDaysOfWeek = (day, enable) => {
    if (day === 'mon') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, monday:!dayOfWeek.monday, all:false}
        })
    }else if (day === 'tue') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, tuesday:!dayOfWeek.tuesday, all:false}
        })
    }else if (day === 'wed') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, wednesday:!dayOfWeek.wednesday, all:false}
        })
    }else if (day === 'thu') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, thursday:!dayOfWeek.thursday, all:false}
        })
    }else if (day === 'fri') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, friday:!dayOfWeek.friday, all:false}
        })
    }else if (day === 'sat') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, saturday:!dayOfWeek.saturday, all:false }
        })
    }else if (day === 'sun') {
        setDayOfWeek(prevEvents => {
            return {...prevEvents, sunday:!dayOfWeek.sunday, all:false }
        })
    }else if (day === 'all') {
        if (enable) {
            setDayOfWeek(prevEvents => {
                return {...prevEvents, sunday:true, monday:true, tuesday:true,wednesday:true,thursday:true,friday:true,saturday:true,all:true }
            })   
            setIsFourDays(true) 
        }else{
            setDayOfWeek(prevEvents => {
                return {...prevEvents, sunday:false, monday:false, tuesday:false,wednesday:false,thursday:false,friday:false,saturday:false,all:false }
            })
            setIsFourDays(false) 
        }
    }
}
const updateHireInfo = async() => {
    setIsPending(true)
    var days = '';
    var time = ''
    if (dayOfWeek.all) {
        days = 'monday,tuesday,wednesday,thursday,friday,saturday,sunday,'
    }else {
        if (dayOfWeek.monday) {
            days += 'monday,'
        }if (dayOfWeek.tuesday) {
            days += 'tuesday,'
        }if (dayOfWeek.wednesday) {
            days += 'wednesday,'
        }if (dayOfWeek.thursday) {
            days += 'thursday,'
        }if (dayOfWeek.friday) {
            days += 'friday,'
        }if (dayOfWeek.saturday) {
            days += 'saturday,'
        }if (dayOfWeek.sunday) {
            days += 'sunday,'
        }
    }
    if (timePeriod.allTime) {
        time = '6am,8am,10am,12pm,2pm,4pm,'
    }else{
        if (timePeriod.six) {
            time += '6am,'
        }
        if (timePeriod.eight) {
            time += '8am,'
        }
        if (timePeriod.ten) {
            time += '10am,'
        }
        if (timePeriod.twelvePM) {
            time += '12pm,'
        }
        if (timePeriod.twoPM) {
            time += '2pm,'
        }
        if (timePeriod.fourPM) {
            time += '4pm,'
        }
    }
    const res = await fetch(`${AllKeys.ipAddress}/updateHirePeriod?workDays=${days.slice(0, -1)}&workTime=${time.slice(0, -1) }&cleanerId=${cleaner_id}`)
    const { success } = await res.json()
    setIsPending(false)
    if (success) {
        showMessage({
            message: "Updated Successfully",
            description: "Please note that current subscriptions within previous time/day period would still be active.",
            type: "success"
        });
        navigation.navigate('HomePage')
    }else{
        showMessage({
            message: "Error",
            description: "Could not update. Please try again later",
            type: "danger"
        });
    }
}
return (
    <>
    <AnimatedLoader 
      visible={isPending}
      overlayColor="rgba(0,0,0,0.75)"
      source={require('../../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    <SafeAreaView style={styles.container}>
    <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
        <View style={{ margin:10 }}>
            <FontAwesome name="navicon" size={24} color={colors.black} />
        </View>
    </TouchableWithoutFeedback>    
        <View style={{ marginVertical:5 }}>
            <View style={{ margin:10 }}>
                <Text style={{...styles.question, margin:0 }}>What days are you available for cleaning?</Text>
                {!isFourDays && error && <Text style={{ color:'red',fontSize:12 }}>{error.text}</Text>}
            </View> 
            <ScrollView horizontal={true}>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('mon', !dayOfWeek.monday)}>
                    <View style={dayOfWeek.monday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.monday ? {fontWeight:'bold'} : null}>Monday</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('tue',!dayOfWeek.tuesday)}>
                    <View style={dayOfWeek.tuesday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.tuesday ? {fontWeight:'bold'} : null}>Tuesday</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('wed', !dayOfWeek.wednesday)}>
                    <View style={dayOfWeek.wednesday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.wednesday ? {fontWeight:'bold'} : null}>Wednesday</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('thu', !dayOfWeek.thursday)}>
                    <View style={dayOfWeek.thursday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.thursday ? {fontWeight:'bold'} : null}>Thursday</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('fri', !dayOfWeek.friday)}>
                    <View style={dayOfWeek.friday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.friday ? {fontWeight:'bold'} : null}>Friday</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('sat', !dayOfWeek.saturday)}>
                    <View style={dayOfWeek.saturday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.saturday ? {fontWeight:'bold'} : null}>Saturday</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('sun', !dayOfWeek.sunday)}>
                    <View style={dayOfWeek.sunday ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                        <Text style={dayOfWeek.sunday ? {fontWeight:'bold'} : null}>Sunday</Text>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            <TouchableWithoutFeedback onPress={() => updateDaysOfWeek('all', !dayOfWeek.all)}>
                <Text style={dayOfWeek.all ? {margin:10,fontWeight:'bold'} : { margin:10,opacity:0.6 }}>Select All</Text>
            </TouchableWithoutFeedback>
        </View>    
        {
            isFourDays ?
            <View style={{...styles.numOfSpace, marginVertical:10}}>
                <Text style={styles.question}>Which time period would you be available?</Text>
                <ScrollView horizontal={true}>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents, six:!timePeriod.six, allTime:false} })}>
                        <View style={timePeriod.six ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.six ? {fontWeight:'bold'} : null}>6:00 am - 8:00 am</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents, eight:!timePeriod.eight,allTime:false } })}>
                        <View style={timePeriod.eight ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.eight ? {fontWeight:'bold'} : null}>8:00 am - 10:00 am</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents, ten:!timePeriod.ten, allTime:false} })}>
                        <View style={timePeriod.ten ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.ten ? {fontWeight:'bold'} : null}>10:00 am - 12:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents, twelvePM:!timePeriod.twelvePM, allTime:false} })}>
                        <View style={timePeriod.twelvePM ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.twelvePM ? {fontWeight:'bold'} : null}>12:00 pm - 02:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents, twoPM:!timePeriod.twoPM, allTime:false} })}>
                        <View style={timePeriod.twoPM ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.twoPM ? {fontWeight:'bold'} : null}>02:00 pm - 04:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents, fourPM:!timePeriod.fourPM,allTime:false } })}>
                        <View style={timePeriod.fourPM ? {...styles.option, borderColor:colors.purple, borderWidth:2} : styles.option}>
                            <Text style={timePeriod.fourPM ? {fontWeight:'bold'} : null}>04:00 pm - 06:00 pm</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
                <TouchableWithoutFeedback onPress={() => setTimePeriod(prevEvents => { return {...prevEvents,six:true,eight:true,ten:true,twelvePM:true,twoPM:true,fourPM:true,allTime:true } })}>
                    <Text style={timePeriod.allTime ? {margin:10,fontWeight:'bold'} : { margin:10,opacity:0.6 }}>Select All</Text>
                </TouchableWithoutFeedback>
            </View>
            :
            null
        }
        <View style={{ marginBottom:15 }}>
            <View style={{ marginVertical:5 }}>
                <Text>Your current work days</Text>
            </View>
            <Text style={{ fontFamily:'viga' }}>
            {dayOfWeek.all &&
            'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'
            }
            {!dayOfWeek.all &&
            dayOfWeek.monday
            &&
            ' Monday - '
            }
            {!dayOfWeek.all &&
            dayOfWeek.tuesday
            &&
            'Tuesday - '
            }
            {!dayOfWeek.all &&
            dayOfWeek.wednesday
            &&
            'Wednesday - '
            }
            {!dayOfWeek.all &&
            dayOfWeek.thursday
            &&
            'Thursday - '
            }
            {!dayOfWeek.all &&
            dayOfWeek.friday
            &&
            'Friday - '
            }
            {!dayOfWeek.all &&
            dayOfWeek.saturday
            &&
            'Saturday - '
            }
            {!dayOfWeek.all &&
            dayOfWeek.sunday
            &&
            'Sunday'
            }
            </Text>
            <View style={{ marginVertical:5,marginTop:10 }}>
                <Text>Your current available time</Text>
            </View>
            <Text style={{ fontFamily:'viga' }}>
            {timePeriod.allTime &&
            '6am, 8am, 10am, 12pm, 2pm, 4pm, 6pm'
            }
            {!timePeriod.allTime &&
            timePeriod.six
            &&
            '6am '
            }
            {!timePeriod.allTime &&
            timePeriod.eight
            &&
            '8AM '
            }
            {!timePeriod.allTime &&
            timePeriod.ten
            &&
            '10am '
            }
            {!timePeriod.allTime &&
            timePeriod.twelvePM
            &&
            '12pm '
            }
            {!timePeriod.allTime &&
            timePeriod.twoPM
            &&
            '2PM '
            }
            {!timePeriod.allTime &&
            timePeriod.fourPM
            &&
            '4PM '
            }
            {!timePeriod.allTime &&
            timePeriod.sixPM
            &&
            '6PM'
            }
            </Text>
        </View>
        {
           isFourDays ?
            <TouchableNativeFeedback onPress={() => updateHireInfo()}>
                <View style={{ width:'100%',backgroundColor:colors.darkPurple,padding:10,borderRadius:10 }}>
                    <Text style={{ textAlign:'center',color:colors.whitishBlue,fontWeight:'bold' }}>Update Hire Period</Text>
                </View>
            </TouchableNativeFeedback>
        :
            <View style={{ width:'100%',backgroundColor:colors.lightPurple,padding:10,borderRadius:10 }}>
                <Text style={{ textAlign:'center',color:colors.whitishBlue,fontWeight:'bold',opacity:0.6 }}>Update Hire Period</Text>
            </View>
        }
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
    container:{
        padding:20,
        flex:1,
    },
    option:{
        borderWidth:1.2,
        borderColor:'grey',
        padding:5,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:10,
        paddingHorizontal:20,
        opacity:0.7
    },
    question: {
        fontFamily:'viga',
        margin:10
    },
    numOfSpace:{
        marginVertical:10
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
    contentContainer: {
        padding:20,
        flex:1
    },
    bottomSheetSelection: {
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10
    },
    bottomSheetTitle: {
        fontFamily:'viga',
        fontSize:16
    },
    textOption: {
        letterSpacing:1,
        textAlign:'right'
    },
    lottie: {
        width: 100,
        height: 100
    },
})