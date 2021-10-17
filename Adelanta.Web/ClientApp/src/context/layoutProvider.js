import { createContext, useEffect, useState } from "react";

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
	const [isSideBar, setIsSideBar] = useState(false);

	const [isMobil, setIsMobil] = useState(false);

	useEffect(() => {
		if (window.innerWidth <= 1024) {
			setIsMobil(true);
		}
	}, []);

	const toggleSidebar = () => {
		setIsSideBar((value) => !value);
	};
	const handlerToggleMobil = (value) => {
		setIsMobil(value);
	};

	const value = {
		isSideBar,
		toggleSidebar,
		handlerToggleMobil,
		isMobil,
	};

	return (
		<LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
	);
};
