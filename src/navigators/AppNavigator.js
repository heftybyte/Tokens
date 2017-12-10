import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, DrawerNavigator, SafeAreaView } from 'react-navigation';
import { Text, ScrollView, TouchableWithoutFeedback, Platform, Image, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import AccountsNavigator from '../components/Account';
import Entry from '../components/Entry';
import Dashboard from '../components/Dashboard';
import AddAddress from '../components/Account/AddAddress';
import ViewAccounts from '../components/Account/ViewAccounts';
import TokenDetails from '../components/TokenDetails';
import Search from '../components/Search';
import BookMarks from '../components/NewsFeed/BookMark';
import Register, { NormalRegistration, GuestRegistration } from '../components/Register';
import CardStackStyleInterpolator from 'react-navigation/lib/views/CardStack/CardStackStyleInterpolator';
import { trackTap } from '../helpers/analytics';
import DashboardMenu from '../helpers/drawer';
import { getTokenImage } from '../helpers/functions'

const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forFadeFromBottomAndroid(sceneProps);
  },
});

const contentComponent = ({navigation}) => (
  <ScrollView>
    <SafeAreaView style={{flex: 1}} forceInset={{ top: 'never', horizontal: 'never' }}>
      <DashboardMenu navigation={navigation} />
    </SafeAreaView>
  </ScrollView>
)

const drawerOptions = {
  contentComponent,
  drawerBackgroundColor: '#111'
}

const navOptions = (navigation, HeaderComponent = GenericHeaderTitle) => (
  {
    headerStyle: {
      backgroundColor: '#000',
      marginTop: 20,
      marginLeft: (HeaderComponent !== DashboardHeaderTitle && Platform.OS === 'ios' ? 22 : 0)
    },
    headerTintColor: '#fff',
    headerTitle: <HeaderComponent navigation={navigation}/>
  }
)

const HeaderRight = ({navigation}) => (
  <TouchableWithoutFeedback
    onPress={()=>{trackTap('Search');navigation.navigate('Search')}}
  >
      <Ionicons name='ios-search-outline' size={28} style={{
        color: '#fff',
        marginRight: 22
      }} />
  </TouchableWithoutFeedback>
)

const GenericHeaderTitle = ({navigation}) => (
  <Text style={{
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-ExtraLight',
  }}>
    {navigation.state.routeName}
  </Text>
)

const DashboardHeaderTitle = ({navigation}) => {
  const { state: navState } = navigation
  const params = navigation.state.routes[0].routes[0].params
  const headerText = navState && params && params.overrideHeaderText ||
      navState.routeName

  return (
    <Text style={{
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Nunito-ExtraLight',
    }}>
      {headerText}
    </Text>
  )
}

const TokenHeaderTitle = ({navigation}) => {
  const { state: navState } = navigation
  const params = navigation.state.routes[0].routes[0].params
  const tokenDetails = params && params.token || {}

  return (
    <View style={{
        flexDirection: 'row',
        alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
        alignItems: 'center',
        flex:1
    }}>
        <Image key={tokenDetails.symbol}
          source={{ uri: getTokenImage(tokenDetails) }}
          style={{width: 20, height: 20, borderRadius: 5}}
        />
        <Text style={{color: '#fff', paddingLeft: 10}}>
            {tokenDetails.name||tokenDetails.symbol}
        </Text>
    </View>
  )
}

const TokenDraw = DrawerNavigator({
  'Token Details': {
    screen: TokenDetails,
    navigationOptions: ({navigation}) => ({
      headerRight: <HeaderRight navigation={navigation} />
    })
  }
}, drawerOptions)

const AddAddressDraw = DrawerNavigator({
  'Add Address': {
    screen: AddAddress,
    navigationOptions: ({navigation}) => ({
      headerRight: <HeaderRight navigation={navigation} />
    })
  }
}, drawerOptions)

const AccountsDraw = DrawerNavigator({
  Accounts: {
    screen: ViewAccounts,
    navigationOptions: ({navigation}) => ({
      headerRight: <HeaderRight navigation={navigation} />
    })
  }
}, drawerOptions)

const SearchDraw = DrawerNavigator({
  Search: {
    screen: Search,
    navigationOptions: ({navigation}) => ({
      headerRight: <HeaderRight navigation={navigation} />
    })
  }
}, drawerOptions)

const DashboardDraw = DrawerNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: ({navigation}) => ({
      headerLeft: <TouchableWithoutFeedback onPress={() => {navigation.navigate('DrawerOpen')}}>
        <MaterialCommunityIcons
            name='menu'
            size={26}
            style={{
              color: '#fff',
              marginLeft: 22
            }}
            />
      </TouchableWithoutFeedback>,
      headerRight: <HeaderRight navigation={navigation} />
    })
  }
}, drawerOptions)

const HeaderStack = StackNavigator({
  Dashboard: {
    screen: DashboardDraw,
    navigationOptions: ({navigation}) => (navOptions(navigation, DashboardHeaderTitle))
  },
  'Token Details': {
    screen: TokenDraw,
    navigationOptions: ({navigation}) => (navOptions(navigation, TokenHeaderTitle))
  },
  Accounts: {
    screen: AccountsDraw,
    navigationOptions: ({navigation}) => (navOptions(navigation))
  },
  Search: {
    screen: SearchDraw,
    navigationOptions: ({navigation}) => (navOptions(navigation))
  },
  'Add Address': {
    screen: AddAddressDraw,
    navigationOptions: ({navigation}) => (navOptions(navigation))
  }
}, {
  headerMode: 'float'
})

export const AppNavigator = StackNavigator({
  Entry: { screen: Entry },
  NormalRegistration: { screen: NormalRegistration },
  GuestRegistration: { screen: GuestRegistration },
  Login: { screen: NormalRegistration },
  Dashboard: { screen: HeaderStack },
  Accounts : { screen: HeaderStack },
  'Add Address': { screen: HeaderStack },
  Search: { screen: HeaderStack },
  Register: { screen: Register },
  'Token Details': { screen: HeaderStack }
}, {
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#000'
  },
  transitionConfig: customAnimationFunc
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator
    navigation={addNavigationHelpers({ dispatch, state: nav })}
  />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
