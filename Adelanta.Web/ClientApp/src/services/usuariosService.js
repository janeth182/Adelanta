import { api } from "../model/api";

export const listarUsuariosService = async () => {
	return await api.get(`Usuario`);
};
export const actualizarUsuario = async () => {
	return await api.put(`Usuario`);
};
export const crearUsuario = async (data) => {
	return await api.post(`Usuario`, data);
};