import { useEffect } from 'react'
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../../colors/colors'
import { Ionicons,Entypo } from '@expo/vector-icons';
import { AllKeys } from '../../../keys/AllKeys';
import { useState } from 'react';

export default function Teammates({ navigation,route }) {
  const { enterprise_id } = route.params
  const [supervisors, setSupervisors] = useState(null)
  const [cleaners, setCleaners] = useState(null)

  useEffect(() => {
    const getTeammates = async() => {
      const req = await fetch(`${AllKeys.ipAddress}/fetchSupervisors?enterprise_id=${enterprise_id}`);
      const res = await req.json()
      const getCleaners = await fetch(`${AllKeys.ipAddress}/fetchCleaners?enterprise_id=${enterprise_id}`)
      const { success, rows } = await getCleaners.json()

      if (success && res.success) {
        setCleaners(rows)
        setSupervisors(res.rows)
      }
    }
    getTeammates()

  }, [])
  var arr = [1,2,3,4,5]
  return (
    <View style={styles.container}>
      {
        supervisors &&
        supervisors.map(sup => (
          <View key={sup.supervisor_id} style={{...styles.containerMate, justifyContent:'center'}}>
            <View style={{...styles.eachMate, width:"100%", flexBasis:'100%'}}>
              <Image resizeMode='stretch' style={{ width:'100%',height:200 }} source={require('../../../assets/3.jpg')} />
              <View style={styles.desc}>
                <Text style={styles.name}>Alexander Obidiegwu</Text>
                <Text style={styles.role}>Supervisor</Text>
              </View>
            </View>
          </View>
        ))
      }
      <ScrollView>
      <View style={styles.containerMate}>
      {
        cleaners &&
        cleaners.map(a => (
          <View key={a} style={styles.eachMate}>
              <Image style={{ width:50,height:50,borderRadius:50,alignSelf:'center' }} resizeMode='cover' source={require('../../../assets/3.jpg')} />
              <View style={{ marginVertical:20 }}>
                <View style={{ flexDirection:'row',marginVertical:10,justifyContent:'center' }}>
                  <Ionicons name="md-call" style={{ marginRight:5 }} size={14} color="black" />
                  <Text style={{ fontSize:12 }}>Call</Text>
                </View>
                <View style={{ flexDirection:'row',marginVertical:10,justifyContent:'center' }}>
                  <Entypo name="mail" style={{ marginRight:5 }} size={14} color="black" />
                  <Text style={{ fontSize:12 }}>Message</Text>
                </View>
              </View>
              <View style={styles.desc}>
                <Text style={styles.name}>Alexander</Text>
                <Text style={styles.role}>Recruit</Text>
              </View>
          </View>
        ))
      }
       </View>
       </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
      flex:1,
      padding:10,
      alignItems:'center'
  },
  containerMate:{
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      marginVertical:10,
      flexWrap: 'wrap'
  },
  eachMate:{
    overflow:'hidden',
    flexBasis:'50%',
    width:'40%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation:5,
    backgroundColor:colors.whitishBlue,
    marginVertical:10,
    borderRadius:10
  },
  desc:{
    padding:10,
    backgroundColor:colors.lightPurple,
  },
  role:{
    fontSize:12,
    fontFamily:'viga',
    letterSpacing:1,
    color:colors.purple
  },
  name:{
    fontSize:16,
    letterSpacing:1,
  }
})