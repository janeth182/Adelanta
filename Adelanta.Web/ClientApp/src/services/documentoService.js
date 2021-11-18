import { api } from "../model/api";

export const listarDocumentos = async () => {
  return await api.get(`Documento/ListarDocumentos`);
};
