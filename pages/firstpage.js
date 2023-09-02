import { ImageBackground, View,StyleSheet,Image,SafeAreaView,Text } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { colors } from "../colors/colors";
import Onboarding from 'react-native-onboarding-swiper';
import { Dimensions } from "react-native";
import FastImage from 'react-native-fast-image'
import AnimatedLottieView from "lottie-react-native";

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default function Firstpage({ text,img,navigation,smallText,nextPage,btnText }) {
  return (
        <Onboarding
            subTitleStyles={{ width:width,position:'absolute',zIndex:2,top:-height * 0.5 ,fontFamily:'viga',fontSize:20,alignSelf:'center',color:colors.white}}
            onSkip={() => navigation.navigate('LoginPage')}
            onDone={() => navigation.navigate('LoginPage')}
            pages={[
            {
              backgroundColor: `${colors.black}`,
              image: <AnimatedLottieView 
                  source={require('../lottie/onboarding_two.json')}
                  autoPlay={true}
                  loop={true}
                  resizeMode={'contain'}
                  style={{ width:'100%',transform:[{ scale:1.1 }] }}
              />,
              title: 
              <SafeAreaView style={{ position:'absolute',flex:1,flexDirection:'column',alignItems:'flex-start',height:'100%',width:'100%' }}>
                 <FastImage 
                style={{width:'60%',height:200,alignSelf:'center'}} resizeMode={FastImage.resizeMode.contain} source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png',priority:FastImage.priority.high,headers: { Authorization: 'someAuthToken' } }}/>
                {/* <Text style={{ color:colors.white,fontFamily:'viga',textAlign:'center',width:width,fontSize:20,position:'absolute',top:height * 0.17 }}>Accept order from your comfort</Text> */}
            </SafeAreaView>,
              subtitle: 'Confirm orders from your comfort',
            },
            {
              backgroundColor: `${colors.darkPurple}` ,
              image: <AnimatedLottieView 
              source={require('../lottie/onboarding_third.json')}
              autoPlay={true}
              loop={true}
              resizeMode={'contain'}
              style={{ width:'100%' }}
          />,
              title: <SafeAreaView style={{ position:'absolute',flex:1,flexDirection:'column',alignItems:'flex-start',height:'100%',width:'100%' }}>
                <FastImage  
                style={{width:'60%',height:200,alignSelf:'center'}} resizeMode={FastImage.resizeMode.contain} source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png',priority:FastImage.priority.high,headers: { Authorization: 'someAuthToken' }}}/>
                <Text style={{ color:colors.white,fontFamily:'viga',textAlign:'center',width:width,fontSize:20,position:'absolute',top:height * 0.17 }}>Earn recurring revenue from customers</Text>    
                </SafeAreaView>,
              subtitle: '',
            },
            {
              backgroundColor: `${colors.green}`,
              image:<AnimatedLottieView 
              source={require('../lottie/onboarding_five.json')}
              autoPlay={true}
              loop={true}
              resizeMode={'contain'}
              style={{ width:'100%' }}
          />,
              title: <SafeAreaView style={{ position:'absolute',flex:1,flexDirection:'column',alignItems:'flex-start',height:'100%',width:'100%' }}>
                    <FastImage  
                style={{width:'60%',height:200,alignSelf:'center'}} resizeMode={FastImage.resizeMode.contain} source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/app+images/logo/logo.png',priority:FastImage.priority.high,headers: { Authorization: 'someAuthToken' }}}/>
                <Text style={{ color:colors.white,fontFamily:'viga',textAlign:'center',width:width,fontSize:20,position:'absolute',top:height * 0.17 }}>Receive payment Immediately</Text>
                </SafeAreaView>,
              subtitle: '',
            },
          ]}
        />
  )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        bottom: 100
    },
    logo: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        width: 200,
        height:200
    },
    nextBtn: {
        width: '80%',
        height: 50,
        borderRadius: 20,
        backgroundColor: colors.green,
        flexDirection: 'row',
        elevation: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    parentBtn: {
        // bottom: 50,
        width:'100%',
        flexDirection:'row', 
        justifyContent:'center',
    },
    parentText: {
        height: '60%',
        justifyContent:'center'
    },
    text: {
        width: '80%',
        color: colors.white,
        fontSize: 40,
        marginHorizontal: 25,
        fontFamily: 'viga'
    },
    smallText: {
        width: '70%',
        color:colors.white,
        fontSize: 24,
        marginHorizontal: 25,
        fontWeight: 'bold'
    },
    textBtn: {
        justifyContent: 'center',
        fontSize: 30,
        color: colors.white,
        fontFamily: 'viga'
    }
});

