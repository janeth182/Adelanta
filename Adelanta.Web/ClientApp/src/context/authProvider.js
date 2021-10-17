import { createContext, useState } from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null
	);

	const loginUser = (user) => {
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
	};

	const logoutUser = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	const data = {
		user,
		loginUser,
		logoutUser,
	};

	return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
