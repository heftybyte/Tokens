import React from 'react'
import { Text, View, FlatList } from 'react-native'
import {styles} from './Style'
import { connect } from 'react-redux';
import Format from './Format'
import { withDrawer } from '../../helpers/drawer';


class BookMarks extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Bookmarks',
        headerStyle: {backgroundColor: '#000'},
    })

    renderItem = ({ item })=>
    {
        return (
            <View style={styles.slide}>
                <Format format={item.format} news={item} />
            </View>
        )
    }

    render() {
        return (
            this.props.bookmarks.length?
                <FlatList
                    data={this.props.bookmarks}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index}
                />
                :(<View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18, textAlign: 'center', color: '#fff'}}>You have no bookmarks.</Text>
            </View>)
        )
    }
}

const mapStateToProps = (state) => ({
    bookmarks: state.account.bookmarks,
    portfolio: state.account.portfolio
})

export default connect(mapStateToProps, null)(withDrawer(BookMarks));