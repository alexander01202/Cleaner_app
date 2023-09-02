import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import { View,StyleSheet,Text, Button, TouchableWithoutFeedback,Modal,ActivityIndicator,Dimensions,SafeAreaView, TextInput, ScrollView} from 'react-native'
import { colors } from '../../../colors/colors';
import MyModal from '../../../components/modal';
import { Ionicons } from '@expo/vector-icons';

export default function AgentHireModal({ hireModalVisible,changeHireModal,id }) {
    const [isPending,setIsPending] = useState(false)
    const [ssaCharge,setssaCharge] = useState()
    const [msaCharge,setmsaCharge] = useState()
    const [lsaCharge,setlsaCharge] = useState()
    const [elsaCharge,setelsaCharge] = useState()
    const [deepCleaning,setDeepCleaning] = useState()
    const [postConstruction,setPostConstruction] = useState('')
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});

    useEffect(async() => {
        const fetchAgentInfo = await fetch(`http://192.168.100.12:19002/fetchAgent?id=${id}`)
        const fetchAgentInfoRes = await fetchAgentInfo.json()
    
        if (fetchAgentInfoRes.success) {
            if (fetchAgentInfoRes.rows.ssa > 0) {
                setssaCharge('' + fetchAgentInfoRes.rows.ssa)   
            }
            if (fetchAgentInfoRes.rows.msa > 0) {
                setmsaCharge('' + fetchAgentInfoRes.rows.msa)  
            }
            if (fetchAgentInfoRes.rows.lsa > 0) {
                setlsaCharge('' + fetchAgentInfoRes.rows.lsa)   
            }
            if (fetchAgentInfoRes.rows.elsa > 0) {
                setelsaCharge('' + fetchAgentInfoRes.rows.elsa)   
            }
            if (fetchAgentInfoRes.rows.deepCleaning > 0) {
              setDeepCleaning('' + fetchAgentInfoRes.rows.deepCleaning)   
            }
            if (fetchAgentInfoRes.rows.postConstruction > 0) {
              setPostConstruction('' + fetchAgentInfoRes.rows.postConstruction)   
            }
        }
    }, [])
    
    let ssaChargeInNumber;
    let msaChargeInNumber;
    let lsaChargeInNumber;
    let elsaChargeInNumber;
    let deepCleaningInNumber;
    let postConstructionInNumber;
    const updateCleanerInfo = async() => {
      ssaChargeInNumber = Number(ssaCharge)
      msaChargeInNumber = Number(msaCharge)
      lsaChargeInNumber = Number(lsaCharge)
      elsaChargeInNumber = Number(elsaCharge)
      deepCleaningInNumber = Number(deepCleaning)
      postConstructionInNumber = Number(postConstruction)
        let checkssaChars = /^\d+$/.test(ssaChargeInNumber)
        let checkmsaChars = /^\d+$/.test(msaChargeInNumber)
        let checklsaChars = /^\d+$/.test(lsaChargeInNumber)
        let checkelsaChars = /^\d+$/.test(elsaChargeInNumber)
        let checkDeepCleaningChars = /^\d+$/.test(deepCleaningInNumber)
        let checkPostConstruction = /^\d+$/.test(postConstructionInNumber)

        if (!checkssaChars) {
            setModalVisible({
              show:true,
              text: 'Invalid Small Sized Room Amount'
            })
            return
        }
        if (!checkmsaChars) {
            setModalVisible({
              show:true,
              text: 'Invalid Meduim Sized Room Amount'
            })
            return
        }
        if (!checklsaChars) {
            setModalVisible({
              show:true,
              text: 'Invalid Large Sized Room Amount'
            })
            return
        }
        if (!checkelsaChars) {
            setModalVisible({
              show:true,
              text: 'Invalid Extra Large Sized Room Amount'
            })
            return
        }
        if (!checkDeepCleaningChars) {
            setModalVisible({
              show:true,
              text: 'Invalid Deep Cleaning Amount'
            })
            return
        }
        if (!checkPostConstruction) {
            setModalVisible({
              show:true,
              text: 'Invalid Post Construction Amount'
            })
            return
        }
        if (ssaChargeInNumber > 4000 || ssaChargeInNumber < 2000 || !ssaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Small Sized Room is 2000 Maximum 4000'
            })
            return
        }
        if (msaChargeInNumber > 5500 || msaChargeInNumber < 3000 || !msaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Medium Sized Room is 3000 Maximum 5500'
            })
            return
        }
        if (lsaChargeInNumber > 7000 || lsaChargeInNumber < 4000 || !lsaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Large Sized Room is 4000 Maximum 7000'
            })
            return
        }
        if (elsaChargeInNumber > 8500 || elsaChargeInNumber < 5500 || !elsaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Extra Large Sized Room is 5500, Maximum 8500'
            })
            return
        }
        if (deepCleaningInNumber > 4000 || deepCleaningInNumber < 1500 || !deepCleaningInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Deep Cleaning is 1500, Maximum 4000'
            })
            return
        }
        if (postConstructionInNumber > 9000 || postConstructionInNumber < 3500 || !postConstructionInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Post Construction is 3500, Maximum 9000'
            })
            return
        }
        setIsPending(true)
        const res = await fetch(`http://192.168.100.12:19002/UpdateAgentHireInfo?id=${id}&ssa=${ssaChargeInNumber}&msa=${msaChargeInNumber}&lsa=${lsaChargeInNumber}&elsa=${elsaChargeInNumber}&deepCleaning=${deepCleaningInNumber}&postConstruction=${postConstructionInNumber}`)
        const { success } = await res.json()
        if (success) {
            setModalVisible({
              show:true,
              text: 'SuccessFully Added!!! Customers can now hire you based on your fees'
            })
            changeHireModal(!hireModalVisible)   
        }
        setIsPending(false)
    }
    const changeModal = () => {
        setModalVisible({
          show:false,
          text: ''
        })
      }
  return (
      <>
      <MyModal changeModal={changeModal} modalVisible={modalVisible}/>
      <SafeAreaView style={styles.centeredView}>
      
      <Modal
      animationType="slide"
      style={{ justifyContent:'center' }}
      visible={hireModalVisible}
    >
      <ScrollView>
      <View style={{ alignItems:'center',marginTop:30 }}>
          <Text style={styles.text}>How Much Do You Charge for Each of These</Text>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Small Sized Area/Room/Space?</Text>
          <TextInput value={ssaCharge} onChangeText={(val) => setssaCharge(val)} keyboardType='number-pad' placeholder='Minimum 2000 Maximum 4000' autoFocus={true} style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Meduim Sized Area/Room/Space?</Text>
          <TextInput value={msaCharge} onChangeText={(val) => setmsaCharge(val)} keyboardType='number-pad' placeholder='Minimum 3000 Maximum 5500' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Large Sized Area/Room/Space?</Text>
          <TextInput value={lsaCharge} onChangeText={(val) => setlsaCharge(val)} placeholder='Minimum 4000 Maximum 7000' keyboardType='number-pad' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Extra Large Sized Area/Room/Space?</Text>
          <TextInput value={elsaCharge} onChangeText={(val) => setelsaCharge(val)} placeholder='Minimum 5500 Maximum 8500' keyboardType='number-pad' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <View style={{ flexDirection:'row',alignItems:'center' }}>
            <Text style={styles.text}>Post Construction Cleaning?</Text>
            <TouchableWithoutFeedback onPress={() => setModalVisible({ show:true,text:'This is what additional fee you would charge for atleast a bungalow apart from cleaning of the rooms. The fees set for each room cleaning would be used instead. The fee set would be doubled per story building. Eg duplex would be 2x your fee set. But Note, this must not include cleaning of rooms' })}>
              <Ionicons name="information-circle-sharp" style={{ marginHorizontal:5 }} size={18} color={colors.yellow} />
            </TouchableWithoutFeedback>
          </View>
          <TextInput value={postConstruction} onChangeText={(val) => setPostConstruction(val)} placeholder='Minimum 3500 Maximum 9000' keyboardType='number-pad' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <View style={{ flexDirection:'row',alignItems:'center' }}>
          <Text style={styles.text}>Deep Cleaning?</Text>
            <TouchableWithoutFeedback onPress={() => setModalVisible({ show:true,text:'This is how much extra would you charge. Example: You charge 2500 for SSA, And you charge 4000 for deepCleaning. The total charge would be 6500' })}>
              <Ionicons name="information-circle-sharp" style={{ marginHorizontal:5 }} size={18} color={colors.yellow} />
            </TouchableWithoutFeedback>
          </View>  
          <TextInput value={deepCleaning} onChangeText={(val) => setDeepCleaning(val)} placeholder='Minimum 1500 Maximum 4000' keyboardType='number-pad' style={styles.input}/>
        </View>
        {isPending ? 
          <ActivityIndicator size={'large'} color={colors.black}/> : 
            <TouchableWithoutFeedback onPress={() => updateCleanerInfo()}>
              <View style={{ backgroundColor:colors.yellow,padding:10,borderRadius:10 }}>
                <Text style={{ fontFamily:'viga',color:colors.black }}>Update Hire Info</Text>
              </View>
            </TouchableWithoutFeedback>
        }
        <View style={{ marginTop:20 }}>
            <TouchableWithoutFeedback onPress={() => changeHireModal(!hireModalVisible)}>
              <View style={{ borderColor:colors.yellow,borderWidth:3,borderRadius:10,padding:10 }}>
                <Text style={{ fontFamily:'viga' }}>Don't Update Hire Info</Text>
              </View>
            </TouchableWithoutFeedback>
        </View>
      </View>
      </ScrollView>
    </Modal>
  </SafeAreaView>
  </>
  )
}
const styles = StyleSheet.create({
    input: {
        borderColor:colors.black,
        borderWidth:2,
        backgroundColor:'#c4c4c4',
        paddingLeft:10,
        letterSpacing:1.4
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