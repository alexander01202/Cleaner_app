import { StyleSheet, Text, View,Modal,TouchableOpacity,ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { colors } from '../../../colors/colors'
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CleaningImagesModal({toggleEquImages,showCleaningImagesModal}) {
    const images = [
        {
            id:1, 
            name: 'Vim',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/vim/Vim.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/vim/Vim.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/vim/vim three.webp'
            ]
        },
        {
            id:2, 
            name: 'White Vinegar',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/white+vinegar/white+vinegar+2.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/white+vinegar/white+vinegar.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/white+vinegar/white+vinegar.png'
            ]
        },
        {
            id:3, 
            name: 'All Purpose Cloth',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/all+purpose+cloth/all-purpose-cloth.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/all+purpose+cloth/all-purpose-cloths.jpg'
            ]
        },
        {
            id:4, 
            name: 'Plastic Spray Bottle',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/plastic_bottles/900.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/plastic_bottles/spray+bottle.jfif',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/plastic_bottles/spray+bottle.webp'
            ]
        },
        {
            id:5, 
            name: 'Hand Gloves',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/gloves/cleaning-rubber-hand-gloves.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/gloves/cleaning_gloves.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/gloves/gloves.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/gloves/gloves.webp'
            ]
        },
        {
            id:6, 
            name: 'Multi Purpose Cleaner',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/multi+purpose+cleaner/Multi+purpose+cleaner(lysol).webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/multi+purpose+cleaner/Simple+green.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/multi+purpose+cleaner/Multi+purpose+cleaner.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/multi+purpose+cleaner/clorox-disinfecting-purpose-all-purpose-cleaner.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/multi+purpose+cleaner/lysol+all+purpose+cleaner.webp',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/multi+purpose+cleaner/mr+clean.webp',
                ''
            ]
        },
        {
            id:7, 
            name: 'Sponge scouring pad',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/sponge+scourge+pad/sponge+scouring+pad.jfif',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/sponge+scourge+pad/sponge+scouring+pad.jpeg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/sponge+scourge+pad/sponge+scouring+pad.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/sponge+scourge+pad/sponge+scouring+pad.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/sponge+scourge+pad/sponge+scouring+pad.png',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/sponge+scourge+pad/sponge.jfif'
            ]
        },
        {
            id:8, 
            name: 'Baking Soda',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/baking+soda/baking+soda+2.jfif',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/baking+soda/baking+soda+3.jfif',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/baking+soda/baking+soda.jfif',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/baking+soda/baking+soda.jpg'
            ]
        },
        {
            id:9, 
            name: 'Masculine Tape',
            links:[
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/masculine+tape/masculline+tape.jpg',
                'https://f004.backblazeb2.com/file/blipmoore-cleaner/cleaning_equipments/masculine+tape/masculline+tape.webp'
            ]
        },
    ]
  return (
    <SafeAreaView>
        <Modal
            visible={showCleaningImagesModal.show}
            transparent={false}
            animationType='slide'
            statusBarTranslucent={true}
            onRequestClose={toggleEquImages}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleEquImages}>
                    <View style={{ marginVertical:15,alignItems:'flex-end' }}>
                        <AntDesign name="closecircleo" size={34} color="black" />
                    </View>
                </TouchableOpacity>
                {
                    images.filter(img => img.id == showCleaningImagesModal.imageId).map(image => (
                        image.links.map(link => (
                        <View style={styles.imageCont}>
                            <FastImage 
                                source={{ uri:link, priority:FastImage.priority.normal }} 
                                resizeMode={FastImage.resizeMode.contain} 
                                style={{ width:'100%',height:'100%' }}
                            />
                        </View>
                        ))
                    ))
                }
            </View>
        </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        padding:10,
        flex:1
    },
    imageCont:{
        borderRadius:20,
        width:'100%',
        height:'20%',
        padding:10,
        borderColor:colors.grey,
        borderWidth:1,
        marginVertical:10 
    }
})