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
    public class UsuarioRepository: IUsuarioRepository
    {
        private MySQLConfiguration _connectionString;
        public UsuarioRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }

        public async Task<IEnumerable<UsuarioBE>> ListarUsuarios()
        {
            var db = dbConnection();
            var sql = @"SELECT U.IdUsuario,U.Usuario,Nombres,ApellidoPaterno, ApellidoMaterno,Email,Documento,Telefono,Direccion,U.IdRol, R.Rol, L.IdEstado, E.Estado
                        FROM USUARIO U INNER JOIN LOGIN L ON U.IdUsuario=L.IdUsuario
                        INNER JOIN ESTADO E ON L.IdEstado=E.IdEstado 
                        INNER JOIN ROL R ON R.IdRol=U.IdRol";
            return await db.QueryAsync<UsuarioBE>(sql, new { });
        }

        public async Task<bool> AgregarUsuario(UsuarioBE oUsuarioBE)
        {
            var db = dbConnection();
            var sql = "sp_crearUsuario";
            var values = new { p_Usuario = oUsuarioBE.Usuario, p_Nombres = oUsuarioBE.Nombres, p_ApellidoPaterno = oUsuarioBE.ApellidoPaterno, p_ApellidoMaterno = oUsuarioBE.ApellidoMaterno, p_Email = oUsuarioBE.Email, p_Documento = oUsuarioBE.Documento, p_Telefono = oUsuarioBE.Telefono, p_Direccion = oUsuarioBE.Direccion, p_IdRol = oUsuarioBE.IdRol };
            var result = await db.ExecuteAsync(sql, values, commandType: CommandType.StoredProcedure);
            return result > 0;
        }

        public async Task<bool> ActualizarUsuario(UsuarioBE oUsuarioBE)
        {
            var db = dbConnection();
            var sql = @"UPDATE USUARIO 
                        SET 
                        Nombres = @Nombres, 
                        ApellidoPaterno = @ApellidoPaterno,
                        ApellidoMaterno = @ApellidoMaterno,
                        Email = @Email, 
                        Documento = @Documento, 
                        Telefono = @Telefono, 
                        Direccion = @Direccion, 
                        IdRol = IdRol
                        WHERE IdUsuario = @IdUsuario";
            var result = await db.ExecuteAsync(sql, new { oUsuarioBE.Nombres, oUsuarioBE.ApellidoPaterno, oUsuarioBE.ApellidoMaterno, oUsuarioBE.Email, oUsuarioBE.Documento, oUsuarioBE.Telefono, oUsuarioBE.Direccion, oUsuarioBE.IdRol, oUsuarioBE.IdUsuario });
            return result > 0;
        }

        public async Task<bool> EliminarUsuario(int IdUsuario)
        {
            var db = dbConnection();
            var sql = @"DELETE FROM USUARIO WHERE IdUsuario = @IdUsuario";
            var result = await db.QueryFirstOrDefaultAsync(sql, new { IdUsuario = IdUsuario });
            return result > 0;
        }

        public async Task<UsuarioBE> ObtenerUsuario(int IdUsuario)
        {
            var db = dbConnection();
            var sql = @"SELECT IdUsuario,Usuario,Nombres,ApellidoPaterno, ApellidoMaterno,Email,Documento,Telefono,Direccion,IdRol FROM USUARIO WHERE IdUsuario = @IdUsuario";
            return await db.QueryFirstOrDefaultAsync<UsuarioBE>(sql, new { IdUsuario = IdUsuario });
        }
    }
}
