using Adelanta.Model;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface ISolicitudRepository
    {
        Task<int> CrearSolicitud(SolicitudBE oSolicitudBE);
    }
}
