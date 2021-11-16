using Adelanta.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuBE>> ListarMenu();
        Task<IEnumerable<MenuBE>> ObtenerMenuPorSesion(string gSesion);
    }
}
