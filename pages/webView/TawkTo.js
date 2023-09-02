import { Modal, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import React, { useState } from 'react'
import WebView from 'react-native-webview'
import ProgressBar from 'react-native-progress/Bar'

export default function TawkTo({ showTawkModal,closeTawkModal }) {
    const [progress, setProgress] = useState(0)
    const [showProgress, setShowProgress] = useState(true)
  return (
    <Modal
        visible={showTawkModal.show}
        onRequestClose={closeTawkModal}
        animationType='slide'
        statusBarTranslucent={true}
    >
        {
            showProgress &&
            <ProgressBar progress={progress} borderRadius={10} width={200} borderWidth={0} />
        }
        <WebView 
            source={{ uri: `${showTawkModal.url}` }} 
            onLoadProgress={({ nativeEvent }) => {
                setProgress(nativeEvent.progress);
            }}
            onLoadEnd={() => setShowProgress(false)}
        />
        <TouchableNativeFeedback onPress={closeTawkModal}>
            <View style={{ borderRadius:50,padding:10,backgroundColor:'red',alignSelf:'flex-end',paddingHorizontal:30,margin:15,elevation:3 }}>
                <Text style={{ color:'white',textAlign:'center' }}>Close</Text>
            </View>
        </TouchableNativeFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({

})