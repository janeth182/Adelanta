using Adelanta.Data.IRepository;
using Adelanta.Model;
using Dapper;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.Repository
{
    public class ClienteRepository: IClienteRepository
    {
        private MySQLConfiguration _connectionString;
        public ClienteRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }

        public async Task<string> BuscarClienteRuc(string RUC)
        {
            var db = dbConnection();
            var sp = "SP_CLIENTE_BUSCAR_RUC";
            var values = new { p_ruc = RUC };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> ListarClientes(string usuario)
        {
            var db = dbConnection();
            var sp = "SP_CLIENTE_LISTAR";
            var values = new { p_usuario = usuario };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> ObtenerClientePorIdCliente(int idCliente)
        {
            var db = dbConnection();
            var sp = "SP_CLIENTE_LISTAR_X_IDCLIENTE";
            var values = new { p_idCliente = idCliente };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }

        public async Task<bool> EliminarCliente(int idCliente)
        {
            var db = dbConnection();
            var sp = "SP_CLIENTE_ELIMINAR";
            var values = new { p_IdCliente = idCliente };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
        public async Task<bool> MantenimientoCliente(ClienteBE oClienteBE)
        {
            var db = dbConnection();
            var sp = "SP_CLIENTE_MANTENIMIENTO";
            var values = new { p_IdCliente = oClienteBE.IdCliente, 
                p_RazonSocial = oClienteBE.RazonSocial, 
                p_RUC = oClienteBE.RUC, 
                p_DireccionOficina = oClienteBE.DireccionOficina,
                p_DireccionFacturacion = oClienteBE.DireccionFacturacion,
                p_NombreContacto = oClienteBE.NombreContacto,
                p_TelefonoContacto = oClienteBE.TelefonoContacto,
                p_EmailContacto = oClienteBE.EmailContacto,
                p_TasaNominalMensual = oClienteBE.TasaNominalMensual,
                p_TasaNominalAnual = oClienteBE.TasaNominalAnual,
                p_EjecutivoComercial = oClienteBE.EjecutivoComercial,
                p_TipoOperacion = oClienteBE.TipoOperacion,
                p_Financiamiento = oClienteBE.Financiamiento,
                p_ComisionEstructuracion = oClienteBE.ComisionEstructuracion,
                p_GastosContrato = oClienteBE.GastosContrato,
                p_ComisionCartaNotarial = oClienteBE.ComisionCartaNotarial,
                p_ServicioCobranza = oClienteBE.ServicioCobranza,
                p_ServicioCustodia = oClienteBE.ServicioCustodia,
                p_Estado = oClienteBE.Estado,
                p_Usuario = oClienteBE.Usuario
            };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
    }
}
