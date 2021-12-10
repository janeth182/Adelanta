using Adelanta.Data.IRepository;
using Adelanta.Model;
using Dapper;
using MySql.Data.MySqlClient;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Adelanta.Data.Repository
{
    public class SolicitudRepository : ISolicitudRepository
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
        public async Task<string> CrearSolicitud(SolicitudBE oSolicitudBE)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_INSERTAR";
            var values = new { p_tipoOperacion = oSolicitudBE.TipoOperacion, p_ruc = oSolicitudBE.Ruc, p_razonSocial= oSolicitudBE.RazonSocial, p_moneda = oSolicitudBE.Moneda, p_usuario = oSolicitudBE.Usuario, p_DocumentoJSON = oSolicitudBE.DocumentoJson };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> ListarSolicitudes()
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_LISTAR";
            var values = new { };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
    }
}
