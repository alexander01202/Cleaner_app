import { View, Text,Modal, TouchableNativeFeedback } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import { AllKeys } from '../../keys/AllKeys';
import moment from 'moment';

export default function WebViewMainModal({ webViewModal,closeWebView,cleanerId,amount }) {
    const [progress, setProgress] = useState(0)
    const [showProgress, setShowProgress] = useState(true)
    const interval = useRef(null)

    useEffect(() => {
        var date = moment().startOf('day')
        interval.current = setInterval(async() => {
            if (webViewModal.show) { 
                const req = await fetch(`${AllKeys.ipAddress}/checkCleanerVerification?cleanerId=${cleanerId}&amount=${amount}&date=${date}`)
                const { success,row } = await req.json()
                
                if (success) {
                    clearInterval(interval.current)
                    closeWebView('verified')
                }
            }
        }, 500);
    
        return () => {
           clearInterval(interval.current)
        }
    }, [webViewModal.show])
    
  return (
    <Modal
        animationType='slide'
        onRequestClose={closeWebView}
        visible={webViewModal.show}
        statusBarTranslucent={true}
    >
        {
            showProgress &&
            <Progress.Bar progress={progress} borderRadius={10} width={200} borderWidth={0} />
        }
        <WebView 
            source={{ uri: `${webViewModal.url}` }} 
            onLoadProgress={({ nativeEvent }) => {
                setProgress(nativeEvent.progress);
            }}
            onLoadEnd={() => setShowProgress(false)}
            // onError={() => closeWebView('false')}
        />
        <TouchableNativeFeedback onPress={closeWebView}>
            <View style={{ borderRadius:50,padding:10,backgroundColor:'red',alignSelf:'flex-end',paddingHorizontal:30,margin:15,elevation:3 }}>
                <Text style={{ color:'white',textAlign:'center' }}>Cancel</Text>
            </View>
        </TouchableNativeFeedback>
    </Modal>
  )
}