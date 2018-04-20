import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { baseColor, lossColor, brandColor } from '../../config'
import { Button, StyleProvider, List, ListItem, Body, Left, Right, Switch, Icon, Separator } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
import { withDrawer } from '../../helpers/drawer';
import { createPriceAlert } from '../../reducers/account'
import { SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { getPriceAlert,disablePriceAlert, enablePriceAlert, deletePriceAlert } from '../../reducers/alert'


const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: baseColor
  },
  container: {
    display: 'flex',
    borderColor: '#fff',
    justifyContent: 'center',
    backgroundColor: baseColor,
    marginBottom: 10,
    paddingLeft: 20
  },
  containerChild: {
    marginBottom: 15,
    flexGrow: .5,
    flexBasis: 1,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  textInput: {
    height: 30,
    fontSize: 14,
    width: '50%',
    borderColor: 'gray',
    borderBottomWidth: 1,
    color: '#fff'
  },
  horizontalLine: {
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1,
    marginTop: 15,
    marginBottom: 15
  }
})

const radioProps = [
  {label: 'One Time', value: 0 },
  {label: 'Continuous', value: 1 }
]

const ShowPriceAlerts = ({alert, goToCreatePriceAlertPage, currencyName, price, currencySymbol, deletePriceAlert, switchAlert}) => (
  <View style={{flex: 1}}>
    <ListItem itemHeader first>
            <Text style={{color:'#fefefe'}}>{currencyName} Alerts</Text>
          </ListItem>
          <FlatList
              renderItem={({item}) => {
                return (
                   <ListItem icon onLongPress={() => deletePriceAlert(item.id)}>
                    <Left>
                    {
                      (item.type == 0)?
                        <SimpleLineIcons name={'arrow-up-circle'} color={'#fff'} style={{fontSize: 24}} />
                        :
                        <SimpleLineIcons name={'arrow-down-circle'} color={'#fff'} style={{fontSize: 24}} />
                    }
                    </Left>
                    <Body>
                    <Text style={{color:'#fefefe', fontSize: 18}}>{item.tsym} {item.price}</Text>
                    <View style={{flexDirection: 'row'}}>
                      {
                        (item.type == 0)?
                           <Text style={{color: '#666'}}>Greater Than</Text>
                           :
                           <Text style={{color: '#666'}}>Less Than</Text>
                      }
                      <Entypo name={"dot-single"} color={"#fff"}  style={{fontSize: 15}}/>
                      {
                        (item.frequency == 0)?
                          <Text style={{color:'#666'}}>Once</Text>
                          :
                          <Text style={{color:'#666'}}>Persistent</Text>
                      }
                    </View>
                    </Body>
                    <Right>
                      <Switch value={item.status} onValueChange={()=>{switchAlert(item)}} />
                    </Right>
                  </ListItem>
                )
              }}
              data={alert}
              keyExtractor={(item) => item.id}
          />

          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
            <Button
                style={{flex: .8}}
                primary
                title={"Create Alert"}
                block
                onPress={() => { goToCreatePriceAlertPage({currencyName, price, currencySymbol}) }}>
              <Text style={{color: '#000'}}>Create Alert</Text>
            </Button>
          </View>
  </View>
)

const ShowCreateAlerts = ({goToCreatePriceAlertPage, currencyName, price, currencySymbol}) => (
  <View style={{justifyContent: 'center', alignItems: 'center', flex:1}}>
    <Entypo name={"bell"} color={"#fff"}  style={{fontSize: 100}}/>
    <Text style={{color:'#fefefe'}}>You haven't created any Bitcoin price alerts</Text>
      <Text style={{color:'#fefefe'}}>Create alerts to let you know when the price changes</Text>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
        <Button
            style={{flex: .8}}
            primary
            title={"Create Alert"}
            block
            onPress={() => { goToCreatePriceAlertPage({currencyName, price, currencySymbol})  }}>
          <Text style={{color: '#000'}}>Create Alert</Text>
        </Button>
      </View>
  </View>
)

class PriceAlert extends Component {
  state = {
    radioValue: 0,
     gt: 0,
     lt: 0,
     frequency: 0,
     alerts: [],
  }


  componentWillMount = async() => {
    const { getPriceAlert, alert } = this.props;
    getPriceAlert();
  }

  switchAlert = async(item) => {
      const { enablePriceAlert,disablePriceAlert } = this.props;
      if(item.status){
          disablePriceAlert(item.id)
          return
      }
      enablePriceAlert(item.id)
  }

  deletePriceAlert = (alertId) => {
    const { deletePriceAlert } = this.props;
    Alert.alert(
        'Delete Alert',
        'Will you like to delete this Price Alert ?',
        [
            {text: 'Cancel', onPress: () => {}},
            {text: 'OK', onPress: () => {
                deletePriceAlert(alertId)
            }},
        ],
        { cancelable: true }
    )
  }

  componentWillReceiveProps = (nextProps) => {
      console.log('getDerivedStatefromprops')
      console.log(nextProps)
      const alerts = nextProps.alert.filter((item) => item.fsym == this.props.currencySymbol)
      this.setState({alerts})
  }

  render() {
    let { goToCreatePriceAlertPage, currencyName, price, currencySymbol } = this.props

      return (
        <StyleProvider style={getTheme(_platform)}>
        <ScrollView
        style={styles.scrollContainer}
        containerStyleContent={styles.container}
        >
        
        {
          (this.state.alerts.length == 0 ) ?
            <ShowCreateAlerts 
              goToCreatePriceAlertPage={goToCreatePriceAlertPage}
              currencyName={currencyName}
              price={price}
              currencySymbol={currencySymbol}
            />
            :
            <ShowPriceAlerts
              alert={this.state.alerts}
              goToCreatePriceAlertPage={goToCreatePriceAlertPage}
              currencyName={currencyName}
              price={price}
              currencySymbol={currencySymbol}
              deletePriceAlert={this.deletePriceAlert}
              switchAlert={this.switchAlert}
            />
        }
          

      </ScrollView>
        </StyleProvider>

    )
  }
}

const mapStateToProps = (state, props) => ({
    tokenDetails: state.account.tokenDetails,
    portfolio: state.account.portfolio,
    alert: state.alert,
    ...props.navigation.state.params,
})

const mapDispatchToProps = (dispatch) => ({
  goToCreatePriceAlertPage: ({price, currencySymbol, currencyName, edit=false}) => dispatch(
                            NavigationActions.navigate({ routeName: 'Create Price Alert',
                                params: {price, currencySymbol, currencyName, edit} })),
  getPriceAlert: () => dispatch(getPriceAlert()),
  disablePriceAlert: (alertId)=>dispatch(disablePriceAlert(alertId)),
  enablePriceAlert: (alertId)=>dispatch(enablePriceAlert(alertId)),
  deletePriceAlert: (alertId) => dispatch(deletePriceAlert(alertId)),

})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(PriceAlert));