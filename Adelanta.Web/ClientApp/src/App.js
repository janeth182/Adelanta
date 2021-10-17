import "./App.css";
import { BrowserRouter, Switch } from "react-router-dom";
import { LayoutProvider } from "./context/layoutProvider";
import { HomePage } from "./pages/home";
import { UsuariosPage } from "./pages/User/usuarios";
import { ListarPostPage } from "./pages/Post/listar-post";
import { LoginPage } from "./pages/Auth/login";
import { AuthProvider } from "./context/authProvider";
import { PublicRouter } from "./router/publicRouter";
import { PrivateRouter } from "./router/privateRouter";
import { PrimerNivelPage } from "./pages/nivel/primerNivel";
import { SegundoNivelPage } from "./pages/nivel/segundoNivel";
import { EditarUsuariosPage } from "./pages/User/editar-usuario";

export const App = () => {
	return (
		<AuthProvider>
			<LayoutProvider>
				<BrowserRouter>
					<Switch>
						<PublicRouter exact path="/login" component={LoginPage} />
						<PrivateRouter exact path="/" component={HomePage} />
						<PrivateRouter
							exact
							path="/usuarios"
							component={UsuariosPage}
						/>
						<PrivateRouter
							exact
							path="/editar-usuario/:id"
							component={EditarUsuariosPage}
						/>
						<PrivateRouter
							exact
							path="/listar-post"
							component={ListarPostPage}
						/>
						<PrivateRouter
							exact
							path="/primer-nivel"
							component={PrimerNivelPage}
						/>
						<PrivateRouter
							exact
							path="/segundo-nivel"
							component={SegundoNivelPage}
						/>
					</Switch>
				</BrowserRouter>
			</LayoutProvider>
		</AuthProvider>
	);
};
