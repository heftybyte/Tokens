import {StackNavigator} from 'react-navigation';
import CreateAccountScreen from './createAccount';
import ViewAccountsScreen from './viewAccounts';

const AccountsNavigator = StackNavigator({
    Accounts: { 
        screen: ViewAccountsScreen,
        navigationOptions: {
            title: 'Accounts'
        },
    },
    NewAccount: { 
        screen: CreateAccountScreen,
        navigationOptions: {
            title: 'New Account'
        },
    },
});

export default AccountsNavigator;
