import { Modal, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { colors } from '../../../colors/colors'

export default function ImageModal({ showImageModal,toggleImagesModal }) {
  return (
    <Modal
    visible={showImageModal.show}
    transparent={false}
    animationType='slide'
    statusBarTranslucent={true}
    onRequestClose={toggleImagesModal}
    >
        <TouchableNativeFeedback onPress={toggleImagesModal}>
            <View style={styles.container}>
                <FastImage 
                    source={{ uri:showImageModal.url, priority:FastImage.priority.high }} 
                    resizeMode={FastImage.resizeMode.contain} 
                    style={{ width:'100%',height:'100%' }}
                />
            </View>
        </TouchableNativeFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.black
    }
})