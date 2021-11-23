using Adelanta.Data.IRepository;
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
    public class DocumentoRepository: IDocumentoRepository
    {
        private MySQLConfiguration _connectionString;
        public DocumentoRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }
        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }
        public async Task<string> ListarDocumentos(int IdEstado)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_LISTAR";
            var values = new { p_idEstado = IdEstado };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<bool> DocumentosActualizarEstado(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ACTUALIZAR";
            var values = new { p_dataJSON = Json };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
    }
}
