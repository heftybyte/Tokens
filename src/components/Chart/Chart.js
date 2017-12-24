import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Button } from 'native-base';
import { VictoryGroup, VictoryCursorContainer, VictoryLine, VictoryTheme } from "victory-native";
import { Line } from 'victory-native/lib';
import { gainColor, lossColor } from '../../config'
import { mapAxis } from '../../helpers/functions'

// Use pageX instead of locationX to get around https://github.com/facebook/react-native/issues/7221
const onTouchMove = VictoryCursorContainer.defaultEvents[0].eventHandlers.onTouchMove
VictoryCursorContainer.defaultEvents[0].eventHandlers.onTouchMove = (evt, targetProps) => {
    const keys = Object.keys(evt)
    const mutatedEvt = {}
    // shallow copy
    keys.forEach(key=>{
        mutatedEvt[key] = evt[key]
    })
    // overwrite cooridnates
    mutatedEvt.nativeEvent = {
        ...evt.nativeEvent,
        locationX: evt.nativeEvent.pageX
    }
    return onTouchMove(mutatedEvt, targetProps)
}

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
        isTouched: false
    }

    onTouch = (isTouched) => {
        const { onTouch } = this.props
        this.setState({ isTouched })
        onTouch && onTouch(isTouched)
    }

    render() {
        const { data, totalChangePct, loading, onCursorChange, cursorDimension='x' } = this.props
        const opacity = loading ? .4 : 1
        const cursorColor = this.state.isTouched ? '#333' : 'transparent'

        return (
            <View
                onTouchStart={()=>this.onTouch(true)}
                onTouchEnd={()=>this.onTouch(false)}
                style={styles.container}
            >
                {loading && <ActivityIndicator style={styles.spinner} size="large" color="#fff" />}
                {!loading && !data.length && <Text style={styles.msg}>- No Data -</Text>}
                <VictoryGroup
                    height={180}
                    padding={{ top: 5, bottom: 0, left: 20, right: 20 }}
                    containerComponent={
                        <VictoryCursorContainer
                            cursorDimension={cursorDimension}
                            cursorComponent={<Line style={{stroke: cursorColor }}/>}
                            onCursorChange={(value, props)=>{
                                if (!onCursorChange || !value) return
                                const point = mapAxis(data, value, cursorDimension)
                                point && onCursorChange(point)
                            }}
                        />
                    }>
                    <VictoryLine
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