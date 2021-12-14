using Adelanta.API.Services;
using Adelanta.Core.Log;
using Adelanta.Data.IRepository;
using Adelanta.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Adelanta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudController : ControllerBase
    {
        private readonly ISolicitudRepository _solicitudRepository;
        public SolicitudController(ISolicitudRepository solicitudRepository)
        {
            _solicitudRepository = solicitudRepository;
        }
        [HttpPost("/api/Solicitud/CargaDocumentos")]
        public async Task<IActionResult> CargaDocumentos()
        {
            try
            {
                var files = Request.Form.Files;
                var folderName = Path.Combine("Documentos");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                string [] JsonFiles = new string[files.Count];                
                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var path = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');      
                    var fullPath = Path.Combine(pathToSave, Path.GetFileName(path));
                    var dbPath = Path.Combine(folderName, Path.GetFileName(path));
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }                   
                }
                SolicitudBE oSolicitudBE = new SolicitudBE();
                oSolicitudBE.TipoOperacion = Request.Form["tipoOperacion"];
                oSolicitudBE.Ruc = Request.Form["ruc"];
                oSolicitudBE.RazonSocial = Request.Form["razonSocial"];
                oSolicitudBE.Moneda = Request.Form["moneda"];
                oSolicitudBE.DocumentoJson = Request.Form["detalle"];
                oSolicitudBE.Usuario = Request.Form["usuario"];                
                var resultadoInsertar = await _solicitudRepository.CrearSolicitud(oSolicitudBE);
                string[] aResultado = resultadoInsertar.Split('|');
                oSolicitudBE.IdSolicitud = Convert.ToInt32(aResultado[1]);
                Log.grabarLog("Inicio");
                var response = await CavaliAPI.addInvoiceXML(aResultado[0]).ConfigureAwait(false);
                Log.grabarLog("Fin");
                var resultadoActualizar = await _solicitudRepository.UpdateSolicitud(oSolicitudBE.IdSolicitud, response);
                return Ok(JsonSerializer.Deserialize<dynamic>(resultadoActualizar));
            }
            catch (Exception ex)
            {
                Log.grabarLog(ex);
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpGet("/api/Solicitud/ListarSolicitudes")]
        public async Task<IActionResult> ListarSolicitudes()
        {
            var resultado = await _solicitudRepository.ListarSolicitudes();
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
    }
}
