import { useContext } from "react";
import { useEffect } from "react/cjs/react.development";
import { ContentComponent } from "../components/layout/content";
import { AuthContext } from "../context/authProvider";
export const HomePage = () => {
	const { user } = useContext(AuthContext);
	useEffect(() => {
		console.log(user);
	}, [user]);
	return (
		<ContentComponent>
			<h1>
				Bienvenido
			</h1>			
		</ContentComponent>
	);
};
