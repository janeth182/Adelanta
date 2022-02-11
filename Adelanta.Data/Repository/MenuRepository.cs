using Adelanta.Data.IRepository;
using Adelanta.Model;
using Dapper;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
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

        public async Task<IEnumerable<MenuBE>> ObtenerMenuPorSesion(string gSesion)
        {
            var db = dbConnection();
            var sql = @"SELECT m.IdMenu,m.IdMenuPadre, m.Menu, m.Descripcion, m.Css, m.RutaPagina 
                        FROM MENU m JOIN MENU_ROL mr
                        ON m.IdMenu=mr.IdMenu JOIN USUARIO u
                        ON u.IdRol=mr.IdRol JOIN SESION s
                        ON u.IdUsuario=s.IdUsuario
                        WHERE GSesion=@gSesion AND m.Estado=1
                        ORDER BY m.IdMenu";
            return await db.QueryAsync<MenuBE>(sql, new { gSesion });
        }
    }
}
