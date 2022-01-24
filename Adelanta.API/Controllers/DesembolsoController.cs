using Adelanta.Data.IRepository;
using Adelanta.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Adelanta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesembolsoController : ControllerBase
    {
        private readonly IDesembolsoRepository _desembolsoRepository;
        public DesembolsoController(IDesembolsoRepository documentoRepository)
        {
            _desembolsoRepository = documentoRepository;
        }
        [HttpPost("/api/Desembolso/CrearDesembolso")]
        public async Task<IActionResult> CrearDesembolso([FromBody] DesembolsoBE oDesembolsoBE)
        {
            try
            {
                if (oDesembolsoBE == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var creado = await _desembolsoRepository.CrearDesembolso(oDesembolsoBE);
                return Created("creado", creado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
