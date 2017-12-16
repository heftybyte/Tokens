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
        } else {
            await this.props.removeBookmark(this.props.item)
        }
    }

    render(){
        const { bookmarked } = this.props
        return (
            <Button
                transparent
                onPress={()=>this.updateBookmark(!bookmarked)}
                title="Save"
                style={{top:-12, left: 5}}
            >
                <Ionicons
                    name={ bookmarked ? "ios-bookmark" : "ios-bookmark-outline"}
                    size={20}
                    color={bookmarked ? "#666" : "#333"}
                />
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
