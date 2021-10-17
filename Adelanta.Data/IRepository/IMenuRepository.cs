using Adelanta.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuBE>> ListarMenu();
        Task<IEnumerable<MenuBE>> ObtenerMenuPorUsuario();
    }
}
