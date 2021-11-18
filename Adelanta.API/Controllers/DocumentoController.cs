using Adelanta.Data.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Adelanta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoController : ControllerBase
    {
        private readonly IDocumentoRepository _documentoRepository;
        public DocumentoController(IDocumentoRepository documentoRepository)
        {
            _documentoRepository = documentoRepository;
        }

        [HttpGet("/api/Documento/ListarDocumentos")]
        public async Task<IActionResult> ListarDocumentos()
        {
            var resultado = await _documentoRepository.ListarDocumentos();
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
    }
}
