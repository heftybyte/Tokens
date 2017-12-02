import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'native-base';
import { VictoryGroup, VictoryCursorContainer, VictoryLine, VictoryTheme } from "victory-native";
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
        let chartBtns = periods.map((x, i)=>(
            <Button onPress={()=>this.setState({selected: i})} key={i} transparent style={styles.chrtBtn}>
                <Text style={{color: this.state.selected===i?'#fff':'#6b2fe2'}}>{x}</Text>
            </Button>
        ))

        return (
            <View>
            <VictoryGroup height={170} padding={{ top: 5, bottom: 0, left: 20, right: 20 }}
            containerComponent={
                <VictoryCursorContainer
                cursorDimension="x"
                cursorLabel={(d) => `guygiughiuhiohiuguyftyf`}
                />
            }>
            <VictoryLine
                style={{ data: { stroke: (totalChangePct >= 0) ? gainColor : lossColor } }}
                data={data.slice(0, data.length * ((this.state.selected + 1) * (100/periods.length))/100)}
            />
            </VictoryGroup>
                
            <View style={styles.btnWrapper}>
                    {chartBtns}
                </View>
            </View>
        )
    }
}

export default Chart