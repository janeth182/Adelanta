import { api } from "../model/api";

export const buscarClienteRUC = async (RUC) => {
    return await api.get(`/Cliente/BuscarClienteRUC/${RUC}`);
};