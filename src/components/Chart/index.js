import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'native-base';
import { VictoryContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory-native";
import { gainColor, lossColor } from '../../config'

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
    },
}) 
const periods = ['1D', '1W', '1M', '2M', '1Y', 'ALL']

class Chart extends Component {

    state ={
        selected: 2
    }

    render() {
        const { data, totalChangePct } = this.props
        const gain = (totalChangePct||0) > 0
        let chartBtns = periods.map((x, i)=>(
            <Button onPress={()=>this.setState({selected: i})} key={i} transparent style={styles.chrtBtn}>
                <Text style={{color: this.state.selected===i?'#fff':'#6b2fe2'}}>{x}</Text>
            </Button>
        ))

        return (
            <View>
            <VictoryContainer height={180} width={100} responsive={false}>
            <VictoryChart height={240} padding={{ top: 5, bottom: 60, left: 40, right: 40 }}>
                <VictoryAxis
                dependentAxis crossAxis
                style={{ axis: {stroke: "#ccc"} }}
                />
            <VictoryLine
                style={{ data: { stroke: gain ? gainColor : lossColor } }}
                data={data.slice(0, data.length * ((this.state.selected + 1) * (100/periods.length))/100)}
            />
            </VictoryChart>
                
            </VictoryContainer>
            <View style={styles.btnWrapper}>
                    {chartBtns}
                </View>
            </View>
        )
    }
}

export default Chart