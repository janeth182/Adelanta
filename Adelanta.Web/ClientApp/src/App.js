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
import { FacturasPage } from './pages/Clientes/Facturas/facturas';
import { SolicitudesPage } from './pages/Clientes/Solicitudes/solicitudes';
import { NuevaSolicitudPage } from './pages/Clientes/Solicitudes/nuevaSolicitud';
export const App = () => {	
	const {REACT_APP_RUTA_SERVIDOR} = process.env;
	return (
		<AuthProvider>
			<LayoutProvider>
				<BrowserRouter>
					<Switch>
						<PublicRouter exact path= { REACT_APP_RUTA_SERVIDOR + "login"} component={LoginPage} />
						<PrivateRouter path={ REACT_APP_RUTA_SERVIDOR } component={HomePage} exact/>
						<PrivateRouter
							exact path= {REACT_APP_RUTA_SERVIDOR + "clientes/solicitudes"} 
							component={SolicitudesPage}
						/>
						<PrivateRouter
							exact
							path={REACT_APP_RUTA_SERVIDOR + "clientes/nueva-solicitud"}
							component={NuevaSolicitudPage}
						/>						
						<PrivateRouter
							exact
							path={REACT_APP_RUTA_SERVIDOR + "clientes/facturas"}
							component={FacturasPage}
						/>
						<PrivateRouter
							exact
							path={REACT_APP_RUTA_SERVIDOR + "usuarios"}
							component={UsuariosPage}
						/>
						<PrivateRouter
							exact
							component={EditarUsuariosPage}
						/>
						<PrivateRouter
							exact
							path={REACT_APP_RUTA_SERVIDOR + "listar-post"}
							component={ListarPostPage}
						/>
						<PrivateRouter
							exact
							path= {REACT_APP_RUTA_SERVIDOR + "primer-nivel"}
							component={PrimerNivelPage}
						/>
						<PrivateRouter
							exact
							path= { REACT_APP_RUTA_SERVIDOR + "segundo-nivel"}
							component={SegundoNivelPage}
						/>
					</Switch>
				</BrowserRouter>
			</LayoutProvider>
		</AuthProvider>
	);
};
