import { baseAccent, baseColor, lossColor, brandColor } from '../../config'

export const styles = {
    container: {
        backgroundColor: baseColor,
        height: 130,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: baseAccent
    },
    slide: {
        backgroundColor: baseColor,
        borderColor: 'transparent',
        height:130,
        maxHeight:130,
        borderWidth: 0,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flex: 1
    },
    body: {
        color: '#fff',
        fontFamily: 'Nunito-Light',
        fontSize: 13.5
    },
    title: {
        color: '#777',
        fontFamily: 'Nunito-Light'
    },
    snippet: {
        color: '#fff'
    },
    action: {
        color: baseColor
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    video: {

    },
    image: {
        width: 50,
        height: 50,
        background: '#fff'
    },
    imageRound: {
        borderRadius: 25
    },
    textDefault: {
        fontSize: 18,
        fontFamily: 'Raleway'
    },
    imageLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    imageRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    link: {
      color: brandColor,
      fontSize: 12,
      fontFamily: 'Nunito-Light'
    }
}