using Adelanta.Data.IRepository;
using Adelanta.Model;
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
            try
            {
                var resultado = await _clienteRepository.BuscarClienteRuc(RUC);
                if (resultado == null)
                    return Ok(string.Empty);
                return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }         
        }
        [HttpGet("/api/Cliente/ObtenerClientePorIdCliente/{IdCliente}")]
        public async Task<IActionResult> ObtenerClientePorIdCliente([FromRoute] int IdCliente)
        {
            try
            {
                var resultado = await _clienteRepository.ObtenerClientePorIdCliente(IdCliente);
                if (resultado == null)
                    return Ok(string.Empty);
                return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpGet("/api/Cliente/ListarClientes/{Usuario}")]
        public async Task<IActionResult> ListarClientes([FromRoute] string Usuario)
        {
            try
            {
                var resultado = await _clienteRepository.ListarClientes(Usuario);
                if (resultado == null)
                    return Ok(string.Empty);
                return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost("/api/Cliente/MantenimientoCliente")]
        public async Task<IActionResult> MantenimientoCliente([FromBody] ClienteBE oClienteBE)
        {            
            try
            {
                if (oClienteBE == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var creado = await _clienteRepository.MantenimientoCliente(oClienteBE);
                return Created("creado", creado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpDelete("/api/Cliente/EliminarCliente/{IdCliente}")]
        public async Task<IActionResult> EliminarUsuario([FromRoute] int IdCliente)
        {
            try
            {
                await _clienteRepository.EliminarCliente(IdCliente);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
      
    }
}
