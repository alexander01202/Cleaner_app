import { StyleSheet, Text, View,SafeAreaView,Image,Modal,TouchableWithoutFeedback,Share,TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../colors/colors'
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

export default function ReferModal({ changeShowReferModal,showReferModal }) {
    const { id,displayName } = useSelector(state => state.login)
    const shareOptions = {
        title: 'Title',
        message: `Message to share. Use the code ${displayName}${id} to register.`, // Note that according to the documentation at least one of "message" or "url" fields is required
        url: 'www.blipmoore.com',
        subject: 'Subject'
    };
   const onSharePress = () => Share.share(shareOptions)
  return (
    <SafeAreaView>
        <Modal
            animationType='slide'
            onRequestClose={changeShowReferModal}
            visible={showReferModal}
        >
        <View style={{ flex:1,backgroundColor:colors.black }}>
            <TouchableWithoutFeedback onPress={changeShowReferModal}>
                <AntDesign name="close" size={28} color={colors.white} style={{ marginHorizontal:10 }} />
            </TouchableWithoutFeedback>
            <View style={{ backgroundColor:colors.black,height:'70%',justifyContent:'center',alignItems:'center' }}>
                <Image 
                resizeMode='contain'
                style={{ width:'100%',height:'80%' }}            
                source={require('../../assets/referimg.png')} />
                <View style={{ padding:10,alignItems:'center' }}>
                <Text style={{ fontFamily:'Funzi',color:colors.white,fontSize:25,marginVertical:20 }}>Earn with friends!!</Text>
                <Text style={{ color:colors.white,textAlign:'center' }}>Refer fellow worker to blimoore and increase your ratings.</Text>
                </View>
            </View>
            <View style={{ borderRadius:20,padding:20,alignItems:'center',marginVertical:10 }}>
                <TouchableWithoutFeedback onPress={onSharePress}>
                    <View style={{ backgroundColor:colors.white,width:'100%',padding:10,borderRadius:20,alignItems:'center',marginTop:10 }}>
                        <Text style={{ fontFamily:'viga',fontSize:18 }}>INVITE</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {/* <Text style={{ fontFamily:'viga',color:colors.whitishBlue,textAlign:'center',fontSize:12 }}>Did you know that an estimated 12.6 million deaths each year are attributable to unhealthy environments.</Text> */}
        </View>
      </Modal>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({})