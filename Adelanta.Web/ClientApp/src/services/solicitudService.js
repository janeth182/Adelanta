import { formColeccion, api } from "../model/api";

export const cargarDocumentos = async (formData) => {
  return await formColeccion.post(`Solicitud/CargaDocumentos`, formData);
};
export const listarSolicitudes = async () => {
  return await api.get(`Solicitud/ListarSolicitudes`);
};
export const obtenerSolicitudDetalle = async (idSolicitud) => {
  return await api.get(`Solicitud/ObtenerSolicitudDetalle/${idSolicitud}`);
};
export const obtenerSolicitudDetalleLiquidacion = async (nroLiquidacion) => {
  return await api.get(`Solicitud/ObtenerSolicitudDetalleLiquidacion/${nroLiquidacion}`);
};
export const crearSolicitudCapitalTrabajo = async (formData) => {
  return await formColeccion.post(`Solicitud/CrearSolicitudCapitalTrabajo`, formData);
};