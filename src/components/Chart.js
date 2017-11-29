import React, { Component } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'native-base';
import { withDrawer } from '../helpers/drawer';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory-native";

const styles = StyleSheet.create({
    btnWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    chrtBtn: {
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 10,
        paddingRight: 10
    }
}) 

const data = [{ x: 1, y: 230 },{ x: 2, y: 340 },{ x: 3, y: 280 },{ x: 4, y: 360 },{ x: 5, y: 400 },{ x: 6, y: 340 }]
const periods = ['1D', '1W', '1M', '2M', '1Y', 'ALL']

class Chart extends Component {

    state ={
        selected: 2
    }

    render() {
        let chartBtns = periods.map((x, i)=>(
            <Button onPress={()=>this.setState({selected: i})} key={i} transparent style={styles.chrtBtn}>
                <Text style={{color: this.state.selected===i?'#fff':'#6b2fe2'}}>{x}</Text>
            </Button>
        ))
        return (
            <View>
            <VictoryChart>
                <VictoryAxis
                dependentAxis
                style={{ axis: {stroke: "#ccc"} }}
                />
            <VictoryLine
                style={{ data: { stroke: "#6b2fe2" } }}
                data={data}
            />
            </VictoryChart>
                <View style={styles.btnWrapper}>
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