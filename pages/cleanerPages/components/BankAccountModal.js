import { useEffect } from 'react'
import { useState } from 'react'
import { StyleSheet, Text, View,Modal,TouchableOpacity,TextInput,Dimensions,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SelectDropdown from 'react-native-select-dropdown'
import { Entypo,Ionicons,FontAwesome } from '@expo/vector-icons';
import { colors } from '../../../colors/colors'
import { AllKeys } from '../../../keys/AllKeys'

export default function BankAccountModal({ bankModalVisible,changeBankModalVisible,completedBankDetails }) {
    const [loadingBankInfo,setLoadingBankInfo] = useState(false)
    const [accountName,setAccountName] = useState(null)
    const [bankNameList,setBankNameList] = useState([])
    const [bankName,setBankName] = useState(null)
    const [error, setError] = useState({ text:'',nin:false,birthYear:false,birthMonth:false,birthDay:false,accountName:false,bankName:false,accountNumber:false })
    const [bvn,setBvn] = useState(null)
    const [accountNumber,setAccountNumber] = useState('')
    const [bankCode,setBankCode] = useState(null)
    
    const { width,height } = Dimensions.get('window')
    useEffect(() => {
        setBankNameList([])
        const getBanks = async() => {
          const banks = await fetch('https://vapi.verifyme.ng/v1/bvn-nuban/banks', {
            method:'GET',
            headers:{
              'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
            }
          })
          const bankListRes = await banks.json()
          var arr = []
          bankListRes.data.map(bankList => {
            arr.push(bankList.name)
          })
          setBankNameList(arr)
        }
        getBanks()
    
    }, [])
    useEffect(() => {
        if (bvn && accountName) {
          completedBankDetails(bvn,accountName,accountNumber,bankName)
          changeBankModalVisible()
        }
    
    }, [bvn,accountName,accountNumber,bankName])
    
    
    const changeBankName = async(val) => {
        setBankName(val)
        setBvn(null)
        if (error.bankName) {
          setError(prevEvents => {
            return {...prevEvents, bankName:false}
          }) 
        }
        const banks = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks`, {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
          }
        })
        const bankListRes = await banks.json()
        bankListRes.data.map(async(bankList) => {
          if (bankList.name === val) {
            setBankCode(bankList.code)
            if (accountNumber.length === 10 && bankList.code) {
              setLoadingBankInfo(true)
              const verifyAccount = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks/${bankList.code}/account/${accountNumber}`, {
                method:'GET',
                headers:{
                  'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
                }
              })
              const { status,data } = await verifyAccount.json()
              setLoadingBankInfo(false)
              if (status === 'success' && data) {
                // setBvnBirthInfo(data.birthdate)
                setBvn(data.bvn)
                setAccountName(data.lastname + ' ' + data.firstname + ' ' + data.middlename) 
              }else{
                setAccountNumber('')
                setAccountName('')
                setError(prevEvents => {
                  return {...prevEvents, accountNumber:true, text:'Wrong account details'}
                }) 
              }
            }
          }
        })
      }
      const changeBankNumber = async(val) => {
        setAccountNumber(val)
        setBvn(null)
        if (error.accountNumber) {
          setError(prevEvents => {
            return {...prevEvents, accountNumber:false}
          }) 
        }
        if (val.length === 10 && bankCode) {
          setLoadingBankInfo(true)
          const verifyAccount = await fetch(`${AllKeys.verifyNINurl}/bvn-nuban/banks/${bankCode}/account/${val}`, {
            method:'GET',
            headers:{
              'Authorization':`Bearer ${AllKeys.verifyNINKey}`,
            }
          })
          const {status,data} = await verifyAccount.json()
          setLoadingBankInfo(false)
          if (status === 'success' && data) {
            // setBvnBirthInfo(data.birthdate)
            setBvn(data.bvn)
            setAccountName(data.lastname + ' ' + data.firstname + ' ' + data.middlename) 
          }else{
            setAccountNumber('')
            setAccountName('')
            setError(prevEvents => {
              return {...prevEvents, accountNumber:true, text:'Wrong account details'}
            })
          }
        }
      }
      const changeAccountName = (val) => {
        setAccountName(val)
        if (error.accountName) {
          setError(prevEvents => {
            return {...prevEvents, accountName:false}
          }) 
        }
      }
  return (
    <Modal
      animationType="fade"
      style={{ justifyContent:'center' }}
      visible={bankModalVisible}
      onRequestClose={changeBankModalVisible}
    >
      <SafeAreaView>
        <View style={{ alignItems:'center',marginVertical:height > 768 ? 40 : null }}>
          <View style={styles.parentView}>
            <Text style={styles.text}>BANK NAME</Text>
                <SelectDropdown searchPlaceHolder={'Search for your bank'} renderSearchInputLeftIcon={() => <FontAwesome name={'search'} color={colors.purple} size={18} />} dropdownStyle={{ borderRadius:10,marginTop:5 }} searchPlaceHolderColor={colors.black} search={true} defaultValue={bankName} buttonStyle={{ backgroundColor:'#c4c4c4',width:'100%',borderRadius:10 }} rowStyle={{ width:'100%' }} data={bankNameList} onSelect={(selectedItem, index) => { changeBankName(selectedItem) }} />
                {error.bankName && <Text style={styles.error}>{error.text}</Text>}
                {/* <TouchableOpacity onPress={() => setShowBankInput(true)}>
                  <Text style={{ color:'blue',textDecorationLine:'underline',fontSize:12,marginTop:5 }}>Your Bank not on this list?</Text>
                </TouchableOpacity> */}
          </View>
          <View style={styles.parentView}>
            <Text style={styles.text}>ACCOUNT NUMBER</Text>
            <TextInput maxLength={10} value={accountNumber} placeholder='Please Enter Your Account Number' onChangeText={(val) => changeBankNumber(val)} keyboardType='number-pad' style={error.bankNumber ? {...styles.input, borderColor:'red'} : styles.input}/>
            {error.accountNumber && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <View style={styles.parentView}>
            <View style={{ flexDirection:'row' }}>
              <Text style={{...styles.text, marginRight:5}}>ACCOUNT NAME</Text>
              {loadingBankInfo ? <ActivityIndicator size={'small'} color={colors.green}/> : null }
            </View>
            <TextInput value={accountName} editable={false} placeholder={loadingBankInfo ? 'Verifying... Please wait' : 'Fill in the fields above first'} onChangeText={(val) => changeAccountName(val)} style={error.accountName ? {...styles.input, borderColor:'red'} : styles.input}/>
            {error.accountName && <Text style={styles.error}>{error.text}</Text>}
          </View>
          <TouchableOpacity onPress={() => changeBankModalVisible(!bankModalVisible)}>
            <View style={{...styles.button, paddingHorizontal:30}}>
              <Text style={{...styles.text,color:colors.white}}>Add Bank Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeBankModalVisible(!bankModalVisible)}>
            <View style={{ marginVertical:10 }}>
              <Text style={{ color:colors.purple }}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  input:{
    backgroundColor:"#c4c4c4",
    borderRadius:10,
    padding:10,
    fontFamily:'viga',
    color:colors.black,
    width:'100%'
  },
  parentView:{
    width:'80%',
    marginVertical:15
  },
  text:{
    fontSize:16,
    fontFamily:'viga'
  },
  button: {
    backgroundColor:colors.black,
    borderRadius:5,
    padding:10
  },
  error:{
    fontSize:12,
    color:'red'
  },
  lottie:{
    width:100,
    height:100
  }
})