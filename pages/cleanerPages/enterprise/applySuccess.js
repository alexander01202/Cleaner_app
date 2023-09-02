import { StyleSheet, Text, View,TouchableNativeFeedback, Image,Share, TouchableOpacity, BackHandler } from 'react-native'
import LottieView from 'lottie-react-native';
import { currency } from '../../../currency/currency';
import { colors } from '../../../colors/colors';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

export default function ApplySuccess({ navigation,route }) {
  const { salary } = route.params
  const {displayName, id} = useSelector(state => state.login)
  const shareOptions = {
    title: `Looking for a job but can't find one?`,
    message: `I was lucky to stumble one day on this company. Blipmoore. It is a service company enabled by technology that trains and hire cleaners, then connects them to clients or businesses. Download the app on google play store and use the code ${displayName}${id} to register.`, // Note that according to the documentation at least one of "message" or "url" fields is required
    url: 'www.blipmoore.com',
  };
  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener('hardwareBackPress', (e) => {
      navigation.navigate('Chats', { intro:true })
      return true
    });
  
    return () => {
      unsubscribe.remove()
    }
  }, [])
 const onSharePress = async() => Share.share(shareOptions)
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop={false}
        style={{ width: '100%', height: '100%',position:'absolute' }}
        source={require('../../../assets/lottie/celebration-animation.json')}
      />
      <TouchableNativeFeedback onPress={() => navigation.navigate('Chats', { intro:true })}>
        <View style={{ width:'100%',position:'absolute',margin:40 }}>
          <MaterialIcons style={{ alignSelf:'flex-end' }} name="cancel" size={34} color="black" />
        </View>
      </TouchableNativeFeedback>
      <FastImage source={{uri:'https://f004.backblazeb2.com/file/blipmoore-cleaner/medal.png', priority:FastImage.priority.high}} style={{ width:'80%',height:'60%' }} resizeMode={FastImage.resizeMode.contain} />
      <View style={{ alignItems:'center',paddingHorizontal:20 }}>
        <Text style={{ fontFamily:'viga',fontSize:28,letterSpacing:1 }}>Congratulations</Text>
        <Text style={{ textAlign:'center',marginVertical:20,color:'black' }}>If you ever choose to cancel this job, ensure to do so atleast 3 days before.</Text>
      </View>
      <TouchableNativeFeedback onPress={onSharePress}>
        <Animatable.View animation="pulse" easing="ease-out" style={{ width:'100%' }} iterationCount="infinite">
          <LinearGradient colors={[ colors.darkPurple,colors.purple ]} style={styles.button}>
            <Text style={{ fontSize:16,color:colors.white,fontFamily:'viga' }}>Share with friends</Text>
          </LinearGradient>
        </Animatable.View>
      </TouchableNativeFeedback>
      <TouchableOpacity onPress={() => navigation.navigate('RequestPage')}>
        <View style={{ marginVertical:10 }}>
          <Text style={{ color:'blue' }}>Continue</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
  },
  button:{
    backgroundColor:colors.purple,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    width:'80%',
    elevation:3,
    alignSelf:'center',
    borderRadius:10,
    margin:10
  },
})