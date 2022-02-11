import { api } from "../model/api";

export const buscarClienteRUC = async (RUC) => {
    return await api.get(`/Cliente/BuscarClienteRUC/${RUC}`);
};

export const obtenerClientePorIdCliente = async (IdCliente) => {
    return await api.get(`/Cliente/ObtenerClientePorIdCliente/${IdCliente}`);
};

export const listarClientes = async (Usuario) => {
    return await api.get(`/Cliente/ListarClientes/${Usuario}`);
};

export const mantenimientoCliente = async (data) => {
    return await api.post(`/Cliente/MantenimientoCliente`, data);
};

export const eliminarCliente = async (IdCliente) => {
    return await api.get(`/Cliente/eliminarCliente/${IdCliente}`);
};