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
    public class ClienteController : ControllerBase
    {
        private readonly IClienteRepository _clienteRepository;
        public ClienteController(IClienteRepository documentoRepository)
        {
            _clienteRepository = documentoRepository;
        }
        [HttpGet("/api/Cliente/BuscarClienteRUC/{RUC}")]
        public async Task<IActionResult> BuscarClienteRUC([FromRoute] string RUC)
        {
            var resultado = await _clienteRepository.BuscarClienteRuc(RUC);
            if (resultado == null)
                return Ok(string.Empty);
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
    }
}
