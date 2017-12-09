import React from 'react';
import { TouchableHighlight, Text } from 'react-native'
import { Button, Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { bookmark, saveBookmark, removeBookmark } from '../../reducers/account';
import { showToast } from '../../reducers/ui';


class SaveButton extends React.Component {

    updateBookmark = async (save) => {
        if (save) {
            await this.props.saveBookmark(this.props.item)
            this.props.showToast('Saved to Bookmarks')
        } else {
            await this.props.removeBookmark(this.props.item)
            this.props.showToast('Removed from Bookmarks')
        }
    }

    render(){
        const { bookmarked } = this.props
        return (
            <Button transparent onPress={()=>this.updateBookmark(!bookmarked)} title="Bookmark news item" style={{paddingTop: 35}}>
                <Ionicons name={ bookmarked ? "ios-bookmark" : "ios-bookmark-outline"} size={18} color="white" />
            </Button>
        )
    }

}

const mapDispatchToProps = (dispatch) => ({
    saveBookmark: (e) => dispatch(saveBookmark(e)),
    removeBookmark: (e) => dispatch(removeBookmark(e)),
    showToast: (msg) => dispatch(showToast(msg))
})

export default connect( null, mapDispatchToProps)(SaveButton);
