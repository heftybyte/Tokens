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
        flex: 5
    },
    mainText: {
        color: '#fff',
        paddingTop: 30,
        flex: 5
    }
})


const PromptReload = () => (
    <View style={styles.container}>
    <Image resizeMode='contain' style={styles.img} source={require("../../../assets/Tokens_Icon.png")} />
    <Text style={styles.mainText}>App has been updated. Please reload app.</Text>
</View>)


export default PromptReload