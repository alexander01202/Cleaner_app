import { Text, View,StyleSheet,SafeAreaView,Dimensions,ScrollView, TouchableNativeFeedback, TouchableOpacity,BackHandler } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect,useRef } from 'react'
import { Entypo,AntDesign } from '@expo/vector-icons';
import { colors } from '../../colors/colors';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';
import { useState } from 'react';
import MyModal from '../../components/modal';
import { StreamChat } from 'stream-chat';
import { AllKeys } from '../../keys/AllKeys';
import { ChannelList, Chat,OverlayProvider,Channel,MessageInput, MessageList,ChannelAvatar } from 'stream-chat-expo';
// import { useChatClient } from '../../hooks/UseChatClient';
import { CometChat } from '@cometchat-pro/react-native-chat'

const client = StreamChat.getInstance('449vt742ex2f');
const { width,height } = Dimensions.get('window')
export default function ListOfChats({ navigation,channelId }) {
  const [chats, setChats] = useState(null)
  const [isLoading,setIsLoading] = useState(true)
  const [modalVisible,setModalVisible] = useState({ show:false,text:'' })
  const { id,displayName } = useSelector(state => state.login)
  // const { clientIsReady } = useChatClient(id,displayName);
  const [channel, setChannel] = useState(null)
  const [conversationList, setConversationList] = useState([])

    useEffect(async() => {
      if (channelId) {
        setChannel(channelId)
        return 
      }
      var arr = []
      let limit = 30;
      let conversationsRequest = new CometChat.ConversationsRequestBuilder()
      														.setLimit(limit)
      														.build();
      conversationsRequest.fetchNext().then(
        conversationList => {
          // console.log("new Conversations list received:", conversationList[0].getLastMessage());
          conversationList.map(list => {
            arr.push(
              {
                conversationId:list.getConversationId(),
                conversationType:list.getConversationType(),
                conversationWith:list.getConversationWith(),
                lastMessage:list.getLastMessage().text,
                unreadMessageCount:list.getUnreadMessageCount()
              }
            )
          })
          setConversationList(arr)
          setIsLoading(false)
          // var arr = []
          // arr.push(conversationList[0])
          // setConversationList([conversationList[0]])
        }, error => {
          setIsLoading(false)
          console.log("Conversations list fetching failed with error:", error);
        }
      );
      // const getCleanerJobs = await fetch(`${AllKeys.ipAddress}/fetchCleanerJobs?cleanerId=${id}`)
      // const getCleanerHomeJobs = await fetch(`${AllKeys.ipAddress}/fetchCleanerSubscription?id=${id}`)
      // const getSuperviosrJobs = await fetch(`${AllKeys.ipAddress}/fetchSupervisorJobs?cleanerId=${id}`)
      // const response = await getCleanerJobs.json()
      // const res = await getSuperviosrJobs.json()
      // const { rows } = await getCleanerHomeJobs.json()
      // var arr = []
      // var homeArr = []
      // for (let i = 0; i < response.rows.length; i++) {
      //   const getEnterpiseInfo = await fetch(`${AllKeys.ipAddress}/getEnterpriseInfo?id=${response.rows[i].enterprise_id}`);
      //   const jobRes = await getEnterpiseInfo.json()

      //   arr.push({name:jobRes.row[0].name_of_business,id:jobRes.row[0].id})
      // }
      // for (let s = 0; s < res.rows.length; s++) {
      //   const getEnterpiseInfo = await fetch(`${AllKeys.ipAddress}/getEnterpriseInfo?id=${res.rows[s].enterprise_id}`);
      //   const response = await getEnterpiseInfo.json()

      //   arr.push({name:response.row[0].name_of_business,id:response.row[0].id})
      // }  
      // for (let h = 0; h < rows.length; h++) {
      //   var channelKey = rows[h].sub_id
      //   const subInfo = await fetch(`${AllKeys.ipAddress}/fetchSubscriptionById?id=${rows[h].sub_id}`)
        
      //   const subInfoRes = await subInfo.json()
      //   homeArr.push({channelKey,name:subInfoRes.rows.customer_name})
      // }  
      // /**
      //  *  Channel created using a channel id
      //  */
      // var newArr = Array.from(new Set(arr));
     
      // for (let i = 0; i < newArr.length; i++) {
      //   const channel = client.channel('messaging', `${newArr[i].id}`, {
      //     name: `${newArr[i]}`,
      //   }); 
      //   await channel.create()
      //   await channel.updatePartial({ set:{ name:`${newArr[i].name}` } })
      //   await channel.addMembers([`${id}`], { text: `${displayName} joined the group.` });
      // }   
      // for (let i = 0; i < homeArr.length; i++) {
      //   const channel = client.channel('messaging', `${homeArr[i].channelKey}`, {
      //     name: `${homeArr[i].name}`,
      //   }); 
      //   await channel.create()
      //   await channel.updatePartial({ set:{ name:`${homeArr[i].name}` } })
      //   await channel.addMembers([`${id}`], { text: `${displayName} joined the group.` });
      // }   
      setIsLoading(false)
    }, [useIsFocused])

    useEffect(() => {
      const unsubscribe = BackHandler.addEventListener('hardwareBackPress', (e) => {
        if (channel) {
          setChannel(null)
          return true 
        }
      });
    
      return () => {
        unsubscribe.remove()
      }
    }, [channel])
    
    // const getAllChats = async() => {
    //     setIsRefreshing(true)
    //     const getChats = await fetch(`http://192.168.100.12:19002/getAllChats?id=${id}`)
    //     const { rows,success } = await getChats.json()
        
    //     if (success) {
    //       setChats(rows)   
    //     }
    //     setIsRefreshing(false)
    // }
  const emptyStateIndicator = () => (
    <View style={{ width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}>
        <Entypo name="chat" size={154} color="#c4c4c4" />
        <Text style={{ fontFamily:'viga',fontSize:16 }}>No Chats Yet</Text>
    </View>
  )  
  const PreviewAvatar = ({ channel }) => (
    <ChannelAvatar channel={channel} />
    // <View style={styles.avatar}>
    //     <Text style={{ fontFamily:'Funzi',fontSize:24,color:colors.whitishBlue }}>{item.name_of_business.slice(0,1)}</Text>
    // </View>
  )
  return (
    <>
    {
      isLoading ?
    <AnimatedLoader 
      visible={isLoading}
      overlayColor="rgba(225,225,225,1)"
      source={require('../../lottie/circle2.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
    :
    <View style={{flex: 1}}>
     {
      conversationList.length > 0
      ?
      <ScrollView style={{flex: 1}}>
        {
          conversationList.map(conv => (
            <TouchableNativeFeedback key={conv.conversationId}>
            <View style={styles.chatList}>
              <View style={{ marginHorizontal:5,flexDirection:'row',alignItems:'center' }}>
                <Ionicons name="person-circle-sharp" size={54} color="black" />
                {/* <FastImage source={{ uri:conv.conversationWith.avatar,priority:FastImage.priority.normal }} resizeMode={FastImage.resizeMode.contain} style={{ width:'80%' }} /> */}
                <View style={{ flexDirection:'column',marginHorizontal:5,width:'70%' }}>
                  <View>
                    <Text style={{ fontFamily:'viga',letterSpacing:1.2,fontSize:16,color:colors.black }}>{conv.conversationWith.name}</Text>
                  </View>
                  <View>
                    <Text numberOfLines={1} style={{ fontSize:14,color:colors.black,opacity:0.5 }}>{conv.lastMessage}</Text>
                  </View>
                </View>
                {
                Number(conv.unreadMessageCount) > 0 &&
                  <View style={{ justifyContent:'flex-end',alignItems:'flex-end',height:40 }}>
                    <View style={{ backgroundColor:colors.purple,borderRadius:100,padding:5,width:25 }}>
                      <Text style={{ color:colors.white,fontFamily:'viga',fontSize:12,textAlign:'center' }}>{conv.unreadMessageCount}</Text>
                    </View>
                  </View>
                }
              </View>
            </View>
          </TouchableNativeFeedback>
          ))
        }
      </ScrollView>
      :
      <View style={{ width:'100%',height:'100%',justifyContent:'center',alignItems:'center' }}>
          <Entypo name="chat" size={154} color="#c4c4c4" />
          <Text style={{ fontFamily:'viga',fontSize:16 }}>No Chats Yet</Text>
      </View>
     }
    </View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  header:{
    width:'100%',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'white',
    padding:10,
    paddingVertical:15
  },
  chatList:{
    backgroundColor:colors.grey,
    margin:20,
    borderRadius:10,
    paddingHorizontal:5,
    paddingVertical:10,
    flexDirection:'row',
    overflow:'hidden',
    alignItems:'center'
  },
  lottie:{
    height:100,
    width:100
  }
})