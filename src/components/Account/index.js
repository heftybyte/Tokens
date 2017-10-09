import {StackNavigator} from 'react-navigation';
import CreateAccountScreen from './CreateAccount';
import ViewAccountsScreen from './ViewAccounts';

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
