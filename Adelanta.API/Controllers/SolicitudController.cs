using Adelanta.Data.IRepository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Xml;

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
                int indice = 0;                
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

                    if (file.ContentType == "text/xml")
                    {
                        string xml = fullPath;
                        XmlDocument doc = new XmlDocument();
                        using (var sr = new StreamReader(xml))
                        {
                            doc.Load(sr);
                            string json = JsonConvert.SerializeXmlNode(doc);
                            dynamic documentoXML = JsonConvert.DeserializeObject<ExpandoObject>(json);
                            JsonFiles[indice] = documentoXML;
                            indice++;
                        }
                    }

                }
                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
