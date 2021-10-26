import { useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { Route, Redirect } from "react-router-dom";

export const PrivateRouter = ({ route, component: Component }) => {
	const { user } = useContext(AuthContext);
	const {REACT_APP_RUTA_SERVIDOR} = process.env;
	return (
		<Route {...route}>
			{user ? <Component /> : <Redirect to={REACT_APP_RUTA_SERVIDOR + 'login'} />}
		</Route>
	);
};
