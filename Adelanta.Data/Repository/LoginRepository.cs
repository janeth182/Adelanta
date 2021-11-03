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
    public class LoginRepository: ILoginRepository
    {
        private MySQLConfiguration _connectionString;
        public LoginRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }
        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnectionString);
        }
        public async Task<string> Login(string Usuario, string Password, string Ip)
        {
            var db = dbConnection();
            var sp = "SP_LOGIN";
            var values = new { p_Usuario = Usuario, p_Password = Password, p_Ip = Ip };
            var result = await db.QueryAsync<string>(sp, values, commandType: CommandType.StoredProcedure);
            return result.ToList()[0];
        }


    }
}
