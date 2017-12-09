import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native' 
import { gainColor, lossColor } from '../../config'
import ChartView from 'react-native-highcharts'
import { ChartConfig } from './conf'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        justifyContent: 'center'
    },
    chart: {
        flex: 1,
        height: 300,
        backgroundColor: '#000',
        paddingBottom: 10
    },
    spinner: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 99
    },
    dim: {
        opacity: 0.6
    }
})

class Chart extends Component {

    render() {
        const { data, totalChangePct, loading } = this.props
        let config = new ChartConfig(data, totalChangePct >= 0 ? gainColor : lossColor)
        return (
            <View style={styles.container}>
                {loading && <ActivityIndicator style={styles.spinner} size="large" color="#fff" />}
                <ChartView
                    config={config.conf}
                    options={config.options}
                    stock={true}
                    style={[styles.chart, loading ? styles.dim : {}]}
                />
            </View>
        )
    }
}

export default Chart;