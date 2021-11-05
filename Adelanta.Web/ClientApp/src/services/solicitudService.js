import { fileUpload } from "../model/api";

export const listarUsuarios = async (formData) => {
	return await fileUpload.post(`Solicitud/CargaDocumentos`, formData);
};