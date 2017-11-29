import React, { Component } from "react";
import {
  StyleSheet,
  View, Text
} from 'react-native';
import { Button } from 'native-base';
import { withDrawer } from '../helpers/drawer';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory-native";



const day = [{ x: '1D', y: 2 },{ x: '1W', y: 3 },{ x: '1M', y: 5 },{ x: '4M', y: 4 },{ x: '5M', y: 7 }]
const periods = ['1D', '1W', '1M', '2M', '1Y', 'ALL']

class Chart extends Component {

    render() {
        let chartBtns = periods.map((x, i)=>(
            <Button key={i} transparent style={{marginLeft: 5, marginRight: 5, paddingLeft: 10, paddingRight: 10}}><Text style={{color: '#6b2fe2'}}>{x}</Text></Button>
        ))
        return (
            <View>
            <VictoryChart>
                
                <VictoryAxis
                dependentAxis
                />
            <VictoryLine
                style={{
                data: { stroke: "#6b2fe2" },
                parent: { border: "1px solid #ccc"}
                }}
                data={day}
            />
            </VictoryChart>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    {chartBtns}
                </View>
            </View>
        )
    }
}


const mapStateToProps = (state, props) => ({
  portfolio: state.account.portfolio,
})



export default connect(mapStateToProps, null)(withDrawer(Chart));