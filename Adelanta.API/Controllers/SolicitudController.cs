using Adelanta.Data.IRepository;
using Adelanta.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Xml;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Adelanta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SolicitudController : ControllerBase
    {
        private readonly ISolicitudRepository _solicitudRepository;
        public SolicitudController(ISolicitudRepository loginRepository)
        {
            _solicitudRepository = loginRepository;
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
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
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
                var resultado = await _solicitudRepository.CrearSolicitud(oSolicitudBE);                
                return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
            }
            catch (Exception ex)
            {
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
