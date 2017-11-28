import React, { Component } from "react";
import { withDrawer } from '../helpers/drawer';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

class Chart extends Component {

    render() {
        return (
            <VictoryChart>
            <VictoryLine
                style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc"}
                }}
                data={[
                { x: 1, y: 2 },
                { x: 2, y: 3 },
                { x: 3, y: 5 },
                { x: 4, y: 4 },
                { x: 5, y: 7 }
                ]}
            />
            </VictoryChart>
        )
    }
}


const mapStateToProps = (state, props) => ({
  portfolio: state.account.portfolio,
})



export default connect(mapStateToProps, null)(withDrawer(Chart));