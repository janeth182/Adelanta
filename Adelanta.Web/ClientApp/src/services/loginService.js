import { api } from "../model/api";

export const login = async (Usuario, Password, Ip) => {
	return await api.get(`/Login/RegistrarLogin/${Usuario}/${Password}/${Ip}`);
};