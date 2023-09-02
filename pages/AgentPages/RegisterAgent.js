import React from 'react'
import { useState } from 'react'
import { Text, View,StyleSheet, Button, TouchableHighlight, TouchableWithoutFeedback, ActivityIndicator,ScrollView,TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../../colors/colors'
import SelectDropdown from 'react-native-select-dropdown'
import { useSelector } from 'react-redux'
import MyModal from '../../components/modal'
import { useDispatch } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';
import BankAccountModal from '../BankAccountModal'
import LoginWorkersModal from './components/LoginWorkersModal'

export default function RegisterAgent() {
    const [nin,setNin] = useState('')
    const [isPending,setIsPending] = useState(false)
    const [loginIsPending,setLoginIsPending] = useState(false)
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});
    const [loginWorkersVisible,setLoginWorkersVisible] = useState(false)
    const [bankModalVisible, setBankModalVisible] = useState(false);
    const [accountName,setAccountName] = useState(null)
    const [bankName,setBankName] = useState(null)
    const [bankNumber,setBankNumber] = useState(null)
    const { id,AgentCacNumber } = useSelector(state => state.login)
    const [agentNumber,setAgentNumber] = useState(null)
    const [workers,setWorkers] = useState()
    const [companyName,setCompanyName] = useState(null)
    const [cacNumber,setCacNumber] = useState(null)
    const [bio,setBio] = useState(null)
    const dispatch = useDispatch()
    const numberOfWorkers = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']

    const registerAgent = async() => {
      let checkAgentNumber = /^\d+$/.test(agentNumber)
      if (!checkAgentNumber || !agentNumber) {
        setModalVisible({
          show:true,
          text:'Invalid Mobile Number'
        })
        return
      }
      if (companyName === '' || !companyName) {
        setModalVisible({
          show:true,
          text:'Invalid Company Name'
        })
        return
      }
      if (!bankNumber || bankNumber === '' || !bankName || bankName === '' || !accountName || accountName === '') {
        setModalVisible({
          show:true,
          text:'Please Input All Your Bank Details'
        })
        return
      }
      const res = await fetch(`http://192.168.100.12:19002/registerAgent?agentNumber=${agentNumber}&companyName=${companyName}&cacNumber=${cacNumber}&bio=${bio}&numberOfWorkers=${numberOfWorkers}&id=${id}&bankname=${bankName}&accountName=${accountName}&banknumber=${bankNumber}`)
      const response = await res.json()
      if (response.success) {
        setModalVisible({
          show:true,
          text:'Successfully registered.Congrats!!!'
        })
        dispatch({ type:'REGISTER_AGENT',payload: { role:'agent',agentId:response.rows.InsertId,AgentCacNumber:cacNumber } })
      }else {
        setModalVisible({
          show:true,
          text:'Already Registered.'
        })
      }
    }
    const changeModal = () => {
      setModalVisible({
        show:false,
        text: ''
      })
    }
    const changeBankName = (val) => {
      setBankName(val)
    }
    const changeBankNumber = (val) => {
      setBankNumber(val)
    }
    const changeAccountName = (val) => {
      setAccountName(val)
    }
    const changeBankModal = () => {
      setBankModalVisible(!bankModalVisible)
    }
    const changeLoginModal = () => {
        setLoginWorkersVisible(!loginWorkersVisible)
    }
    const changeCacNumber = (val) => {
        setCacNumber(val)
    }
    const checkIfAgentHasLoggedIn = async() => {
        if (AgentCacNumber) {
            setLoginIsPending(true)
            const getAgentInfo = await fetch(`http://192.168.100.12:19002/LoginAgent?cacNumber=${AgentCacNumber}`)
            const getAgentInfoRes = await getAgentInfo.json()

            if (getAgentInfoRes.success) {
                setLoginIsPending(false)
                dispatch({ type:'REGISTER_AGENT',payload: { role:'agent',agentId:getAgentInfoRes.rows.id,AgentCacNumber } })
                return
            }else{
                setLoginIsPending(false)
                setLoginWorkersVisible(true)
            }
        }else{
            setLoginWorkersVisible(true)
        }
    }
    const loginAgent = async() => {
        setLoginIsPending(true)
        setLoginWorkersVisible(false)
        const fetchAgentInfo = await fetch(`http://192.168.100.12:19002/LoginAgent?cacNumber=${cacNumber}`)
        const fetchAgentInfoRes = await fetchAgentInfo.json()

        if (fetchAgentInfoRes.success) {
            setLoginIsPending(false)
            dispatch({ type:'REGISTER_AGENT',payload: { role:'agent',agentId:fetchAgentInfoRes.rows.id,AgentCacNumber:fetchAgentInfoRes.rows.cac_number } })
        }else{
            setLoginIsPending(false)
            setModalVisible({
              show:true,
              text:'Agent not found. Please register Properly'
            })
        }
    }
  return (
    <>
    <LoginWorkersModal loginAgent={loginAgent} changeCacNumber={changeCacNumber} cacNumber={cacNumber} loginWorkersVisible={loginWorkersVisible} changeLoginModal={changeLoginModal} />
      <BankAccountModal changeBankModal={changeBankModal} bankNumber={bankNumber} bankName={bankName} accountName={accountName} changeAccountName={changeAccountName} changeBankName={changeBankName} changeBankNumber={changeBankNumber} bankModalVisible={bankModalVisible}/>
      <MyModal changeModal={changeModal} modalVisible={modalVisible}/>
      <ScrollView contentContainerStyle={{ alignItems:'center' }} style={{ flex:1,marginTop:20 }}>
          <View style={styles.parentView}>
            <Text style={styles.text}>Company Name</Text>
            <TextInput placeholder='Please Provide Your Company Name' onChangeText={(val) => setCompanyName(val)} value={companyName} style={styles.input}/>
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>CAC Number</Text>
            <TextInput keyboardType='number-pad' placeholder='Please Provide Your CAC Number' onChangeText={(val) => setCacNumber(val)} value={cacNumber} style={styles.input}/>
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>Agent Mobile Number</Text>
            <TextInput keyboardType='number-pad' maxLength={11} placeholder='Please Provide Your Number' onChangeText={(val) => setAgentNumber(val)} value={agentNumber} style={styles.input}/>
          </View>
          {/* <View style={styles.parentView}>
            <Text style={styles.text}>NIN</Text>
            <TextInput keyboardType='number-pad' placeholder='Please Provide Your NIN' onChangeText={(val) => setNin(val)} value={nin} maxLength={11} style={styles.input}/>
          </View> */}
          <View style={styles.parentView}>
            <Text style={styles.text}>Select Number of Workers</Text>
            <SelectDropdown buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%' }} rowStyle={{ width:'100%' }} data={numberOfWorkers} onSelect={(selectedItem, index) => { setWorkers( selectedItem) }} />
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>Bio</Text>
            <TextInput placeholder='Explain why your company is the best choice' onChangeText={(val) => setBio(val)} value={bio} style={{...styles.input,height:100}} multiline />
          </View>
          <TouchableWithoutFeedback onPress={() => setBankModalVisible(!bankModalVisible)}>
            <View style={{ ...styles.parentView, backgroundColor:'#f0f8ff',height:100,flexDirection:'row',padding:10,elevation:3,shadowOffset: { width: 2, height: 2},shadowOpacity: 0.2 }}>
              <View>
                <Ionicons name="add" size={24} color="black" />
              </View>
              <View style={{ margin:3 }}>
                {!bankName &&
                  <Text>Add Bank Account</Text>
                }
                {bankName && 
                <>
                  <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{accountName}</Text>
                  <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{bankName}</Text>
                  <Text numberOfLines={1} style={{ textTransform:'uppercase' }}>{bankNumber}</Text>
                </>
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity style={{ width:'70%',alignItems:'center' }} onPress={() => registerAgent()}>
            <View style={{ marginTop:20,width:'70%',backgroundColor:colors.yellow,alignItems:'center',justifyContent:'center',height:40,padding:10 }}>
                  <Text style={{ color:colors.white }}>SUBMIT</Text>
            </View>
          </TouchableOpacity>
          {
              loginIsPending ? <View style={{ marginVertical:20 }}><ActivityIndicator size={'large'} color={colors.yellow} /></View> : 
              <TouchableWithoutFeedback onPress={() => checkIfAgentHasLoggedIn()}>
                <View style={{ marginVertical:20 }}>
                    <Text style={{ color:'blue',textDecorationLine:'underline' }}>Already an Agent ?</Text>
                </View>
                </TouchableWithoutFeedback>
          }
      </ScrollView>
    </>  
  )
}

const styles = StyleSheet.create({
    input: {
        borderColor:colors.black,
        borderWidth:2,
        backgroundColor:'#c4c4c4',
        paddingLeft:10,
        letterSpacing:1.4,
        height:40
    },
    parentView:{
        width:'80%',
        marginVertical:15
    },
    text:{
        fontSize:16,
        fontFamily:'viga'
    }
})
