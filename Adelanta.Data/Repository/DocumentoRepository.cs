﻿using Adelanta.Data.IRepository;
using Dapper;
using MySql.Data.MySqlClient;
using System.Data;
using System.Linq;
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
        public async Task<string> ListarDocumentosDesembolso(string Usuario)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_LISTAR_DESEMBOLSO";
            var values = new { p_Usuario = Usuario };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> ListarDocumentosConformidadFactrack(string user)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_LISTAR_CONFORMIDAD_FACTRACK";
            var values = new {};
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<bool> DocumentosActualizar(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ACTUALIZAR";
            var values = new { p_dataJSON = Json };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
        public async Task<string> EnviarCavali(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ENVIAR_CAVALI";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> EnviarConformidadCavali(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ENVIAR_CONFORMIDAD_CAVALI";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<bool> DocumentosActualizarEstado(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ACTUALIZAR_ESTADO";
            var values = new { p_dataJSON = Json };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
        public async Task<string> DocumentoConfirmarFactrack(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_CONFIRMAR_FRACTRACK";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> DocumentoSolicitarAprobacion(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_SOLICITAR_APROBACION_1";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<string> ListarDocumentosFiltros(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_LISTAR_FILTROS";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<bool> DocumentosActualizarEnvioCavali(string DocumentoJson, string RespuestaCavaliJson)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ACTUALIZAR_ENVIO_CAVALI";
            var values = new { p_DocumentoJSON = DocumentoJson, p_RespuestaCavaliJSON = RespuestaCavaliJson };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
        public async Task<bool> DocumentosActualizarEnvioConformidadCavali(string DocumentoJson, string RespuestaCavaliJson)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ACTUALIZAR_ENVIO_CONFORMIDAD_CAVALI";
            var values = new { p_RespuestaCavaliJSON = RespuestaCavaliJson, p_DocumentoJSON = DocumentoJson };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
        public async Task<string> EnviarAnotacionCuenta(string Json)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ENVIAR_ANOTACION_CUENTA";
            var values = new { p_dataJSON = Json };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }
        public async Task<bool> DocumentosActualizarAnotacionCuenta(string DocumentoJson, string RespuestaCavaliJson)
        {
            var db = dbConnection();
            var sp = "SP_DOCUMENTO_ACTUALIZAR_ANOTACION_CUENTA";
            var values = new { p_RespuestaCavaliJSON = RespuestaCavaliJson, p_DocumentoJSON = DocumentoJson };
            var result = await db.ExecuteAsync(sp, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }
    }
}
