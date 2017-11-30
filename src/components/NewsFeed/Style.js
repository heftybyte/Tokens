export const styles = {
    container: {
        backgroundColor: '#0f0f0f',
        height: 200,
        paddingTop: 7
    },
    stickyContainer: {
      height: 150
    },
    stickyContainerWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      flex: 1
    },
    slide: {
        backgroundColor: '#000',
        borderColor: '#000',
        height:175,
        maxHeight:175,
        borderWidth: 10,
        borderRadius: 10,
        flex: 1,
        padding: 5,
        marginHorizontal: 7,
    },
    stickySlide: function () {
      return Object.assign({}, this.slide, { marginHorizontal: 0, borderRadius: 0, paddingBottom: 15})
    },
    body: {
        color: '#fff',
        fontFamily: 'Nunito-Light'
    },
    title: {
        color: '#777',
        fontFamily: 'Nunito-Light'
    },
    snippet: {
        color: '#fff'
    },
    action: {
        color: "#000"
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    video: {

    },
    image: {

    },
    textDefault: {
        fontSize: 20,
        fontFamily: 'Raleway'
    },
    stickyNewsSectionText: function () {
      return Object.assign({}, this.textDefault, { fontSize: 14 })
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
      color: '#6b2fe2',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Nunito-Light'
    }
}