import { useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { Route, Redirect } from "react-router-dom";

export const PrivateRouter = ({ route, component: Component }) => {
	const { user } = useContext(AuthContext);
	return (
		<Route {...route}>
			{user ? <Component /> : <Redirect to="/login" />}
		</Route>
	);
};
