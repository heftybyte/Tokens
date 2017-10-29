import {StackNavigator} from 'react-navigation';
import CreateAccountScreen from './CreateAccount';
import ViewAccountsScreen from './ViewAccounts';

const AccountsNavigator = StackNavigator({
    Accounts: { 
        screen: ViewAccountsScreen
    },
    NewAccount: { 
        screen: CreateAccountScreen
    },
});

export default AccountsNavigator;
