import React, { Component } from "react";
import { withDrawer } from '../helpers/drawer';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine } from "victory-native";

class Chart extends Component {

    render() {
        return (
            <VictoryChart/>
        )
    }
}


const mapStateToProps = (state, props) => ({
  portfolio: state.account.portfolio,
})



export default connect(mapStateToProps, null)(withDrawer(Chart));