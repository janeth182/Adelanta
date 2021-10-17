import { api } from "../model/api";

export const listarUsuariosService = async () => {
	return await api.get(`Usuario`);
};
