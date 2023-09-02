import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import { View,StyleSheet,Text, Button, TouchableWithoutFeedback,Modal,ActivityIndicator,Dimensions,SafeAreaView, TextInput} from 'react-native'
import { colors } from '../../../colors/colors';
import MyModal from '../../../components/modal';

export default function HireChargeModal({ hireModalVisible,changeHireModal,id }) {
    const [isPending,setIsPending] = useState(false)
    const [ssaCharge,setssaCharge] = useState()
    const [msaCharge,setmsaCharge] = useState()
    const [lsaCharge,setlsaCharge] = useState()
    const [elsaCharge,setelsaCharge] = useState()
    const [deepCleaning,setDeepCleaning] = useState()
    const [modalVisible, setModalVisible] = useState({show: false,text: ''});

    useEffect(async() => {
        const fetchCleanerInfo = await fetch(`http://192.168.100.12:19002/fetchCleaner?id=${id}`)
        const fetchCleanerInfoRes = await fetchCleanerInfo.json()
    
        if (fetchCleanerInfoRes.success) {
            setssaCharge('' + fetchCleanerInfoRes.rows.ssa)
            setmsaCharge('' + fetchCleanerInfoRes.rows.msa)
            setlsaCharge('' + fetchCleanerInfoRes.rows.lsa)
            setelsaCharge('' + fetchCleanerInfoRes.rows.elsa)
            setDeepCleaning('' + fetchCleanerInfoRes.rows.deepCleaning)
        }
    }, [])
    
    let ssaChargeInNumber;
    let msaChargeInNumber;
    let lsaChargeInNumber;
    let elsaChargeInNumber;
    let deepCleaningInNumber;
    const updateCleanerInfo = async() => {
      ssaChargeInNumber = Number(ssaCharge)
      msaChargeInNumber = Number(msaCharge)
      lsaChargeInNumber = Number(lsaCharge)
      elsaChargeInNumber = Number(elsaCharge)
      deepCleaningInNumber = Number(deepCleaning)
        let checkssaChars = /^\d+$/.test(ssaChargeInNumber)
        let checkmsaChars = /^\d+$/.test(msaChargeInNumber)
        let checklsaChars = /^\d+$/.test(lsaChargeInNumber)
        let checkelsaChars = /^\d+$/.test(elsaChargeInNumber)
        let checkDeepCleaning = /^\d+$/.test(deepCleaningInNumber)

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
        if (!checkDeepCleaning) {
            setModalVisible({
              show:true,
              text: 'Invalid Deep Cleaning Amount'
            })
            return
        }
        if (ssaChargeInNumber > 5000 || ssaChargeInNumber < 1500 || !ssaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Small Sized Room is 1500 Maximum 5000'
            })
            return
        }
        if (msaChargeInNumber > 5000 || msaChargeInNumber < 2000 || !msaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Medium Sized Room is 3000 Maximum 7000'
            })
            return
        }
        if (lsaChargeInNumber > 9000 || lsaChargeInNumber < 3500 || !lsaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Large Sized Room is 3500 Maximum 9000'
            })
            return
        }
        if (elsaChargeInNumber > 12000 || elsaChargeInNumber < 4000 || !elsaChargeInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Extra Large Sized Room is 4000, Maximum 12000'
            })
            return
        }
        if (deepCleaningInNumber > 5000 || deepCleaningInNumber < 2000 || !deepCleaningInNumber) {
            setModalVisible({
              show:true,
              text: 'Minimum of Deep Cleaning is 2000 Maximum 5000'
            })
            return
        }
        setIsPending(true)
        const res = await fetch(`http://192.168.100.12:19002/UpdateHireInfo?id=${id}&ssa=${ssaChargeInNumber}&msa=${msaChargeInNumber}&lsa=${lsaChargeInNumber}&elsa=${elsaChargeInNumber}&deepCleaning=${deepCleaningInNumber}`)
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
      <View style={{ alignItems:'center',marginTop:30 }}>
          <Text style={styles.text}>How Much Do You Charge for Each of These</Text>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Small Sized Room?</Text>
          <TextInput value={ssaCharge} onChangeText={(val) => setssaCharge(val)} keyboardType='number-pad' placeholder='Minimum 1500 Maximum 5000' autoFocus={true} style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Meduim Sized Room?</Text>
          <TextInput value={msaCharge} onChangeText={(val) => setmsaCharge(val)} keyboardType='number-pad' placeholder='Minimum 3000 Maximum 7000' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Large Sized Room?</Text>
          <TextInput value={lsaCharge} onChangeText={(val) => setlsaCharge(val)} placeholder='Minimum 3500 Maximum 9000' keyboardType='number-pad' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>A Extra Large Sized Room?</Text>
          <TextInput value={elsaCharge} onChangeText={(val) => setelsaCharge(val)} placeholder='Minimum 4000 Maximum 12000' keyboardType='number-pad' style={styles.input}/>
        </View>
        <View style={styles.parentView}>
          <Text style={styles.text}>Deep Cleaning?(This is how much extra would you charge)</Text>
          <Text style={{ fontSize:12,fontStyle:'italic' }}>Example: You charge 1500 for SSA, And you charge 2000 for deepCleaning. The total charge would be 3500</Text>
          <TextInput value={deepCleaning} onChangeText={(val) => setDeepCleaning(val)} placeholder='Minimum 2000 Maximum 5000' keyboardType='number-pad' style={styles.input}/>
        </View>
        {isPending ? <ActivityIndicator size={'large'} color={colors.black}/> : 
          <TouchableWithoutFeedback onPress={() => updateCleanerInfo()}>
            <View style={{ backgroundColor:colors.yellow,padding:10,alignItems:'center',justifyContent:'center' }}>
              <Text style={{ color:colors.white }}>UPDATE HIRE INFO</Text>
            </View>
          </TouchableWithoutFeedback>
        }
        <View style={{ marginTop:20 }}>
            <Button title='Close' color={'red'} onPress={() => changeHireModal(!hireModalVisible)}/>
        </View>
      </View>
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