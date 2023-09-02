import { Modal, StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native'
import AnimatedLoader from "react-native-animated-loader";
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { colors } from '../../../colors/colors';
import { BarIndicator } from 'react-native-indicators';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LgaModal({ showLGAModal,closeLgaModal,SubmitLga }) {
    const [lga, setLga] = useState('')
    const [isPending, setIsPending] = useState(false)

  return (
    <Modal
        animationType='fade'
        onRequestClose={closeLgaModal}
        statusBarTranslucent={true}
        transparent={false}
        visible={showLGAModal}
    >
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainerTitle}>
                <Text style={styles.title}>What is your Local Government Area?</Text>
            </View>
            <Animatable.View>
                <TextInput 
                    value={lga}
                    autoFocus
                    onChangeText={(val) => setLga(val)}
                    placeholder='Please enter your Local government area'
                    style={styles.input}
                />
            </Animatable.View>
            {
                lga && lga.length > 0 && !isPending
                ?
                <TouchableOpacity onPress={() => {
                    setIsPending(true)
                    SubmitLga(lga)
                }}>
                    <View style={styles.button}>
                        <Text style={{ color:'white',fontFamily:'Murecho' }}>SUBMIT</Text>
                    </View>
                </TouchableOpacity>
                :
                isPending
                ?
                    <View style={{...styles.button, opacity:0.6}}>
                        <BarIndicator count={5} style={{ margin:10 }} size={20} color={colors.white} />
                    </View>
                :
                <View style={{...styles.button, opacity:0.6}}>
                    <Text style={{ color:'white',fontFamily:'Murecho' }}>SUBMIT</Text>
                </View>
            }
        </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
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
    input:{
        backgroundColor:colors.grey,
        padding:10,
        borderRadius:10
    },
    inputContainerTitle:{
        marginBottom:10
    },
})