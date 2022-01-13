using Adelanta.Model;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface ISolicitudRepository
    {
        Task<string> CrearSolicitud(SolicitudBE oSolicitudBE);
        Task<string> UpdateSolicitud(int? IdSolicitud, string Json);
        Task<string> ListarSolicitudes();
        Task<string> ObtenerSolicitudDetalle(int IdSolicitud);
        Task<string> ObtenerSolicitudDetalleLiquidacion(string nroLiquidacion);
        Task<string> CrearSolicitudCapitalTrabajo(string Json);
    }
}
