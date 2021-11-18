using Adelanta.Model;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface ISolicitudRepository
    {
        Task<string> CrearSolicitud(SolicitudBE oSolicitudBE);
        Task<string> ListarSolicitudes();
    }
}
