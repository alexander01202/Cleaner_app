import AnimatedLottieView from 'lottie-react-native'
import { StyleSheet, Text, View,Modal, TouchableNativeFeedback } from 'react-native'
import { colors } from '../colors/colors'
import { Linking } from 'react-native';

export default function updateAppModal({ UpdateApp }) {
    const Update = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.blipmoore.blipmoore_cleaner');
    }
  return (
    <Modal
        visible={UpdateApp}
        animationType='fade'
        onRequestClose={() => {
            return
        }}
        statusBarTranslucent={true}
    >
        <View style={styles.container}>
            <AnimatedLottieView 
                source={require('../lottie/update.json')}
                autoPlay={true}
                loop={true}
                resizeMode={'contain'}
                style={{ width:'100%' }}
            />
            <View style={{ alignItems:'center' }}>
                <View style={{ marginVertical:5 }}>
                    <Text style={{ fontFamily:'Magison',fontSize:24,color:colors.white }}>New Version Available</Text>
                </View>
                <Text style={{ color:colors.white }}>Please Update your app</Text>
                <TouchableNativeFeedback onPress={Update}>
                    <View style={styles.button}>
                        <Text style={styles.buttontxt}>Update</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:colors.black
    },
    button:{
        backgroundColor:colors.purple,
        padding:10,
        borderRadius:10,
        width:'80%',
        marginTop:20
    },
    buttontxt:{
        color:colors.white,
        textAlign:'center',
        fontSize:20,
        fontFamily:'Magison'
    }
})