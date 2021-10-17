import { Form, Select, Typography } from "antd";

const { Text } = Typography;
const { Option } = Select;

export const SelectComponent = ({
	title,
	error,
	placeholder,
	touched,
	children,
	...props
}) => {
	return (
		<Form.Item label={title}>
			<Select {...props}>
				<Option value="">
					{placeholder ? placeholder : "-- Seleccionar --"}
				</Option>
				{children}
			</Select>
			{error && touched ? (
				<Text style={{ fontSize: 12 }} type="danger">
					{error}
				</Text>
			) : null}
		</Form.Item>
	);
};
