using Adelanta.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<UsuarioBE>> ListarUsuarios();
        Task<UsuarioBE> ObtenerUsuario(int IdUsuario);
        Task<bool> AgregarUsuario(UsuarioBE oUsuarioBE);
        Task<bool> ActualizarUsuario(UsuarioBE oUsuarioBE);
        Task<bool> EliminarUsuario(int IdUsuario);
    }
}
