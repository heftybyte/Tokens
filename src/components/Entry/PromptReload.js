import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#000'
    },
    img: {
        height: '20%',
        width: '30%',
        marginTop: -50
    },
    mainText: {
        color: '#fff',
        padding: 20
    }
})


const PromptReload = () => (
    <View style={styles.container}>
        <Image resizeMode='contain' style={styles.img} source={require("../../../assets/Tokens_Icon.png")} />
        <Text style={styles.mainText}>An updated version of the app has been downloaded, please relaunch the app.</Text>
    </View>
)


export default PromptReload