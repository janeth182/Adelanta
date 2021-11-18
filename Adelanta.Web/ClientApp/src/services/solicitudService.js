import { fileUpload, api } from "../model/api";

export const cargarDocumentos = async (formData) => {
  return await fileUpload.post(`Solicitud/CargaDocumentos`, formData);
};

export const listarSolicitudes = async () => {
  return await api.get(`Solicitud/ListarSolicitudes`);
};
