using Adelanta.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface IClienteRepository
    {
        Task<string> BuscarClienteRuc(string RUC);
        Task<string> ObtenerClientePorIdCliente(int idCliente);
        Task<bool> EliminarCliente(int idCliente);
        Task<bool> MantenimientoCliente(ClienteBE oClienteBE);
        Task<string> ListarClientes(string usuario);
    }
}
