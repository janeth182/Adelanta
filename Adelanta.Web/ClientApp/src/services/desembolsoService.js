import { api } from "../model/api";


export const crearDesembolso = async (data) => {
    return await api.post(`Desembolso/CrearDesembolso`, data);
};