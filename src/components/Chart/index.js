import React, { Component } from "react";
import { StyleSheet } from 'react-native' 
import { gainColor, lossColor } from '../../config'
import ChartView from 'react-native-highcharts'
import {ChartConfig} from './conf'

const styles = StyleSheet.create({
    chart: {
        height: 220,
        backgroundColor: '#000'
    },
}) 

class Chart extends Component {

    render() {
        const { data, totalChangePct } = this.props
        let config = new ChartConfig(totalChangePct >= 0?gainColor:lossColor)
        return (
            <ChartView style={{height:300}} config={config.conf} options={config.options} stock={true} style={styles.chart}></ChartView>                
        )
    }
}

export default Chart