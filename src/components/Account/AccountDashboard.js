import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import Dashboard from '../Dashboard'

class AccountDashboard extends Component {

  render() {
  	const { accountId, accountType } = this.props
  	return (
  		<Dashboard
	  		type={accountType}
	  		id={accountId}
	  	/>
  	)
  }

}

const mapStateToProps = (state) => ({
  accountType: 'address',
  accountId: '',
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(AccountDashboard));
