import { StyleSheet } from 'react-native'
import { baseAccent, baseColor, brandColor, lossColor } from '../../config'

export default StyleSheet.create({
    header: {
        borderColor: baseAccent,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: brandColor
    },
    subHeading: {
        color: '#999',
        fontSize: 12,
        paddingVertical: 10
    },
    input: {
        color: '#fff',
    },
    mnemonicContainer: {
        paddingVertical: 40,
        marginBottom: 100,
        borderBottomWidth: 1,
        borderColor: baseAccent,
        paddingHorizontal: 30
    },
    mnemonic: {
        color: "#f3f3f3",
        fontSize: 15
    },
    title: {
        fontSize: 36,
        color: brandColor
    },
    warningText: {
        color: lossColor,
        fontSize: 18,
        padding: 40,
        marginBottom: 80
    }
})