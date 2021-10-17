import { Form, Input, Typography } from "antd";

const { Text } = Typography;

export const InputComponent = ({ title, error, touched, ...props }) => {
	return (
		<Form.Item label={title}>
			<Input {...props} />
			{error && touched ? (
				<Text style={{ fontSize: 12 }} type="danger">
					{error}
				</Text>
			) : null}
		</Form.Item>
	);
};
