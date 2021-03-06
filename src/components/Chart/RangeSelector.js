import React, { Component } from "react";
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native' 
import { changePeriod } from '../../reducers/ticker'
import { trackTap } from '../../helpers/analytics'

const styles = StyleSheet.create({
    periods: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 40,
        paddingVertical: 10
    },
    period: {
        flex: 1
    },
    periodLabel: {
        color: '#555'
    },
    periodLabelActive: {
        color: '#fff'
    }
})

const periods = ['1d', '1w', '1m', '3m', '1y', 'all']

class RangeSelector extends Component {
    render() {
        const { period, onChange, style } = this.props
        const selectedIndex = periods.indexOf(period)
        return (
            <View style={[styles.periods, style || {}]}>
                {periods.map((period, i)=>
                    <TouchableHighlight
                        key={period}
                        style={styles.period}
                        onPress={()=>{
                            this.props.changePeriod(period)
                            onChange && onChange(period)
                            trackTap(`RangeSelector:${period}`)
                        }}
                    >
                        <Text style={[
                            styles.periodLabel,
                            selectedIndex === i ? styles.periodLabelActive : {}
                        ]}>
                            {period.toUpperCase()}
                        </Text>
                    </TouchableHighlight>
                )}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    period: state.ticker.period
})

const mapDispatchToProps = (dispatch) => ({
    changePeriod: period => dispatch(changePeriod(period))
})

export default connect(mapStateToProps, mapDispatchToProps)(RangeSelector);