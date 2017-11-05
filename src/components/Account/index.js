import {StackNavigator} from 'react-navigation';
import AddAddressScreen from './AddAddress';
import ViewAccountsScreen from './ViewAccounts';

const AccountsNavigator = StackNavigator({
    Accounts: { 
        screen: ViewAccountsScreen
    },
    'Add Address': { 
        screen: AddAddressScreen
    },
});

export default AccountsNavigator;
