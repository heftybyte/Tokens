import React, { Component } from "react";
import { StyleSheet } from 'react-native' 
import { gainColor, lossColor } from '../../config'
import ChartView from 'react-native-highcharts'
import {conf, options} from './conf'

const styles = StyleSheet.create({
    chart: {
        height: 220,
        backgroundColor: '#000'
    },
}) 

class Chart extends Component {

    render() {
        const { data, totalChangePct } = this.props
        console.log(data)
        return (
            <ChartView style={{height:300}} config={conf} options={options} stock={true} style={styles.chart}></ChartView>                
        )
    }
}

export default Chart