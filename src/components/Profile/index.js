import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import Dashboard from '../Common/Dashboard'
import {
  getPortfolio,
  getPortfolioChart
} from '../../reducers/account';

class Profile extends Component {

  componentDidMount = async () => {
    await Promise.all([
      this.props.getPortfolio(true),
      this.props.getPortfolioChart()
    ])
  }

  onRefresh = () => {
    return Promise.all([
      this.props.getPortfolio(false),
      this.props.getPortfolioChart()
    ])
  }

  render() {
    const { navigation, portfolio, portfolioChart } = this.props
    return (
       <Dashboard
          navigation={navigation}
          portfolio={portfolio}
          portfolioChart={portfolioChart}
          onRefresh={this.onRefresh}
       />
    )
  }

}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio,
  chartLoading: state.account.chartLoading,
  portfolioChart: state.account.portfolioChart,
  watchListSymbols: state.account.watchList,
  newsFeed: state.feed,
  stale: state.account.stale,
  period: '1d',
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
    getPortfolio: (showUILoader) => dispatch(getPortfolio(showUILoader)),
    getPortfolioChart: () => dispatch(getPortfolioChart('1d')),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Profile));
