import { Form, InputNumber, Typography } from "antd";

const { Text } = Typography;

export const InputNumberComponent = ({ title, error, touched, ...props }) => {
    return (
        <Form.Item label={title}>
            <InputNumber {...props} />
            {error && touched ? (
                <Text style={{ fontSize: 12 }} type="danger">
                    {error}
                </Text>
            ) : null}
        </Form.Item>
    );
};
