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
    [Route("api/[controller]/[action]")]
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

        [HttpGet("/api/Usuario/ObtenerUsuario/{IdUsuario}")]
        public async Task<IActionResult> ObtenerUsuario([FromRoute] int IdUsuario)
        {
            return Ok(await _usuarioRepository.ObtenerUsuario(IdUsuario));
        }

        [HttpGet("/api/Usuario/ObtenerUsuarioPorUserName/{Usuario}")]
        public async Task<IActionResult> ObtenerUsuarioPorUserName([FromRoute] string Usuario)
        {
            return Ok(await _usuarioRepository.ObtenerUsuarioPorUserName(Usuario));
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

            await _usuarioRepository.ActualizarUsuario(oUsuarioBE);
            return NoContent();
        }

        [HttpDelete("/api/Usuario/EliminarUsuario/{IdUsuario}")]
        public async Task<IActionResult> EliminarUsuario([FromRoute] int IdUsuario)
        {
            await _usuarioRepository.EliminarUsuario(IdUsuario);
            return NoContent();
        }
    }
}
