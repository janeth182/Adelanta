import { Alert } from "antd";
export const MessageApi = ({
	type,
	message,
	visibility,
	description,
	...props
}) => {
	return visibility ? (
		<Alert
			message={message}
			description={description}
			type={type}
			showIcon={true}
			closable
			{...props}
		/>
	) : null;
};
