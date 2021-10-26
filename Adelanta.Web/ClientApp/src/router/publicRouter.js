import { useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { Route, Redirect } from "react-router-dom";

export const PublicRouter = ({ route, component: Component }) => {
	const { user } = useContext(AuthContext);
	const {REACT_APP_RUTA_SERVIDOR} = process.env;
	return (
		<Route {...route}>{user ? <Redirect to={REACT_APP_RUTA_SERVIDOR} /> : <Component />}</Route>
	);
};
