import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Text, View,StyleSheet,Dimensions, ActivityIndicator, Button, FlatList, TouchableWithoutFeedback,ScrollView,TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import { colors } from '../../colors/colors'
import { Ionicons,FontAwesome5 } from '@expo/vector-icons';
import HireChargeModal from '../cleanerPages/components/HireChargeModal'
import AgentHireModal from './components/AgentHireModal'

const { width,height } = Dimensions.get('window')
export default function AgentDashboard({ navigation }) {
    const { agentId,displayName } = useSelector(state => state.login)
    const [orderLists,setOrderList] = useState(null)
    const [isPending,setIsPending] = useState(true)
    const [isRefreshing,setIsRefreshing] = useState(true)
    const [dailyEarnings,setDailyEarnings] = useState(0)
    const [monthlyEarnings,setMonthlyEarnings] = useState(0)
    const [weeklyEarnings,setWeeklyEarnings] = useState(0)
    const [hireModalVisible,setHireModalVisible] = useState(false)
    const [bankEdit,setBankEdit] = useState({ Aname:false,Anumber:false,Bname:false })
    const [bankInfo,setBankInfo] = useState({ AccountName:null,AccountNumber:null,BankName:null })

    useEffect(() => {
        const fetchAllOrders = async() => {
            const getBankinfo = await fetch(`http://192.168.100.12:19002/getAgentBankInfo?agentId=${agentId}`)
            const { rows } = await getBankinfo.json();
            setBankInfo({ AccountName:rows.account_name,AccountNumber:rows.account_number,BankName:rows.bank_name })

            const res = await fetch(`http://192.168.100.12:19002/fetchAgentOrders?agentId=${agentId}`)
            const orders = await res.json()

            if (orders.success) {
                const currentDate = new Date().getTime();
                const oneDayAwayDate = currentDate - 86400000
                const oneMonthAwayDate = currentDate - 2629800000
                const oneWeekAwayDate = currentDate - 604800000
                var months = 0
                var weeks = 0
                var days = 0
                for (let i = 0; i < orders.rows.length; i++) {
                    if ((orders.rows[i].date_ordered > oneMonthAwayDate) && orders.rows[i].state !== 'declined') {
                        months = months + Number(orders.rows[i].amount)
                    }
                    if (orders.rows[i].date_ordered > oneWeekAwayDate && orders.rows[i].state !== 'declined') {
                        weeks = weeks + Number(orders.rows[i].amount)
                    }
                    if (orders.rows[i].date_ordered > oneDayAwayDate && orders.rows[i].state !== 'declined') {
                        days = days + Number(orders.rows[i].amount)
                    }
                }
                setMonthlyEarnings(months)
                setWeeklyEarnings(weeks)
                setDailyEarnings(days)
                setOrderList(orders)   
            }
            setIsRefreshing(false)
            setIsPending(false)
        }
        fetchAllOrders()
    }, [])
    const fetchSomeOrders = async() => {
        setIsRefreshing(true)
        
        const res = await fetch(`http://192.168.100.12:19002/fetchAgentOrders?agentId=${agentId}`)
        const orders = await res.json()

        const currentDate = new Date().getTime();
        const oneDayAwayDate = currentDate - 86400000
        const oneMonthAwayDate = currentDate - 2629800000
        const oneWeekAwayDate = currentDate - 604800000
        var months = 0
        var weeks = 0
        var days = 0
        
        for (let i = 0; i < orders.rows.length; i++) {
            if ((orders.rows[i].date_ordered > oneMonthAwayDate) && orders.rows[i].state !== 'declined') {
                months = months + Number(orders.rows[i].amount)
            }
            if (orders.rows[i].date_ordered > oneWeekAwayDate && orders.rows[i].state !== 'declined') {
                weeks = weeks + Number(orders.rows[i].amount)
            }
            if (orders.rows[i].date_ordered > oneDayAwayDate && orders.rows[i].state !== 'declined') {
                days = days + Number(orders.rows[i].amount)
            }
        }
        setMonthlyEarnings(months)
        setWeeklyEarnings(weeks)
        setDailyEarnings(days)

        setIsRefreshing(false)
        setOrderList(orders)
    }
    const changeHireModal = (val) => {
        setHireModalVisible(val)
    }
    const updateAnumber = (val) => {
        setBankInfo(preEvent => { 
            return {...preEvent, AccountNumber:val } 
        })
    }
    const updateAname = (val) => {
        setBankInfo(preEvent => { 
            return {...preEvent, AccountName:val } 
        })
    }
    const updateBname = (val) => {
        setBankInfo(preEvent => { 
            return {...preEvent, BankName:val } 
        })
    }
    const changeBankInfo = () => {
        fetch(`http://192.168.100.12:19002/updateAgentBankInfo?id=${agentId}&accountName=${bankInfo.AccountName}&accountNumber=${bankInfo.AccountNumber}&bankName=${bankInfo.BankName}`)
    }
    // const UpdateOrder = async(orderId) => {
    //     setIsPending(true)
    //     const update = await fetch(`http://192.168.100.12:19002/updateAgentOrderStatus?state=completed&id=${orderId}&agentId=${agentId}`)
    //     const response = await update.json()
    //     fetchSomeOrders()
    //     setIsPending(false)
    // }
  return (
    <>
    <AgentHireModal hireModalVisible={hireModalVisible} id={agentId} changeHireModal={changeHireModal}/>
    <View style={{ flex:1,alignItems:'center',marginTop:15 }}>
    <View style={{ width:'100%' }}>
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ alignItems:'center',alignSelf:'center',flexDirection:'row' }}
        >
            <View style={styles.cards}>
                <View style={styles.eachInfo}>
                    <Text style={{ ...styles.text,fontSize: 20,width:'65%' }} numberOfLines={1} >Hi, {displayName}</Text>
                    <View style={{ justifyContent:'flex-end',flex:1,width:'100%' }}>
                        <Text style={{ ...styles.text,fontSize: 16,alignSelf:'flex-end' }} numberOfLines={1} >N{dailyEarnings}.00</Text>
                    </View>
                </View>
                <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:0.5,marginBottom:10 }} />
                <View style={styles.eachInfo}>
                    <Text style={{...styles.text,fontSize:12}}>Monthly Earnings:</Text>
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <Text style={{...styles.text,...styles.smallText}}>N{monthlyEarnings}</Text>
                    </View>
                </View>
                <View style={styles.eachInfo}>
                    <Text style={{...styles.text,fontSize:12}}>Weekly Earnings:</Text>
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <Text style={{...styles.text,...styles.smallText}}>N{weeklyEarnings}</Text>
                    </View>
                </View>
                <View style={styles.eachInfo}>
                    <Text style={{...styles.text,fontSize:12}}>Subscribers:</Text>
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <Text style={{...styles.text,...styles.smallText}}>0</Text>
                    </View>
                </View>
                <View style={{ ...styles.eachInfo,flex:1 }}>
                    <View style={{ flex:1,justifyContent:'flex-end' }}>
                        <Text style={{...styles.text,fontSize:12}}>Ratings:</Text>
                    </View>
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <Text style={{...styles.text,...styles.smallText}}>none</Text>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={() => setHireModalVisible(!hireModalVisible)}>
                <View style={styles.eachInfo}>
                    <Text style={{...styles.text,fontSize:12}}>Add Your Hire charge:</Text>
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <Ionicons name="add" size={18} style={{ backgroundColor:'#f0f8ff',alignSelf:'flex-end' }} color="black" />
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{...styles.cards, marginRight:250}}>
            <View style={styles.eachInfo}>
                <Text style={{ ...styles.text,fontSize: 20,width:'65%' }} numberOfLines={1} >Edit Bank Account</Text>
            </View>
            <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:0.5,marginBottom:10 }} />
            <View style={{...styles.eachInfo, marginVertical:10}}>
                {
                    bankEdit.Aname
                    ?
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <TextInput onSubmitEditing={() => {setBankEdit(preEvent => { return {...preEvent, Aname:false} }), changeBankInfo()}} autoFocus style={styles.input} value={bankInfo.AccountName} onChangeText={(val) => updateAname(val)} />
                    </View>
                    :
                    <>
                        <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Account Name:</Text>
                        <View style={{ flex:1,alignItems:'flex-end' }}>
                            <View style={{ justifyContent:'flex-end',position:'absolute',width:'80%' }}>
                                <Text style={{...styles.text,...styles.smallText}} numberOfLines={1}>{bankInfo.AccountName}</Text>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setBankEdit({ Aname:true,Anumber:false,Bname:false })}>
                            <View style={{ marginHorizontal:5 }}>
                                <FontAwesome5 name="pen" size={12} color={colors.yellow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </>
                }
            </View>
            <View style={{...styles.eachInfo, marginVertical:10}}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Account Number:</Text>
                {
                    bankEdit.Anumber
                    ?
                    <View style={{ justifyContent:'flex-end',flex:1 }}>
                        <TextInput keyboardType='numeric' onSubmitEditing={() => {setBankEdit(preEvent => { return {...preEvent, Anumber:false} }), changeBankInfo()}} autoFocus style={styles.input} value={bankInfo.AccountNumber} onChangeText={(val) => updateAnumber(val)} />
                    </View>
                    :
                    <>
                        <View style={{ justifyContent:'flex-end',flex:1 }}>
                            <Text style={{...styles.text,...styles.smallText}}>{bankInfo.AccountNumber}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setBankEdit({ Aname:false,Anumber:true,Bname:false })}>
                            <View style={{ marginHorizontal:5 }}>
                                <FontAwesome5 name="pen" size={12} color={colors.yellow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </>
                }
            </View>
            <View style={{...styles.eachInfo, marginVertical:10}}>
                <Text style={{...styles.text,fontSize:width > 598 ? 16 : 12}}>Bank Name:</Text>
                {
                    bankEdit.Bname
                    ?
                        <View style={{ justifyContent:'flex-end',flex:1 }}>
                            <TextInput onSubmitEditing={() => {setBankEdit(preEvent => { return {...preEvent, Bname:false} }), changeBankInfo()}} autoFocus style={styles.input} value={bankInfo.BankName} onChangeText={(val) => updateBname(val)} />
                        </View>
                    :
                    <>
                        <View style={{ justifyContent:'flex-end',flex:1 }}>
                            <Text style={{...styles.text,...styles.smallText}}>{bankInfo.BankName}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setBankEdit({ Aname:false,Anumber:false,Bname:true })}>
                        <View style={{ marginHorizontal:5 }}>
                            <FontAwesome5 name="pen" size={12} color={colors.yellow} />
                        </View>
                        </TouchableWithoutFeedback>
                    </>
                }
            </View>
        </View>
        </ScrollView>
        <Text style={{ alignSelf:'center',fontSize:12,fontFamily:'Murecho' }}>Please scroll &gt;&gt;&gt; to see more options</Text>
        </View>
        <View style={{ marginTop:30,flex:1,width:'90%',padding:10 }}>
            <Text style={{...styles.text,color:colors.black}}>Recent Orders</Text>
            <View style={{ width:'100%',borderColor:colors.yellow,borderWidth:1,marginVertical:10 }} />
            <View style={{ backgroundColor:'#c4c4c4',padding:10,flex:1 }}>
                {/* <View style={{ width:'100%',justifyContent:'center' }}>
                    <Text style={{...styles.text,color:colors.black, fontSize:20,textAlign:'center'}}>No Recent Orders</Text>
                </View> */}
                {isPending ? <ActivityIndicator size={'large'} color={colors.black}/>
                : 
                orderLists &&
                    orderLists.success ?
                    <FlatList 
                        onRefresh={fetchSomeOrders}
                        refreshing={isRefreshing}
                        keyExtractor={(item) => item.id}
                        data={orderLists.rows}
                        renderItem={({ item }) => (
                            <View style={styles.orders}>
                                <View style={{ flexDirection:'row',flex:1 }}>
                                <Text style={{ ...styles.text,color:colors.black }}>{item.customer_name}</Text>
                                    <View style={{ flex:1 }}>
                                        <Text style={item.state === 'declined' ? {...styles.text,...styles.smallText,color:'red'} : {...styles.text,...styles.smallText,color:colors.green}  }>N{item.amount}</Text>
                                        
                                        <View style={{ height:'100%',justifyContent:'flex-end' }}>
                                            <Text style={{ ...styles.text,color:colors.black,...styles.smallText }}>{new Date(Number(item.date_ordered)).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Text style={item.state === 'declined' ? { color:'red',fontSize:12 } : { color:colors.green,fontSize:12 }}>{item.state}</Text>
                                </View>
                            </View>
                        )}
                    />
                     : <Text style={{...styles.text,textAlign:'center',fontSize:20,color:colors.black}}>No Orders Yet</Text>
                }
            </View>
        </View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    cards: {
        backgroundColor:colors.black,
        width:'45%',
        borderColor:colors.yellow,
        borderWidth:2,
        borderRadius:20,
        height:height / 4.5,
        padding:10,
        elevation: 5,
        marginHorizontal:15
    },
    eachInfo:{
        flexDirection:'row',
        marginBottom:2
    },
    text:{
        color:'white',
        letterSpacing:1.1,
        fontFamily:'viga'
    },
    input:{
        fontFamily:'viga',
        fontSize:width > 598 ? 16 : 12,
        borderBottomColor:colors.yellow,
        borderBottomWidth:2,
        color:colors.white,
        width:'60%',
        height:20,
        alignSelf:'flex-end',
        textAlign:'center'
    },
    smallText: {
        alignSelf:'flex-end',
        fontSize:12
    },
    amount: {
        fontSize:12,
    },
    orders: {
        backgroundColor:colors.white,
        width:'100%',
        height:60,
        alignSelf:'center',
        elevation:5,
        padding:5,
        marginVertical:5
    }
    // name:{
    //     fontSize:20,
    //     color:'white',
    //     letterSpacing:1.1,
    //     fontFamily:'viga'
    // }
})
