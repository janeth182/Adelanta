using Adelanta.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface ISolicitudRepository
    {
        Task<string> CrearSolicitud(SolicitudBE oSolicitudBE);
        Task<string> ListarSolicitudes();
    }
}
