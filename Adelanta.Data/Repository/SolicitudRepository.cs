using Adelanta.Data.IRepository;
using Adelanta.Model;
using Dapper;
using MySql.Data.MySqlClient;
using System.Data;
using System.Threading.Tasks;

namespace Adelanta.Data.Repository
{
    public class SolicitudRepository: ISolicitudRepository
    {
        private MySQLConfiguration _connectionString;
        public SolicitudRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }
        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }
        public async Task<int> CrearSolicitud(SolicitudBE oSolicitudBE)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_INSERTAR";
            var values = new { p_TipoOperacion = oSolicitudBE.TipoOperacion, p_ruc = oSolicitudBE.Ruc, p_moneda = oSolicitudBE.Moneda };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}
