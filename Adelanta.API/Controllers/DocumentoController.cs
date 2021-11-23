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

        [HttpGet("/api/Documento/ListarDocumentos/{IdEstado}")]
        public async Task<IActionResult> ListarDocumentos([FromRoute]int IdEstado)
        {
            var resultado = await _documentoRepository.ListarDocumentos(IdEstado);
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }

        [HttpPost]
        public async Task<IActionResult> DocumentosActualizarEstado()
        {
            try
            {
                string Json = Request.Form["json"];
                if (Json == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _documentoRepository.DocumentosActualizarEstado(Json);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        
        }
    }
}
