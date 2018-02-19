import React, { Component } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Button } from 'native-base';
import { VictoryGroup, VictoryLine } from "victory-native";
import Svg, { Line } from 'react-native-svg'
import { gainColor, lossColor } from '../../config'
import { mapAxis } from '../../helpers/functions'

const { width: deviceWidth } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 200,
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
    msg: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 99,
        color: '#fff'
    },
    dim: {
        opacity: 0.6
    }
})

const defaultChartData = [{x:0,y:0},{x:0,y:0}]

class Chart extends Component {

    state = {
        isTouched: false,
        pageX: 0
    }

    onTouch = (e, isTouched) => {
        const { onCursorChange, onTouch, data } = this.props
        const pageX = e.nativeEvent.pageX - 20
        this.setState({ isTouched, pageX })
        onTouch && onTouch(isTouched)

        if (!onCursorChange) return
        const pct = (pageX / (deviceWidth - 40))
        const pointIndex = Math.floor(pct * data.length)
        const point = data[pointIndex]
        point && onCursorChange(point)
    }

    render() {
        const { data, totalChangePct, loading, onCursorChange } = this.props
        const opacity = loading ? .4 : 1
        const { pageX, isTouched } = this.state
        const cursorColor = isTouched ? '#555' : 'transparent'

        return (
            <View
                onTouchMove={(e)=>this.onTouch(e, true)}
                onTouchEnd={(e)=>this.onTouch(e, false)}
                style={styles.container}
            >
                {loading && <ActivityIndicator style={styles.spinner} size="large" color="#fff" />}
                {!loading && !data.length && <Text style={styles.msg}>- No Data -</Text>}
             
                <Svg
                    height={200}
                    width={deviceWidth-40}
                    style={{position: 'absolute', left: 20}}
                >
                    <Line
                        x1={pageX}
                        y1={0}
                        x2={pageX}
                        y2={200}
                        stroke={cursorColor}
                        strokeWidth={2}
                    />
                </Svg>
                <VictoryGroup
                    height={180}
                    padding={{ top: 5, bottom: 0, left: 20, right: 20 }}
                >
                    <VictoryLine
                        scale={{x: "time", y: "linear"}}
                        style={{
                            data: {
                                stroke: (totalChangePct >= 0) ? gainColor : lossColor,
                                opacity: opacity
                            }
                        }}
                        data={data.length ? data : defaultChartData}
                    />
                </VictoryGroup>
            </View>
        )
    }
}

export default Chart
