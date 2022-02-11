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
            var values = new { p_tipoOperacion = oSolicitudBE.TipoOperacion,
                p_cedente = oSolicitudBE.Cedente,
                p_aceptante = oSolicitudBE.Aceptante,
                p_rucAceptante = oSolicitudBE.RucAceptante,
                p_rucCedente = oSolicitudBE.RucCedente, 
                p_moneda = oSolicitudBE.Moneda, p_usuario = oSolicitudBE.Usuario, p_DocumentoJSON = oSolicitudBE.DocumentoJson };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> UpdateSolicitud(int? IdSolicitud, string Json)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_UPDATE";
            var values = new { p_IdSolicitud = IdSolicitud, p_DocumentoJSON = Json };
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
        public async Task<string> ObtenerSolicitudDetalle(int IdSolicitud)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_DETALLE_X_IDSOLICITUD";
            var values = new { p_IdSolicitud = IdSolicitud };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> ObtenerSolicitudDetalleLiquidacion(string nroLiquidacion)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_DETALLE_X_LIQUIDACION";
            var values = new { p_NroLiquidacion = nroLiquidacion };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> CrearSolicitudCapitalTrabajo(string Json)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_INSERTAR_CAPITAL_TRABAJO";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<bool> EliminarSolicitud(int IdSolicitud)
        {
            var db = dbConnection();
            var sp = "SP_SOLICITUD_ELIMINAR";
            var values = new { p_IdSolicitud = IdSolicitud };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
    }
}
