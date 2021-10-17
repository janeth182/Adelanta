import { useState } from "react";

export const useMessageApi = () => {
	const [isMessage, setIsMessage] = useState(false);
	const [messageInfo, setMessageInfo] = useState({
		type: "success",
		text: "string",
		description: "",
	});

	const showMessage = (time = 2) => {
		setIsMessage(true);
		return new Promise((resolve) =>
			setTimeout(() => {
				resolve(setIsMessage(false));
			}, time * 1000)
		);
	};

	const addMessage = async ({ type, text, description = "", time }) => {
		setMessageInfo({ type, description, text });
		await showMessage(time);
	};

	return {
		isMessage,
		showMessage,
		addMessage,
		messageInfo,
	};
};
