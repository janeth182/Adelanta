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
    public class DesembolsoRepository: IDesembolsoRepository
    {
        private MySQLConfiguration _connectionString;
        public DesembolsoRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }
        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }
        public async Task<string> CrearDesembolso(DesembolsoBE oDesembolsoBE)
        {
            var db = dbConnection();
            var sp = "SP_DESEMBOLSO_INSERTAR";
            var values = new
            {
                p_IdDesembolso = oDesembolsoBE.IdDesembolso,
                p_NroLiquidacion = oDesembolsoBE.NroLiquidacion,
                p_IdCuenta = oDesembolsoBE.IdCuenta,
                p_IdCuentaCliente = oDesembolsoBE.IdCuentaCliente,
                p_Usuario = oDesembolsoBE.UsuarioCreado
            };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
    }
}
