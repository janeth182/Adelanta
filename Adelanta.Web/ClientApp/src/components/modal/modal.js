import { Button, Modal } from "antd";

export const ModalComponent = ({
	show,
	title,
	onClose,
	children,
	nameButton,
	onPress,
	size,
	...props
}) => {
	return (
		<Modal
			title={title}
			visible={show}
			onOk={onPress}
			onCancel={onClose}
			width={size}
			footer={[
				<Button key="back" onClick={onClose}>
					Cancelar
				</Button>,
				<Button key="submit" type="primary" onClick={onPress}>
					{nameButton}
				</Button>,
			]}
			{...props}
		>
			{children}
		</Modal>
	);
};
