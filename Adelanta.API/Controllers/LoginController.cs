using Adelanta.Data.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Adelanta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginRepository _loginRepository;
        public LoginController(ILoginRepository loginRepository)
        {
            _loginRepository = loginRepository;
        }
        [HttpGet("/api/Login/RegistrarLogin/{Usuario}/{Password}/{Ip}")]
        public async Task<IActionResult> Login([FromRoute] string Usuario, string Password, string Ip)
        {
            var resultado = await _loginRepository.Login(Usuario, Password, Ip);            
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
    }
}
