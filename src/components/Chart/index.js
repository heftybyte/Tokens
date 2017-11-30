import React, { Component } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'native-base';
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
const periods = ['1D', '1W', '1M', '2M', '1Y', 'ALL']

class Chart extends Component {

    state ={
        selected: 2
    }

    render() {
        const { data } = this.props
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
                data={data.slice(0, data.length * ((this.state.selected + 1) * (100/periods.length))/100)}
            />
            </VictoryChart>
                <View style={styles.btnWrapper}>
                    {chartBtns}
                </View>
            </View>
        )
    }
}

export default Chart