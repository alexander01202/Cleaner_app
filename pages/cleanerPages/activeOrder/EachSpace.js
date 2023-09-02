import { StyleSheet, Text, View,TouchableNativeFeedback, ScrollView, TouchableOpacity } from 'react-native'
import Progress from 'react-native-progress/Bar';
import { colors } from '../../../colors/colors';
import { Feather,MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { AllKeys } from '../../../keys/AllKeys';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function EachSpace({ navigation,route }) {
    const { letters,number,activeOrder } = route.params
    const { id,displayName } = useSelector(state => state.login)
    const [isPending, setIsPending] = useState(true)
    const [bedroom,setBedroom] = useState({ cleanerPay:null,supervisorPay:null })
    const [closet,setCloset] = useState({ cleanerPay:null,supervisorPay:null })
    const [toilet,setToilet] = useState({ cleanerPay:null,supervisorPay:null })
    const [balcony,setBalcony] = useState({ cleanerPay:null,supervisorPay:null })
    const [walkway,setWalkway] = useState({ cleanerPay:null,supervisorPay:null })
    const [kitchen,setKitchen] = useState({ cleanerPay:null,supervisorPay:null })
    const [store,setStore] = useState({ cleanerPay:null,supervisorPay:null })
    const [isDeepClean, setIsDeepClean] = useState(false)
    const [arr,setArr] = useState([])
    const [progress, setProgress] = useState({ one:0,two:0,three:0,four:0,five:0,six:0,seven:0,eight:0,nine:0,ten:0,eleven:0,twelve:0,thirteen:0,fourteen:0,fifteen:0 })
    const [btn, setBtn] = useState({ one:false,two:false,three:false,four:false,five:false,six:false,seven:false,eight:false,nine:false,ten:false,eleven:false,twelve:false,thirteen:false })
    const [cleanerName, setCleanerName] = useState({ one:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',eleven:'',twelve:'',thirteen:'' })
    const [cleanerId, setCleanerId] = useState({ one:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',eleven:'',twelve:'',thirteen:'' })
    const [refetchJobStatus, setRefetchJobStatus] = useState(false)
    
    useEffect(() => {
        var eachArr = []
        setArr([])
        for (let i = 1; i < Number(number) + 1; i++) {
            eachArr.push(i)
        }  
        setArr(eachArr)
        const { supervisor_pay,amount,cleaner_pay,sub_interval,num_of_cleaner,num_of_supervisor,places,next_deep_clean,discount_percentage } = activeOrder
        const discount = discount_percentage
        var balcony
        var walkway
        var kitchen
        var closet
        var toilet
        var bedroom
        if (moment(moment().valueOf()).isSame(next_deep_clean, 'day')) {
            setIsDeepClean(true)
            var bedroom = 2500
            var closet = 1000
            var toilet = 3500
            var balcony = 1200
            var walkway = 1000
            var kitchen = 3000
            var store = 1800
        }else{
            var bedroom = 1000
            var closet = 500
            var toilet = 2000
            var balcony = 700
            var walkway = 500
            var kitchen = 1500
            var store = 500
        }
        var fee = 0.1
        var amountOfBedroom
        var amountOfToilet 
        var amountOfCloset 
        var amountOfBalcony
        var amountOfWalkway
        var amountOfKitchen
        var amountOfStore
        var feeTaken = 0
        var equalPay = 0
        var twentyPercentOfEqualPay = 0
        var totalCleanerPay = 0
        var supervisorPay = 0
        var totalPayforSupervisor = 0
        var remainingMoney = 0
        var cleanerPay = 0
        places.split(',').map(place => {
            var letters = place.replace(/[^a-z]/g, '')
            var number = place.replace(/[^0-9]/g, '')
            if (letters === 'bedroom') {
                discountTaken = bedroom * Number(discount)
                totalCleanerPay = bedroom - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfBedroom = bedroom - feeTaken
                if(Number(num_of_supervisor) > 0){
                    equalPay = amountOfBedroom / (Number(num_of_cleaner) + Number(num_of_supervisor))
                    twentyPercentOfEqualPay = equalPay * 0.2
                    supervisorPay = equalPay + twentyPercentOfEqualPay
                    totalPayforSupervisor = supervisorPay * Number(num_of_supervisor)
                }
                remainingMoney = amountOfBedroom - totalPayforSupervisor
                cleanerPay = remainingMoney / Number(num_of_cleaner)
                setBedroom({ cleanerPay,supervisorPay })
            }else if (letters === 'balcony') {
                discountTaken = balcony * Number(discount)
                totalCleanerPay = balcony - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfBalcony = balcony - feeTaken
                equalPay = amountOfBalcony / (Number(num_of_cleaner) + Number(num_of_supervisor))
                twentyPercentOfEqualPay = equalPay * 0.2
                supervisorPay = equalPay + twentyPercentOfEqualPay
                totalPayforSupervisor = supervisorPay * num_of_supervisor
                remainingMoney = amountOfBalcony - totalPayforSupervisor
                cleanerPay = remainingMoney / num_of_cleaner
                console.log(equalPay,'balcony')
                setBalcony({ cleanerPay,supervisorPay })
            }else if (letters === 'closet') {
                discountTaken = closet * Number(discount)
                totalCleanerPay = closet - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfCloset = closet - feeTaken
                equalPay = amountOfCloset / (Number(num_of_cleaner) + Number(num_of_supervisor))
                twentyPercentOfEqualPay = equalPay * 0.2
                supervisorPay = equalPay + twentyPercentOfEqualPay
                totalPayforSupervisor = supervisorPay * num_of_supervisor
                remainingMoney = amountOfCloset - totalPayforSupervisor
                cleanerPay = remainingMoney / num_of_cleaner
                console.log(equalPay,'closet')
                setCloset({ cleanerPay,supervisorPay })
            }else if (letters === 'walkway') {
                discountTaken = walkway * Number(discount)
                totalCleanerPay = walkway - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfWalkway = walkway - feeTaken
                equalPay = walkway / (Number(num_of_cleaner) + Number(num_of_supervisor))
                twentyPercentOfEqualPay = equalPay * 0.2
                supervisorPay = equalPay + twentyPercentOfEqualPay
                totalPayforSupervisor = supervisorPay * num_of_supervisor
                remainingMoney = amountOfWalkway - totalPayforSupervisor
                cleanerPay = remainingMoney / num_of_cleaner
                console.log(equalPay,'walkway')
                setWalkway({ cleanerPay,supervisorPay })
            }else if (letters === 'kitchen') {
                discountTaken = kitchen * Number(discount)
                totalCleanerPay = kitchen - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfKitchen = kitchen - feeTaken
                equalPay = amountOfKitchen / (Number(num_of_cleaner) + Number(num_of_supervisor))
                twentyPercentOfEqualPay = equalPay * 0.2
                supervisorPay = equalPay + twentyPercentOfEqualPay
                totalPayforSupervisor = supervisorPay * num_of_supervisor
                remainingMoney = amountOfKitchen - totalPayforSupervisor
                cleanerPay = remainingMoney / num_of_cleaner
                console.log(equalPay,'kitchen')
                setKitchen({ cleanerPay,supervisorPay })
            }else if (letters === 'store') {
                discountTaken = store * Number(discount)
                totalCleanerPay = store - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfStore = store - feeTaken
                equalPay = amountOfStore / (Number(num_of_cleaner) + Number(num_of_supervisor))
                twentyPercentOfEqualPay = equalPay * 0.2
                supervisorPay = equalPay + twentyPercentOfEqualPay
                totalPayforSupervisor = supervisorPay * num_of_supervisor
                remainingMoney = amountOfStore - totalPayforSupervisor
                cleanerPay = remainingMoney / num_of_cleaner
                console.log(equalPay,'store')
                setStore({ cleanerPay,supervisorPay })
            }else if (letters.includes('toilet') || letters.includes('bathroom')) {
                discountTaken = toilet * Number(discount)
                totalCleanerPay = toilet - discountTaken
                feeTaken = totalCleanerPay * fee
                amountOfToilet = bedroom - feeTaken
                equalPay = amountOfToilet / (Number(num_of_cleaner) + Number(num_of_supervisor))
                twentyPercentOfEqualPay = equalPay * 0.2
                supervisorPay = equalPay + twentyPercentOfEqualPay
                totalPayforSupervisor = supervisorPay * num_of_supervisor
                remainingMoney = amountOfToilet - totalPayforSupervisor
                cleanerPay = remainingMoney / num_of_cleaner
                console.log(equalPay,'toilet')
                setToilet({ cleanerPay,supervisorPay })
            }
        })
    }, [])
    useEffect(() => {
        const fetchCompletedJobs = async() => {
            var time = moment().valueOf()
            var startOfDaytime = moment().startOf('day').valueOf()
            const req = await fetch(`${AllKeys.ipAddress}/fetchActiveCompletedJobs?startOfDaytime=${startOfDaytime}&time=${time}&letters=${letters}&sub_id=${activeOrder.id}`)
            const { success,rows } = await req.json()
            if (success) {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].place_number == 1) {
                        setBtn(preEvent => {
                            return {...preEvent, one:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, one:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, one:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, one: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 2) {
                        setBtn(preEvent => {
                            return {...preEvent, two:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, two:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, two:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, two: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 3) {
                        setBtn(preEvent => {
                            return {...preEvent, three:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, three:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, three:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, three: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 4) {
                        setBtn(preEvent => {
                            return {...preEvent, four:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, four:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, four:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, four: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 5) {
                        setBtn(preEvent => {
                            return {...preEvent, five:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, five:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, five:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, five: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 6) {
                        setBtn(preEvent => {
                            return {...preEvent, six:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, six:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, six:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, six: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 7) {
                        setBtn(preEvent => {
                            return {...preEvent, seven:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, seven:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, seven:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, seven: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 8) {
                        setBtn(preEvent => {
                            return {...preEvent, eight:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, eight:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, eight:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, eight: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 9) {
                        setBtn(preEvent => {
                            return {...preEvent, nine:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, nine:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, nine:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, nine: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 10) {
                        setBtn(preEvent => {
                            return {...preEvent, ten:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, ten:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, ten:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, ten: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 11) {
                        setBtn(preEvent => {
                            return {...preEvent, eleven:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, eleven:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, eleven:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, eleven: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 12) {
                        setBtn(preEvent => {
                            return {...preEvent, twelve:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, twelve:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, twelve:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, twelve: Number(rows[i].progress_bar)}
                        })
                    }else if (rows[i].place_number == 13) {
                        setBtn(preEvent => {
                            return {...preEvent, thirteen:rows[i].status}
                        })
                        setCleanerName(preEvent => {
                            return {...preEvent, thirteen:rows[i].cleaner_name}
                        })
                        setCleanerId(preEvent => {
                            return {...preEvent, thirteen:rows[i].cleaner_id}
                        })
                        setProgress(preEvent => {
                            return {...preEvent, thirteen: Number(rows[i].progress_bar)}
                        })
                    }
                }
            }
            if (isPending) {
                setIsPending(false)   
            }
        }
        fetchCompletedJobs()
    }, [refetchJobStatus])
    
    const startCleaning = async(num) => {
        if (num == 1) {
            setBtn(preEvent => {
                return {...preEvent, one:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, one: 0.5}
            })
        }else if (num == 2) {
            setBtn(preEvent => {
                return {...preEvent, two:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, two: 0.5}
            })
        }else if (num == 3) {
            setBtn(preEvent => {
                return {...preEvent, three:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, three: 0.5}
            })
        }else if (num == 4) {
            setBtn(preEvent => {
                return {...preEvent, four:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, four: 0.5}
            })
        }else if (num == 5) {
            setBtn(preEvent => {
                return {...preEvent, five:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, five: 0.5}
            })
        }else if (num == 6) {
            setBtn(preEvent => {
                return {...preEvent, six:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, six: 0.5}
            })
        }else if (num == 7) {
            setBtn(preEvent => {
                return {...preEvent, seven:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, seven: 0.5}
            })
        }else if (num == 8) {
            setBtn(preEvent => {
                return {...preEvent, eight:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, eight: 0.5}
            })
        }else if (num == 9) {
            setBtn(preEvent => {
                return {...preEvent, nine:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, nine: 0.5}
            })
        }else if (num == 10) {
            setBtn(preEvent => {
                return {...preEvent, ten:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, ten: 0.5}
            })
        }else if (num == 11) {
            setBtn(preEvent => {
                return {...preEvent, eleven:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, eleven: 0.5}
            })
        }else if (num == 12) {
            setBtn(preEvent => {
                return {...preEvent, twelve:'started'}
            })
            setProgress(preEvent => {
                return {...preEvent, twelve: 0.5}
            })
        }
        var time = moment().valueOf()
        fetch(`${AllKeys.ipAddress}/updateJobCompleted?progress_bar=${0.5}&status=${'started'}&place_num=${num}&place=${letters}&cleaner_id=${id}&cleaner_name=${displayName}&time=${time}&orderId=${activeOrder.id}`)
        navigateToTask(num)
    }
    const finishCleaning = async(num) => {
        if (num == 1) {
            setBtn(preEvent => {
                return {...preEvent, one:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, one: 1}
            })
        }else if (num == 2) {
            setBtn(preEvent => {
                return {...preEvent, two:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, two: 1}
            })
        }else if (num == 3) {
            setBtn(preEvent => {
                return {...preEvent, three:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, three: 1}
            })
        }else if (num == 4) {
            setBtn(preEvent => {
                return {...preEvent, four:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, four: 1}
            })
        }else if (num == 5) {
            setBtn(preEvent => {
                return {...preEvent, five:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, five: 1}
            })
        }else if (num == 6) {
            setBtn(preEvent => {
                return {...preEvent, six:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, six: 1}
            })
        }else if (num == 7) {
            setBtn(preEvent => {
                return {...preEvent, seven:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, seven: 1}
            })
        }else if (num == 8) {
            setBtn(preEvent => {
                return {...preEvent, eight:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, eight: 1}
            })
        }else if (num == 9) {
            setBtn(preEvent => {
                return {...preEvent, nine:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, nine: 1}
            })
        }else if (num == 10) {
            setBtn(preEvent => {
                return {...preEvent, ten:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, ten: 1}
            })
        }else if (num == 11) {
            setBtn(preEvent => {
                return {...preEvent, eleven:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, eleven: 1}
            })
        }else if (num == 12) {
            setBtn(preEvent => {
                return {...preEvent, twelve:'done'}
            })
            setProgress(preEvent => {
                return {...preEvent, twelve: 1}
            })
        }
        var amount
        if (letters === 'bedroom') {
            amount = bedroom.cleanerPay                    
        }else if (letters === 'toilet') {
            amount = toilet.cleanerPay
        }else if (letters === 'closet') {
            amount = closet.cleanerPay
        }else if (letters === 'walkway') {
            amount = walkway.cleanerPay
        }else if (letters === 'store') {
            amount = store.cleanerPay
        }else if (letters === 'kitchen') {
            amount = kitchen.cleanerPay
        }else if (letters === 'balcony') {
            amount = balcony.cleanerPay
        }
        var startOfDaytime = moment().startOf('day').valueOf()
        var currenttime = moment().valueOf()
        fetch(`${AllKeys.ipAddress}/updateJobCompleted?progress_bar=${1}&supervisor_id=${activeOrder.cleaner_id}&amount=${amount}&place=${letters}&place_num=${num}&status=${'done'}&cleaner_id=${id}&startOfDaytime=${startOfDaytime}&time=${currenttime}&orderId=${activeOrder.id}`)
        setRefetchJobStatus(!refetchJobStatus)
    }
    const deny = (num,cleanerId) => {
        var startOfDaytime = moment().startOf('day').valueOf()
        var time = moment().valueOf()
        fetch(`${AllKeys.ipAddress}/deleteJobProgress?cleaner_id=${cleanerId}&time=${time}&startOfDaytime=${startOfDaytime}&sub_id=${activeOrder.id}&place=${letters}&place_num=${num}`)
        setRefetchJobStatus(!refetchJobStatus)
    }
    const navigateToTask = (num) => {
        if (num === 1) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.one,cleanerId:cleanerId.one,isDeepClean})   
        }else if (num === 2) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.two,cleanerId:cleanerId.two,isDeepClean})   
        }else if (num === 3) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.three,cleanerId:cleanerId.three,isDeepClean})   
        }else if (num === 4) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.four,cleanerId:cleanerId.four,isDeepClean})   
        }else if (num === 5) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.five,cleanerId:cleanerId.five,isDeepClean})   
        }else if (num === 6) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.six,cleanerId:cleanerId.six,isDeepClean})   
        }else if (num === 7) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.seven,cleanerId:cleanerId.seven,isDeepClean})   
        }else if (num === 8) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.eight,cleanerId:cleanerId.eight,isDeepClean})   
        }else if (num === 9) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.nine,cleanerId:cleanerId.nine,isDeepClean})   
        }else if (num === 10) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.ten,cleanerId:cleanerId.ten,isDeepClean})   
        }else if (num === 11) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.eleven,cleanerId:cleanerId.eleven,isDeepClean})   
        }else if (num === 12) {
            navigation.navigate('Task', {letters,cleanerName:cleanerName.twelve,cleanerId:cleanerId.twelve,isDeepClean})   
        }
    }
  return (
    <View style={styles.container}>
        {
            isPending ?
            <AnimatedLoader 
              visible={isPending}
              source={require('../../../lottie/circle2.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
            :
        <ScrollView>
        {
            arr.length > 0 && arr.map(num => (
                <View style={styles.placeContainer} key={num}>
                    <TouchableNativeFeedback onPress={() => navigateToTask(num)}>
                    <View>
                    <View style={styles.place}>
                        <Text style={{ fontWeight:'bold',letterSpacing:1 }}>{num} {letters}</Text>
                        {
                            num == 1 && btn.one === 'done' 
                            ?
                            <View style={{ flexDirection:'row' }}>
                                <Text>completed By {cleanerName.one}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View>
                            : 
                            num == 2 && btn.two === 'done' ? 
                             <View style={{ flexDirection:'row' }}>
                                <Text>completed By {cleanerName.two}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            : 
                            num == 3 && btn.three === 'done' ? 
                             <View style={{ flexDirection:'row' }}>
                                <Text>completed By {cleanerName.three}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 4 && btn.four === 'done' ? 
                             <View style={{ flexDirection:'row' }}>
                                <Text>completed By {cleanerName.four}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 5 && btn.five === 'done' ? 
                             <View style={{ flexDirection:'row' }}>
                                <Text>completed By {cleanerName.five}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 6 && btn.six === 'done' ? 
                             <View style={{ flexDirection:'row' }}>
                                <Text>completed By {cleanerName.six}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 7 && btn.seven === 'done' ? 
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.seven}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 8 && btn.eight === 'done' ? 
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.eight}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View>
                            :
                            num == 9 && btn.nine === 'done' ? 
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.nine}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 10 && btn.ten === 'done' ? 
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.ten}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View>
                            :
                             num == 11 && btn.eleven === 'done' ? 
                             <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.eleven}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View> 
                            :
                            num == 12 && btn.twelve === 'done' ? 
                             <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.twelve}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View>
                            :
                            num == 13 && btn.thirteen === 'done' ? 
                             <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>completed By {cleanerName.thirteen}</Text> 
                                <Feather name="check-circle" size={24} color={'green'}/> 
                            </View>
                            :
                            <View style={{ flexDirection:'row',alignItems:'center' }}>
                                <Text>Awaiting completion</Text> 
                                <Feather name="check-circle" size={24} color={'grey'}/> 
                            </View>
                        }
                    </View>
                    <View style={{ alignItems:'flex-end' }}>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                    </View>
                    </View>
                    </TouchableNativeFeedback>
                    <View style={{ marginVertical:10 }}>
                      <Progress color={colors.purple} progress={
                        num == 1 ?
                         progress.one 
                        : 
                        num == 2 ?
                         progress.two 
                        : 
                        num == 3 ? 
                        progress.three
                        :
                        num == 4 ?
                        progress.four
                        :
                        num == 5 ?
                        progress.five 
                        :
                        num == 6 ?
                        progress.six
                        :
                        num == 7 ?
                        progress.seven
                        :
                        num == 8 ?
                        progress.eight 
                        :
                        num == 9 ?
                        progress.nine
                        : 
                        num == 10 ?
                        progress.ten
                        : 
                        num == 11 ?
                        progress.eleven
                        :
                        num === 12 ?
                        progress.twelve
                        :
                        num == 13 ?
                        progress.thirteen 
                        :
                        null
                    } width={null} borderWidth={1} />
                    </View>
                    {
                        num == 1 && btn.one === 'done' || cleanerId.one && (btn.one === 'started' && cleanerId.one !== id)
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            {
                                activeOrder.cleaner_id === id &&
                                <TouchableOpacity onPress={() => deny(num,cleanerId.one)}>
                                    <View style={{...styles.button,backgroundColor:'red'}}>
                                        <Text style={{ color:colors.white,fontFamily:'viga' }}>Deny that {cleanerName.one} Cleaned this</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        num == 1 && btn.one === 'started'
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            <TouchableOpacity onPress={() => finishCleaning(num)}>
                                <View style={{...styles.button,backgroundColor:colors.purple}}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        :
                        num == 1 ?
                        <>
                            <TouchableOpacity onPress={() => startCleaning(num)}>
                                <View style={styles.button}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                         :
                         null
                    }

                    {/* two */}

                    {
                        num == 2 && btn.two === 'done'|| cleanerId.two && (btn.two === 'started' && cleanerId.two !== id)
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            {
                                activeOrder.cleaner_id === id &&
                                <TouchableOpacity onPress={() => deny(num,cleanerId.two)}>
                                    <View style={{...styles.button,backgroundColor:'red'}}>
                                        <Text style={{ color:colors.white,fontFamily:'viga' }}>Deny that {cleanerName.one} Cleaned this</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        num == 2 && btn.two === 'started'
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            <TouchableOpacity onPress={() => finishCleaning(num)}>
                                <View style={{...styles.button,backgroundColor:colors.purple}}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        :
                        num == 2 ? 
                        <>
                            <TouchableOpacity onPress={() => startCleaning(num)}>
                                <View style={styles.button}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        null
                    }
                    {/* three */}

                    {
                        num == 3 && btn.three === 'done' || cleanerId.three && (btn.three === 'started' && cleanerId.three !== id)
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            {
                                activeOrder.cleaner_id === id &&
                                <TouchableOpacity onPress={() => deny(num,cleanerId.three)}>
                                    <View style={{...styles.button,backgroundColor:'red'}}>
                                        <Text style={{ color:colors.white,fontFamily:'viga' }}>Deny that {cleanerName.one} Cleaned this</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        num == 3 && btn.three === 'started'
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            <TouchableOpacity onPress={() => finishCleaning(num)}>
                                <View style={{...styles.button,backgroundColor:colors.purple}}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        :
                        num == 3 ?
                        <>
                            <TouchableOpacity onPress={() => startCleaning(num)}>
                                <View style={styles.button}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                         :
                         null
                    }

                    {
                        num == 4 && btn.four === 'done' || cleanerId.four && (btn.four === 'started' && cleanerId.four !== id)
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            {
                                activeOrder.cleaner_id === id &&
                                <TouchableOpacity onPress={() => deny(num,cleanerId.four)}>
                                    <View style={{...styles.button,backgroundColor:'red'}}>
                                        <Text style={{ color:colors.white,fontFamily:'viga' }}>Deny that {cleanerName.one} Cleaned this</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        num == 4 && btn.four === 'started'
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            <TouchableOpacity onPress={() => finishCleaning(num)}>
                                <View style={{...styles.button,backgroundColor:colors.purple}}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        :
                        num == 4 && 
                        <>
                            <TouchableOpacity onPress={() => startCleaning(num)}>
                                <View style={styles.button}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                    }

                    {
                        num == 5 && btn.five === 'done' || cleanerId.five && (btn.five === 'started' && cleanerId.five !== id)
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            {
                                activeOrder.cleaner_id === id &&
                                <TouchableOpacity onPress={() => deny(num,cleanerId.five)}>
                                    <View style={{...styles.button,backgroundColor:'red'}}>
                                        <Text style={{ color:colors.white,fontFamily:'viga' }}>Deny that {cleanerName.one} Cleaned this</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        num == 5 && btn.five === 'started'
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            <TouchableOpacity onPress={() => finishCleaning(num)}>
                                <View style={{...styles.button,backgroundColor:colors.purple}}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        :
                        num == 5 ?
                        <>
                            <TouchableOpacity onPress={() => startCleaning(num)}>
                                <View style={styles.button}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                         :
                         null
                    }

                    {
                        num == 6 && btn.six === 'done' || cleanerId.six && (btn.six === 'started' && cleanerId.six !== id)
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            {
                                activeOrder.cleaner_id === id &&
                                <TouchableOpacity onPress={() => deny(num,cleanerId.six)}>
                                    <View style={{...styles.button,backgroundColor:'red'}}>
                                        <Text style={{ color:colors.white,fontFamily:'viga' }}>Deny that {cleanerName.one} Cleaned this</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                        :
                        num == 6 && btn.six === 'started'
                        ?
                        <>
                            <View style={{...styles.button,opacity:0.5}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                            </View>
                            <TouchableOpacity onPress={() => finishCleaning(num)}>
                                <View style={{...styles.button,backgroundColor:colors.purple}}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        :
                        num == 6 ?
                        <>
                            <TouchableOpacity onPress={() => startCleaning(num)}>
                                <View style={styles.button}>
                                    <Text style={{ color:colors.white,fontFamily:'viga' }}>Start cleaning this {letters}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.button,backgroundColor:colors.lightPurple}}>
                                <Text style={{ color:colors.white,fontFamily:'viga' }}>Finished Cleaning this {letters}</Text>
                            </View>
                        </>
                         :
                         null
                    }
                </View>
            ))
        }
        </ScrollView>
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