import "./App.css";
import { BrowserRouter, Switch } from "react-router-dom";
import { LayoutProvider } from "./context/layoutProvider";
import { HomePage } from "./pages/home";
import { UsuariosPage } from "./pages/Usuarios/usuarios";
import { LoginPage } from "./pages/Auth/login";
import { AuthProvider } from "./context/authProvider";
import { PublicRouter } from "./router/publicRouter";
import { PrivateRouter } from "./router/privateRouter";
import { PrimerNivelPage } from "./pages/nivel/primerNivel";
import { SegundoNivelPage } from "./pages/nivel/segundoNivel";
import { EditarUsuariosPage } from "./pages/Usuarios/editar-usuario";
import { FacturasPage } from "./pages/Clientes/Facturas/facturas";
import { SolicitudesPage } from "./pages/Clientes/Solicitudes/solicitudes";
import { NuevaSolicitudPage } from "./pages/Clientes/Solicitudes/nuevaSolicitud";
import { CapitalTrabajoPage } from "./pages/Clientes/Solicitudes/capitalTrabajo";
import { RespuestaPagadorPage } from "./pages/Operaciones/RespuestaPagador/respuestaPagador";
import { LiqSolicitarAprobacionPage } from "./pages/Operaciones/LiqSolicitarAprobacion/liqSolicitarAprobacion";
import { LiqConfirmarAprobacionPage } from "./pages/Operaciones/LiqConfirmarAprobacion/liqConfirmarAprobacion";
import { ConformidadPagadorPage } from "./pages/Operaciones/ConformidadPagador/conformidadPagador";
import { RegistroFactrackPage } from "./pages/Operaciones/RegistroFactrack/registroFactrack";
import { LiquidacionesPage } from "./pages/Operaciones/Liquidaciones/liquidaciones";
import { AprobacionDesembolsoPage } from "./pages/Desembolso/AprobacionDesembolso/aprobacionDesembolso";
import { GeneracionArchivoPage } from "./pages/Desembolso/GeneracionArchivo/generacionArchivo";
import { ConsultaFacturasPage } from "./pages/Facturacion/ConsultaFacturas/consultaFacturas";
import { EmitirFacturasPage } from "./pages/Facturacion/EmitirFacturas/emitirFacturas";
import { ClientesPage } from "./pages/Comercial/Clientes/clientes";
import { CheckListPage } from "./pages/Comercial/CheckList/checkList";
import { PagadorPage } from "./pages/Comercial/Pagador/pagador";
export const App = () => {
  const { REACT_APP_RUTA_SERVIDOR } = process.env;
  return (
    <AuthProvider>
      <LayoutProvider>
        <BrowserRouter>
          <Switch>
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR}
              component={HomePage}
            />
            <PublicRouter
              path={REACT_APP_RUTA_SERVIDOR + "login"}
              component={LoginPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "clientes/solicitudes"}
              component={SolicitudesPage}
            />
            <PrivateRouter
              path={
                REACT_APP_RUTA_SERVIDOR + "clientes/solicitudes/nueva-solicitud"
              }
              component={NuevaSolicitudPage}
            />
            <PrivateRouter
              path={
                REACT_APP_RUTA_SERVIDOR + "clientes/solicitudes/capital-trabajo"
              }
              component={CapitalTrabajoPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "clientes/facturas"}
              component={FacturasPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "operaciones/respuesta-pagador"}
              component={RespuestaPagadorPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "operaciones/registro-factrack"}
              component={RegistroFactrackPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "operaciones/liquidaciones"}
              component={LiquidacionesPage}
            />
            <PrivateRouter
              exact
              path={
                REACT_APP_RUTA_SERVIDOR +
                "operaciones/liquidaciones-solicitar-aprobacion"
              }
              component={LiqSolicitarAprobacionPage}
            />
            <PrivateRouter
              exact
              path={
                REACT_APP_RUTA_SERVIDOR +
                "operaciones/liquidaciones-confirmar-aprobacion"
              }
              component={LiqConfirmarAprobacionPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "operaciones/conformidad-pagador"}
              component={ConformidadPagadorPage}
            />
            <PrivateRouter
              exact
              path={
                REACT_APP_RUTA_SERVIDOR + "desembolso/aprobacion-desembolso"
              }
              component={AprobacionDesembolsoPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "desembolso/generacion-archivos"}
              component={GeneracionArchivoPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "facturacion/consulta-facturas"}
              component={ConsultaFacturasPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "facturacion/emitir-facturas"}
              component={EmitirFacturasPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "comercial/clientes"}
              component={ClientesPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "comercial/pagador"}
              component={PagadorPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "comercial/check-list"}
              component={CheckListPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "usuarios"}
              component={UsuariosPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "usuarios/editar-usuario/:id"}
              component={EditarUsuariosPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "primer-nivel"}
              component={PrimerNivelPage}
            />
            <PrivateRouter
              exact
              path={REACT_APP_RUTA_SERVIDOR + "segundo-nivel"}
              component={SegundoNivelPage}
            />
          </Switch>
        </BrowserRouter>
      </LayoutProvider>
    </AuthProvider>
  );
};
