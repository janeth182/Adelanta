import { api } from "../model/api";

export const listarMenu = async () => {
	return await api.get(`Menu`);
};

export const obtenerMenuPorSesion = async (gSesion) => {
	return await api.get(`/Menu/ObtenerMenuPorSesion/${gSesion}`);
};