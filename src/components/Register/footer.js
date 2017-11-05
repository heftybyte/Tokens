import React from "react"
import reduxStore from '../../store'
import Toast, { DURATION } from 'react-native-easy-toast'

export default class Footer extends React.Component {
    componentWillReceiveProps = (nextProps) => {
        const { toast } = nextProps
        if (toast && this.refs.toast) {
            this.refs.toast.show(toast, DURATION.LENGTH_LONG)
        }
    }
	render() {
		return (
			<Toast
				ref="toast"
				style={{backgroundColor:'#111'}}
			/>
		)
	}
}