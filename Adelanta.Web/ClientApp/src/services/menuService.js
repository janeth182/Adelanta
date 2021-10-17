import { api } from "../model/api";

export const listarMenu = async () => {
	return await api.get(`Menu`);
};
