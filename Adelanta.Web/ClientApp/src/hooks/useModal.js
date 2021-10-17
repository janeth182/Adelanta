import { useState } from "react";

export const useModal = () => {
	const [isModal, setIsModal] = useState(false);

	const hiddenModal = () => {
		setIsModal(false);
	};

	const showModal = () => {
		setIsModal(true);
	};

	return {
		isModal,
		showModal,
		hiddenModal,
	};
};
