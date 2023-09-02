import React from 'react'
import { useEffect,useState } from 'react'
import { Text, View,StyleSheet, TouchableWithoutFeedback,Linking, StatusBar, TextInput, TouchableOpacity, FlatList, TouchableNativeFeedback } from 'react-native'
import { colors } from '../colors/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons,FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { CometChat } from '@cometchat-pro/react-native-chat';
import moment from 'moment';
import AnimatedLoader from 'react-native-animated-loader';
import call from 'react-native-phone-call'

export default function Support({ navigation }) {
    const { displayName,id } = useSelector(state => state.login)
    const [message,setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])
    const [chatRecieverLastActive, setChatReceiverLastActive] = useState(null)
    const [refetchMessages, setRefetchMessages] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let listenerID = "UNIQUE_LISTENER_ID";
        CometChat.removeMessageListener(listenerID);
        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: textMessage => {
                setRefetchMessages(!refetchMessages)
                console.log("Text message received successfully", textMessage);
                },
                onMediaMessageReceived: mediaMessage => {
                console.log("Media message received successfully", mediaMessage);
                },
                onCustomMessageReceived: customMessage => {
                console.log("Custom message received successfully", customMessage);
                }
            })
        );
        let UID = 84 + '';
        let limit = 30;
        var arr = []
        var lastOnline = 0
        let messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(UID)
        .setLimit(limit)
        .build();
        messagesRequest.fetchPrevious().then(
          messages => {
            messages.map(msg => {
                const {receiverName} = msg.getReceiver()
                const {senderName} = msg.getSender()
                const {data, sentAt,sender,receiver} = msg.getRawMessage()
                const timeActive = data.entities.receiver.entity.lastActiveAt
                if (lastOnline !== timeActive) {
                    lastOnline = timeActive
                }
                arr.push(
                    {
                        sender,
                        receiver,
                        senderName,
                        receiverName,
                        message:data.text,
                        time:sentAt
                    }
                )
            })
            setChatReceiverLastActive(lastOnline)
            setAllMessages(arr)
            setIsLoading(false)
            // console.log("Message list fetched:", messages[0].getSender());
          }, error => {
            console.log("Message fetching failed with error:", error);
          }
        );
    
      return () => {
        CometChat.removeMessageListener(listenerID);
      }
    }, [refetchMessages])

    const sendMessage = () => {
        let receiverID = id + '';
        let messageText = message;
        let receiverType = CometChat.RECEIVER_TYPE.USER;
        let textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);
        
        CometChat.sendMessage(textMessage).then(
          message => {
            setRefetchMessages(!refetchMessages)
            // console.log("Message sent successfully:", message);
          }, error => {
            console.log("Message sending failed with error:", error);
          }
        );
        setMessage('')
    }

    const openDialer = () => {
        const args = {
            number: '+2348103539046', // String value with the number to call
            prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
            skipCanOpen: true // Skip the canOpenURL check
        }
          
        call(args).catch(console.error)
    }
    const openWhatsapp = () => {
        let url = `whatsapp://send?text=Hello. My name is ${displayName}. I would like to know more about blipmoore&phone=+23408103539046`
        Linking.openURL(url)
        .then(data => {
          console.log("WhatsApp Opened successfully " + data);
        })
        .catch(() => {
          alert("Make sure WhatsApp installed on your device");
        });
    }
    const renderItem = ({ item }) => {
        return(
            <>
                {
                    Number(item.sender) === id ?
                    <View style={styles.messageCont}>
                        <View style={styles.message}>
                            <Text style={{ color:colors.white }}>{item.message}</Text>
                        </View>
                        <Text style={{ fontSize:12,marginLeft:10,opacity:0.6 }}>{moment.unix(item.time).format("MMM. ddd h:mm A")}</Text>
                    </View>
                    :
                    <View style={styles.messageCont}>
                        <View style={{...styles.message, backgroundColor:colors.white}}>
                            <Text style={{ color:colors.black }}>{item.message}</Text>
                        </View>
                        <Text style={{ fontSize:12,marginLeft:10,opacity:0.6 }}>{moment.unix(item.time).format("MMM. ddd h:mm A")}</Text>
                    </View>
                }
            </>
        )
    }
  return (
    <>
    {
    isLoading ?
    <AnimatedLoader 
      visible={isLoading}
      overlayColor="rgba(225,225,225,1)"
      source={require('../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    :
    <>
    <StatusBar hidden={false}/>
    <SafeAreaView style={{ flex:1 }}>
        <View style={styles.header}>
            <View style={{ width:'80%' }}>
                <View style={{ flexDirection:'row',alignItems:'center' }}>
                    <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                        <View style={styles.hamburger}>
                          <FontAwesome name="navicon" size={24} color={colors.black} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection:'row',alignItems:'center',marginLeft:20 }}>
                        <View style={{ height:40,width:40,borderRadius:100,overflow:'hidden',marginHorizontal:10 }}>
                            <FastImage style={{ height:'100%',width:'100%',borderRadius:100 }} resizeMode={FastImage.resizeMode.contain} source={{ uri:'https://f004.backblazeb2.com/file/blipmoore/web+images/logo/shortlogo.png' }} />
                        </View>
                        <View>
                            <Text style={{ fontFamily:'viga',fontSize:18,letterSpacing:1.2 }}>Tricia</Text>
                            <Text style={{ fontSize:12 }}>{chatRecieverLastActive != 0 ? `last active at ${moment.unix(chatRecieverLastActive).format('h:mm A')}` : 'online' }</Text>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableNativeFeedback onPress={openDialer}>
                <View style={{ flexDirection:'row',alignItems:'center',width:'10%' }}>
                    <View>
                        <Ionicons name="call-outline" size={24} color="black" />
                    </View>
                </View>
            </TouchableNativeFeedback>
        </View>
        <FlatList
            data={allMessages}
            keyExtractor={(item) => item.time}
            renderItem={renderItem}
            style={{ backgroundColor:colors.grey,marginBottom:70 }}
        />
        <View style={styles.chatInputCont}>
            <View style={{  }}>
                <TextInput value={message} onChangeText={(val) => setMessage(val)} placeholder='Please enter message...' />
            </View>
            <TouchableOpacity onPress={sendMessage}>
                <View>
                    <Ionicons name="send-sharp" size={24} color="black" />
                </View>
            </TouchableOpacity>
        </View>
        {/* <View style={{ height:'100%',width:'100%',padding:10 }}>
            <View style={styles.icon}>
                <View style={{ backgroundColor:colors.yellow,borderRadius:80,padding:20,elevation:5 }}>
                    <MaterialIcons name="support-agent" size={124} color={colors.black} />
                </View>
                <Text style={{ fontSize:18,fontFamily:'Lalezar',marginVertical:10 }}>We are available 24 hours.</Text>
            </View>
            <View style={{ height:'40%',justifyContent:'center' }}>
            <TouchableWithoutFeedback onPress={openWhatsapp}>  
                <View style={{...styles.btn,backgroundColor:colors.yellow}}>
                    <Text style={styles.text}>CHAT ON WHATSAPP</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
                <View style={{...styles.btn,borderColor:colors.yellow,borderWidth:2}}>
                    <Text style={styles.text}>CALL US</Text>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </View> */}
    </SafeAreaView>
    </>
    }
    </>
  )
}
const styles = StyleSheet.create({
    hamburger:{
        // elevation:5,
        marginLeft:10,
        zIndex:1
    },
    header:{
        backgroundColor:colors.white,
        padding:10,
        height:70,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    icon: {
        width:'100%',
        height:'50%',
        justifyContent:'center',
        alignItems:'center'
    },
    btn: {
        height:60,
        justifyContent:'center',
        borderRadius:40,
        padding:10,
        alignItems:'center',
        marginVertical:10
    },
    text: {
        fontFamily:'viga',
        fontSize:14
    },
    messageCont:{
        width:'50%',
        alignSelf:'flex-end',
        margin:10
    },
    message:{
        backgroundColor:colors.purple,
        padding:15,
        borderRadius:15,
        margin:5
    },
    chatInputCont:{
        position:'absolute',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:20,bottom:0,
        backgroundColor:colors.white,
        width:'90%',
        alignSelf:'center',
        elevation:5,
        padding:10,
        borderRadius:50
    },
    lottie:{
        height:100,
        width:100
    }
})