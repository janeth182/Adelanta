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
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ListarUsuarios()
        {
            return Ok(await _usuarioRepository.ListarUsuarios());
        }

        [HttpGet("{IdUsuario}")]
        public async Task<IActionResult> ObtenerUsuario(int IdUsuario)
        {
            return Ok(await _usuarioRepository.ObtenerUsuario(IdUsuario));
        }

        [HttpPost]
        public async Task<IActionResult> AgregarUsuario([FromBody] UsuarioBE oUsuarioBE)
        {
            if (oUsuarioBE == null)
                return BadRequest();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var creado = await _usuarioRepository.AgregarUsuario(oUsuarioBE);
            return Created("creado", creado);
        }

        [HttpPut]
        public async Task<IActionResult> ActualizarUsuario([FromBody] UsuarioBE oUsuarioBE)
        {
            if (oUsuarioBE == null)
                return BadRequest();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _usuarioRepository.AgregarUsuario(oUsuarioBE);
            return NoContent();
        }

        [HttpDelete("{IdUsuario}")]
        public async Task<IActionResult> EliminarUsuario(int IdUsuario)
        {
            await _usuarioRepository.EliminarUsuario(IdUsuario);
            return NoContent();
        }
    }
}
