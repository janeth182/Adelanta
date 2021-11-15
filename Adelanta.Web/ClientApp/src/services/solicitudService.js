import { fileUpload } from "../model/api";

export const cargarDocumentos = async (formData) => {
	return await fileUpload.post(`Solicitud/CargaDocumentos`, formData);
};