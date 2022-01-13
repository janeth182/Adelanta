import { api, formColeccion } from "../model/api";

export const listarDocumentos = async (id) => {
  return await api.get(`Documento/ListarDocumentos/${id}`);
};
export const listarDocumentosFactrack = async (id) => {
  return await api.get(`Documento/ListarDocumentosFactrack/${id}`);
};
export const documentosActualizar = async (data) => {
  return await formColeccion.post(`Documento/Actualizar`, data);
};
export const documentosEnviarCavali = async (data) => {
  return await formColeccion.post(`Documento/DocumentosEnviarCAVALI`, data);
};
export const documentosActualizarEstado = async (data) => {
  return await formColeccion.post(`Documento/ActualizarEstado`, data);
};
export const documentosConfirmarFactrack = async (data) => {
  return await formColeccion.post(`Documento/confirmarFactrack`, data);
};
export const documentoSolicitarAprobacion = async (data) => {
  return await formColeccion.post(`Documento/DocumentoSolicitarAprobacion`, data);
};
export const listarDocumentosFiltros = async (data) => {
  return await formColeccion.post(`Documento/ListarDocumentosFiltros`, data);
};