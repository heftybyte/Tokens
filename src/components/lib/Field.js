// @flow
import { pickBy } from "lodash"
import React, { Component } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import { ListItem, Item, Label, Input, Body, Right, Icon } from "native-base"
import { TextField } from "react-native-material-textfield"
import IconMd from "@expo/vector-icons/MaterialIcons"
import { observable, action } from "mobx"
import { observer } from "mobx-react/native"

interface FieldProps {
	label: string;
	defaultValue?: string;
	last?: boolean;
	inverse?: boolean;
	right?: () => React$Element<*>;
	onChange?: string => mixed;
	picker?: boolean;
	disabled?: boolean;
	onPress?: () => void;
	error?: string;
	renderAccessory?: () => React$Element<*>;
}

@observer
export class Field extends Component {
	props: FieldProps
	inputRef: any

	@observable value: string

	componentWillMount() {
		this.setValue(this.props.defaultValue || "")
	}

	@action
	setValue = (value: string) => {
		const { onChange } = this.props
		this.value = value
		if (onChange) {
			onChange(value)
		}
	}

	focus = () => {
		if (this.inputRef) {
			this.inputRef.focus()
		}
	}

	render(): React$Element<*> {
		const {
			label,
			type,
			inverse,
			defaultValue,
			onChange,
			picker,
			onPress,
			error
		} = this.props
		const style = inverse ? { color: "white" } : {}
		const keysToFilter = [
			"right",
			"defaultValue",
			"inverse",
			"label",
			"last",
			"onPress",
			"error"
		]
		const props = _.pickBy(
			this.props,
			(value, key) => keysToFilter.indexOf(key) === -1
		)
		const { value } = this

		const field = (
			<TextField
				label={label}
				secureTextEntry={type==='password'}
				value={value}
				ref={ref => {
					this.inputRef = ref
				}}
				defaultValue={defaultValue}
				onChangeText={onChange}
				tintColor={"#fbfbfb"}
				style={[{
					fontFamily: "Nunito",
					fontSize: 14,
					color: "#fff",
					marginBottom: 10
				}, style]}
				{...props}
				error={error}
				labelTextStyle={{
					paddingVertical: 5,
					paddingHorizontal: 8
				}}
				labelHeight={20}
				baseColor="#eee"
				labelFontSize={12}
				titleFontSize={11}
				inputContainerStyle={{
					borderBottomWidth: 0,
					paddingHorizontal: 5,
					backgroundColor: "#161616",
					borderRadius: 5
				}}
				containerStyle={{
					margin: 0
				}}
				placeholderTextColor="#333"
				autoCapitalize="none"
			/>
		)
		if (picker) {
			return (
				<TouchableNativeFeedback
					background={TouchableNativeFeedback.SelectableBackground()}
					onPress={onPress}
				>
					<View style={{ paddingTop: 8, paddingHorizontal: 16 }}>{field}</View>
				</TouchableNativeFeedback>
			)
		}
		return <View style={{ paddingTop: 8, paddingHorizontal: 16 }}>{field}</View>
	}
}
