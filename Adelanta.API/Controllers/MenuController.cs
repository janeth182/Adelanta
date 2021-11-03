using Adelanta.Data.IRepository;
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
    public class MenuController : ControllerBase
    {
        private readonly IMenuRepository _menuRepository;
        public MenuController(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        [HttpGet]
        public async Task<IActionResult> ListarMenu()
        {
            return Ok(await _menuRepository.ListarMenu());
        }
        [HttpGet("/api/Menu/ObtenerMenuPorSesion/{gSesion}")]
        public async Task<IActionResult> ObtenerMenuPorSesion(string gSesion)
        {
            return Ok(await _menuRepository.ObtenerMenuPorSesion(gSesion));
        }
    }
}
