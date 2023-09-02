import React, { useState, useEffect }  from 'react';
import { View,StyleSheet,Text, Button, TouchableWithoutFeedback,Modal,ActivityIndicator,Dimensions,SafeAreaView, TextInput, FlatList} from 'react-native'
import { colors } from '../../colors/colors';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io.connect('http://192.168.100.12:19002/')
export default function ChatModal({ showChatModal,changeChatModal,companyName,agentId,CleanerChat,customerId }) {
    const { id,displayName } = useSelector(state => state.login)
    const [currentMessage,setCurrentMessage] = useState('')
    const [messageList,setMessageList] = useState([])
    const [room,setRoom] = useState(null)

    useEffect(() => {
        let Currentroom = agentId + '' + customerId
        socket.emit('join_room',Currentroom)
        setRoom(Currentroom)
    }, [])
    useEffect(() => {
        socket.once('receive_message', (data) => {
            console.log('receiving...')
            // console.log(data)
            if (data.author !== displayName) {
                console.log(messageList)
                setMessageList(prevList => [...prevList, data])   
            }
        })

        return () => {
            console.log('unmounted')
        }
    }, [socket])
    
    const sendMessage = async() => {
        if (currentMessage !== '' && currentMessage) {
            const messageData = {
                room,
                author:displayName,
                message:currentMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
                timeInMilli: new Date().getTime()
            }
            socket.emit('send_message', messageData)
            setMessageList(prevList => [...prevList, messageData])
            setCurrentMessage('')
            if (!CleanerChat) {
                const checkIfChatHasBeenMade = await fetch(`http://192.168.100.12:19002/insertIntoUserChat?agentId=${agentId}&agentName=${companyName}&userid=${id}&lastMessage=${messageData.message}&time=${messageData.timeInMilli}`)   
            }
        }
    }
  return (
    <Modal 
        animationType="slide" 
        visible={showChatModal}
        onRequestClose={changeChatModal}
        >
        <SafeAreaView style={{ flex:1,overflow:'scroll' }}>
            <View style={{ width:'100%', padding:10,backgroundColor:colors.white,flexDirection:'row',alignItems:'center' }}>
                <TouchableWithoutFeedback onPress={changeChatModal}>
                    <AntDesign name="close" size={24} color={colors.yellow} style={{ marginHorizontal:10 }} />
                </TouchableWithoutFeedback>
                <Text numberOfLines={1} style={{ fontFamily:'viga',fontSize:20 }}>Chat with {companyName}</Text>
            </View>
            <View style={{ height:'80%',padding:10 }}>   
                {
                    messageList.length > 0 &&      
                <FlatList
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ justifyContent:'flex-end' }}
                    keyExtractor={(item) => item.timeInMilli}
                    data={messageList}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical:10 }}>
                            <View style={item.author !== displayName ? {...styles.chatBubble,backgroundColor:colors.yellow,alignSelf:'flex-start'} : {...styles.chatBubble} }>
                                <Text style={{ fontFamily:'viga',color:colors.white }}>{item.message}</Text>
                            </View>
                            <View style={item.author !== displayName ? { alignSelf:'flex-start',marginHorizontal:10 } : { alignSelf:'flex-end',marginHorizontal:10 }}>
                                <Text>{item.time}</Text>
                            </View>
                        </View>
                    )}
                />
                }
            </View>
            <View style={{ flex:1,justifyContent:"flex-end",alignItems:'center' }}>
                <View style={{ width:'100%',marginVertical:10,alignItems:'center',flexDirection:'row',justifyContent:'center' }}>
                    <TextInput placeholder='Enter Your Message' style={styles.input} value={currentMessage} onChangeText={(val) => setCurrentMessage(val)} />
                    <TouchableWithoutFeedback onPress={sendMessage}>
                        <View style={{ justifyContent:'flex-end',position:'absolute',right:50,zIndex:2,elevation:5,width:'10%',alignItems:'flex-end' }}>
                            <Ionicons name="send-sharp" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </SafeAreaView>
    </Modal>
  )
}
const styles = StyleSheet.create({
   input:{
    elevation:3,
    width:'80%',
    height:50,
    borderRadius:30,
    padding:10,
    justifyContent:'center',
    backgroundColor:colors.white,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2},
    shadowOpacity: 0.2,
    zIndex:1
   },
   chatBubble: {
    padding:10,
    overflow:'visible',
    backgroundColor:colors.black,
    justifyContent:'center',
    alignItems:'center',
    width:'50%',
    alignSelf:'flex-end',
    borderRadius:20,
    minHeight:40
   }
})