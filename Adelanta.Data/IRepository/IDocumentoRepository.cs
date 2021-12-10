using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Data.IRepository
{
    public interface IDocumentoRepository
    {
        Task<string> ListarDocumentos(int IdEstado);
        Task<bool> DocumentosActualizarEstado(string Json);
        Task<bool> DocumentosActualizar(string Json);
        Task<string> ListarDocumentosConformidadFactrack(string user);
        Task<string> DocumentoConfirmarFactrack(string Json);
        Task<string> DocumentoSolicitarAprobacion(string Json);
    }
}
