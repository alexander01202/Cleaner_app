import { View, Text,StyleSheet,TouchableWithoutFeedback,Image } from 'react-native'
import React, { useState,useEffect,useRef,useMemo,useCallback } from 'react'
import { Entypo,FontAwesome } from '@expo/vector-icons';
import MapView,{ Marker,PROVIDER_GOOGLE } from 'react-native-maps'
import { GOOGLE_MAPS_APIKEY } from '../../apikey';
import { useSelector } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import { AllKeys } from '../../keys/AllKeys'
import AnimatedLoader from 'react-native-animated-loader';
import { colors } from '../../colors/colors';
import BottomSheet, { BottomSheetBackdrop,BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

export default function DirectionMapView({ navigation,route }) {
    const [customerLocation, setCustomerLocation] = useState({ latitude:null,longitude:null })
    const [isPending, setIsPending] = useState(true)
    const selector = useSelector(state => state.location)
    const bottomSheetRef = useRef(null);
    const { customerId } = route.params
    const mapRef = useRef(null)

    const snapPoints = useMemo(() => ['25%', '50%'], []);
    useEffect(async() => {
      const res = await fetch(`${AllKeys.ipAddress}/getCustomerLocation?customerId=${customerId}`)
      const { success, rows } = await res.json()
      
      setCustomerLocation({ latitude:rows.latitude, longitude:rows.longitude })
      setIsPending(false)
    }, [])
    const renderFooter = useCallback(
        props => (
          <BottomSheetFooter {...props} bottomInset={55} style={{ paddingHorizontal:10 }}>
            <View>
                <View style={{ padding:10,borderRadius:50,borderWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:colors.purple }}>
                    <Ionicons name="ios-call-outline" size={24} color="white" />
                    {/* <Text style={{ fontSize:20,color:colors.white,fontFamily:'viga' }}>Contact</Text> */}
                </View>
            </View>
          </BottomSheetFooter>
        ),
        []
    );
    
  return (
      <>
    <AnimatedLoader 
    visible={isPending}
    overlayColor="rgba(29,29,29,0.75)"
    source={require('../../lottie/circle2.json')}
    animationStyle={styles.lottie}
    speed={1}
  />
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
            <View>
                <FontAwesome name="arrow-left" size={24} color={colors.black} />
            </View>
        </TouchableWithoutFeedback>
        <View style={{ height:'10%',justifyContent:'flex-end',padding:10,marginTop:20 }}>
            <Text style={{ fontSize:30, fontFamily:'viga' }}>Map View</Text>
            <Text>Customer Location on the map</Text>
        </View>
      <View style={styles.mapView}>
      {
        customerLocation.latitude && customerLocation.longitude ?
        <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={{ width:'100%',height:'90%' }} region={selector}>
            <MapViewDirections 
              origin={selector}
              destination={customerLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
            />
            <Marker identifier='origin' coordinate={{latitude:selector.latitude,longitude:selector.longitude}}>
              <View style={styles.circle}/>  
              <View style={styles.stroke}/>  
              <View style={styles.core}/>  
            </Marker>
            <Marker identifier='destination' coordinate={{latitude:Number(customerLocation.latitude),longitude:Number(customerLocation.longitude)}}>
                <View style={styles.circle}/>  
                <View style={styles.stroke}/>  
                <View style={{...styles.core,backgroundColor:colors.black}}/>  
              </Marker>
          </MapView>
          :
          null
        }    
      </View>
      <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            style={styles.bottomSheetContainer}
            footerComponent={renderFooter}
        >
            <View>
                <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
                    <Text style={{ fontSize:50 }}>🏠</Text>
                    <View style={{ alignItems:'flex-end' }}>
                        <View style={{ backgroundColor:'pink',alignItems:'center',justifyContent:'center',height:20,paddingHorizontal:10 }}>
                            <Text style={{ color:'red',fontWeight:'bold',letterSpacing:1 }}>Home</Text>
                        </View>
                        <Text style={{ fontSize:20,fontWeight:'bold' }}>Alexander</Text>
                        <Text style={{ fontSize:12,opacity:0.6 }}>No 21 King haggi st, Ojodu Berger, Lagos</Text>
                    </View>
                </View>
                <View style={{ margin:20 }}>
                <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                    <Text style={{ fontSize:14 }}>small sized area</Text>
                    <Text style={{ fontSize:14 }}>2</Text>
                </View>
                <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                    <Text style={{ fontSize:14 }}>medium sized area</Text>
                    <Text style={{ fontSize:14 }}>2</Text>
                </View>
                <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                    <Text style={{ fontSize:14 }}>large sized area</Text>
                    <Text style={{ fontSize:14 }}>2</Text>
                </View>
                <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
                    <Text style={{ fontSize:14 }}>extra large sized area</Text>
                    <Text style={{ fontSize:14 }}>2</Text>
                </View>
                </View>
            </View>
        </BottomSheet>
    </View>
    </>
  )
}
const styles = StyleSheet.create({
    container:{
        marginTop:40,
        backgroundColor:'rgba(29,29,29,0.5)',
        padding:10
    },
    circle: {
        width:26,
        height:26,
        borderRadius:50
      },
      mapView:{
        height:'90%',
        width:'100%'
      },
      stroke: {
        width:26,
        height:26,
        borderRadius:50,
        backgroundColor:'#fff',
        zIndex:1,
        position:'absolute'
      },
      core: {
        width:24,
        height:24,
        position:'absolute',
        top:1,
        left:1,
        right:1,
        bottom:1,
        backgroundColor:colors.yellow,
        zIndex:2,
        borderRadius:50
      },
      lottie: {
        width: 100,
        height: 100
      },
      bottomSheetContainer: {
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        padding:5
    },
})