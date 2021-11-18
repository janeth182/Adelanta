using Adelanta.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<UsuarioBE>> ListarUsuarios();
        Task<UsuarioBE> ObtenerUsuario(int IdUsuario);
        Task<UsuarioBE> ObtenerUsuarioPorUserName(string Usuario);
        Task<bool> AgregarUsuario(UsuarioBE oUsuarioBE);
        Task<bool> ActualizarUsuario(UsuarioBE oUsuarioBE);
        Task<bool> EliminarUsuario(int IdUsuario);
    }
}
