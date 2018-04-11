import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { StyleSheet, Alert } from 'react-native';
import { Container, Content, ListItem, Text, CheckBox, Body, Right, List} from 'native-base';

import { setDefaultCurrency } from '../../reducers/account';
import { brandColor } from '../../config'

const styles = StyleSheet.create({
    white: {
        color :'#fff',
    },
    grey: {
        color: '#4c4c4c'
    },
    title: {
        color: brandColor,
        fontSize: 18
    }
})

const SetCurrency = ({preference, setCurrency}) => {
    const currencies = ["AUD", "BTC", "CNY", "ETH", "EUR", "JPY", "KRW", "USD"]

    return(
        <Container>
            <Content>
                <List>
                  <ListItem itemHeader first>
                      <Text style={styles.title}>Currencies</Text>
                  </ListItem>

                  {currencies.map(currency => (
                    <ListItem onPress={() => setCurrency(currency)} noBorder>
                      <Body>
                        <Text style={styles.white}>
                          { currency }
                        </Text>
                      </Body>

                      <Right>
                        <CheckBox checked={preference.currency === currency} />
                      </Right>
                    </ListItem>
                  ))}
                </List>
            </Content>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    preference: state.account.preference,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrency: (currency) => dispatch(setDefaultCurrency(currency)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SetCurrency));