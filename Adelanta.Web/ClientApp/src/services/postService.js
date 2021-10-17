import { api } from "../model/api";

export const listarPostService = async () => {
	return await api.get(`posts`);
};
