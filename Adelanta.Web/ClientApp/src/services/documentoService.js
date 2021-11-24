import { api, fileUpload } from "../model/api";

export const listarDocumentos = async (id) => {
  return await api.get(`Documento/ListarDocumentos/${id}`);
};
export const listarDocumentosFactrack = async (id) => {
  return await api.get(`Documento/ListarDocumentosFactrack/${id}`);
};
export const documentosActualizarEstado = async (data) => {
  return await fileUpload.post(`Documento`, data);
};
