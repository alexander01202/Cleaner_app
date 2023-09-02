import { StyleSheet, Text, View,Image, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../colors/colors'
import { AllKeys } from '../../../keys/AllKeys'
import cleaningTask from '../../../task.json'

export default function Task({ navigation,route }) {
    const { letters,cleanerId,cleanerName,isDeepClean } = route.params
    const [userImage, setImage] = useState(null)
    
  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text style={styles.title}>{letters} Task</Text>
        </View>
        <View style={{ elevation:3,backgroundColor:colors.lightPurple,padding:20,justifyContent:'center',alignItems:'center',marginVertical:20,borderRadius:10 }}>
            <Text style={{ fontSize:18 }}>These are the task the {cleanerName ? cleanerName : 'cleaners'} are supposed to do.</Text>
        </View>
        <View>
            <View style={{ marginVertical:10 }}>
                <Text style={{ fontSize:20,letterSpacing:1 }}>Activities for {isDeepClean ? 'deep clean' : 'regular clean'}</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom:200 }}>
                {
                    cleaningTask && cleaningTask.filter(item => item.space === letters).sort((a, b) => parseFloat(a.id) - parseFloat(b.id)).map(task => (
                        task.deep_clean ?
                            isDeepClean
                            ?
                            <View key={task.id} style={{ marginVertical:10,flexDirection:'row',width:'100%',justifyContent:'space-between',backgroundColor:'rgba(0,0,0,0.1)',alignItems:'center' }}>
                                <View style={{ borderColor:colors.purple,borderLeftWidth:1,padding:20 }}>
                                    <Text style={{ fontSize:12,color:colors.purple }}>{task.time}</Text>
                                    <Text style={{ fontSize:16,fontWeight:'bold',marginVertical:5 }}>{task.title}</Text>
                                    <Text style={{ fontSize:13,color:colors.black,opacity:0.6 }}>{task.explanation}</Text>
                                    {
                                        task.precaution && task.precaution.length > 0 &&
                                        <View style={{ marginVertical:5,backgroundColor:colors.lightPurple,borderRadius:10,padding:10 }}>
                                            <Text style={{ color:'red',fontWeight:'bold' }}>IMPORTANT</Text>
                                            <Text>{task.precaution}</Text>
                                        </View>
                                    }
                                </View>
                                <View style={{ borderRadius:100,width:50,height:50,overflow:'hidden',marginHorizontal:10 }}>
                                    <Image style={{ width:'100%',height:'100%' }} resizeMode='contain' source={{ uri:userImage }} />
                                </View>
                            </View>
                            :
                            null
                        :
                        <View key={task.id} style={{ marginVertical:10,flexDirection:'row',width:'100%',justifyContent:'space-between',backgroundColor:'rgba(0,0,0,0.1)',alignItems:'center' }}>
                            <View style={{ borderColor:colors.purple,borderLeftWidth:1,padding:20 }}>
                                <Text style={{ fontSize:12,color:colors.purple }}>{task.time}</Text>
                                <Text style={{ fontSize:16,fontWeight:'bold',marginVertical:5 }}>{task.title}</Text>
                                <Text style={{ fontSize:13,color:colors.black,opacity:0.6 }}>{task.explanation}</Text>
                                {
                                    task.precaution && task.precaution.length > 0 &&
                                    <View style={{ marginVertical:5,backgroundColor:colors.lightPurple,borderRadius:10,padding:10 }}>
                                        <Text style={{ color:'red',fontWeight:'bold' }}>IMPORTANT</Text>
                                        <Text>{task.precaution}</Text>
                                    </View>
                                }
                            </View>
                            <View style={{ borderRadius:100,width:50,height:50,overflow:'hidden',marginHorizontal:10 }}>
                                <Image style={{ width:'100%',height:'100%' }} resizeMode='contain' source={{ uri:userImage }} />
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    title:{
        fontFamily:'viga',
        fontSize:28,
        textTransform:'capitalize'
    }
})