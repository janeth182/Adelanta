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
    public class MenuRepository: IMenuRepository
    {
        private MySQLConfiguration _connectionString;
        public MenuRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }
        public async Task<IEnumerable<MenuBE>> ListarMenu()
        {
            var db = dbConnection();
            var sql = @"SELECT IdMenu,IdMenuPadre, Menu, Descripcion, Css, RutaPagina FROM MENU";
            return await db.QueryAsync<MenuBE>(sql, new { });
        }

        public Task<IEnumerable<MenuBE>> ObtenerMenuPorUsuario()
        {
            throw new NotImplementedException();
        }
    }
}
