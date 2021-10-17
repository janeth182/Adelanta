using Adelanta.Data.IRepository;
using Adelanta.Model;
using Dapper;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
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
            var sql = @"SELECT IdUsuario,Usuario,Nombres,ApellidoPaterno, ApellidoMaterno,Email,Documento,Telefono,Direccion,IdRol FROM USUARIO";
            return await db.QueryAsync<UsuarioBE>(sql, new { });
        }

        public async Task<bool> AgregarUsuario(UsuarioBE oUsuarioBE)
        {
            var db = dbConnection();
            var sql = @"INSERT INTO USUARIO (Usuario, Nombres, ApellidoPaterno, ApellidoMaterno, Email, Documento, Telefono, Direccion, IdRol) 
                        VALUES(@Usuario, @Nombres, @ApellidoPaterno, @ApellidoMaterno, @Email, @Documento, @Telefono, @Direccion, @IdRol)";
            var result = await db.ExecuteAsync(sql, new { oUsuarioBE.Usuario, oUsuarioBE.Nombres, oUsuarioBE.ApellidoPaterno, oUsuarioBE.ApellidoMaterno, oUsuarioBE.Email, oUsuarioBE.Documento, oUsuarioBE.Telefono, oUsuarioBE.Direccion, oUsuarioBE.IdRol });
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
