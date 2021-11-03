using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface ILoginRepository
    {
        Task<string> Login(string Usuario, string Password, string Ip);
    }
}
