import { api, fileUpload } from "../model/api";

export const listarDocumentos = async (id) => {
  return await api.get(`Documento/ListarDocumentos/${id}`);
};
export const listarDocumentosFactrack = async (id) => {
  return await api.get(`Documento/ListarDocumentosFactrack/${id}`);
};
export const documentosActualizar = async (data) => {
  return await fileUpload.post(`Documento/Actualizar`, data);
};
export const documentosActualizarEstado = async (data) => {
  return await fileUpload.post(`Documento/ActualizarEstado`, data);
};
export const documentosConfirmarFactrack = async (data) => {
  return await fileUpload.post(`Documento/confirmarFactrack`, data);
};
export const documentoSolicitarAprobacion = async (data) => {
  return await fileUpload.post(`Documento/DocumentoSolicitarAprobacion`, data);
};