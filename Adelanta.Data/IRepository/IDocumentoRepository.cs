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
        Task<string> ListarDocumentosFiltros(string Json);
        Task<string> EnviarCavali(string Json);
        Task<bool> DocumentosActualizarEnvioCavali(string DocumentoJson, string RespuestaCavaliJson);
        Task<bool> DocumentosActualizarEnvioConformidadCavali(string DocumentoJson, string RespuestaCavaliJson);
        Task<string> ListarDocumentosDesembolso(string Usuario);
        Task<string> EnviarConformidadCavali(string Json);
        Task<string> EnviarAnotacionCuenta(string Json);
        Task<bool> DocumentosActualizarAnotacionCuenta(string DocumentoJson, string RespuestaCavaliJson);
    }
}
