import React from "react"
import { View } from "react-native"

export const Normal = () => (
	<View>
		<Form>
			<Item fixedLabel>
				<Label>Username</Label>
				<Input />
			</Item>
			<Item fixedLabel last>
				<Label>Password</Label>
				<Input />
			</Item>
			<Item fixedLabel last>
				<Label>Confirm Password</Label>
				<Input />
			</Item>
		</Form>
	</View>
)