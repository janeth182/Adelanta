import { api } from "../model/api";

export const listarUsuarios = async () => {
	return await api.get(`Usuario/ListarUsuarios`);
};
export const actualizarUsuario = async (data) => {
	return await api.put(`Usuario/ActualizarUsuario`, data);
};
export const crearUsuario = async (data) => {
	return await api.post(`Usuario/AgregarUsuario`, data);
};
export const eliminarUsuario = async (idUsuario) => {
	return await api.delete(`Usuario​/EliminarUsuario`, idUsuario);
};
export const obtenerUsuario = async (id) => {
	return await api.get(`Usuario/ObtenerUsuario/${id}`);
};
export const ObtenerUsuarioPorUserName = async (userName) => {
	return await api.get(`Usuario/ObtenerUsuarioPorUserName/${userName}`);
};