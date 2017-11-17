import React from 'react';
import { TouchableHighlight, Text, Alert} from 'react-native'
import { Button, Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { bookmark, getBookmark } from '../../reducers/account';



class SaveButton extends React.Component {


    savetoBookmark = () => {
        this.props.bookmark(this.props.item)
        Alert.alert('News feed saved to bookmarks!!')
    }


    render(){
        return (
            <Button transparent onPress={this.savetoBookmark} title="Bookmark news item" style={{paddingTop: 35}}>
                <Ionicons name="ios-bookmark" size={28} color="white" />
            </Button>
        )
    }

}


const mapDispatchToProps = (dispatch) => ({
    bookmark: (e) => dispatch(getBookmark(e))
})

export default connect( null, mapDispatchToProps)(SaveButton);
