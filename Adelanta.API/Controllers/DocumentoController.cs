
using Adelanta.API.Services;
using Adelanta.API.Util;
using Adelanta.Core.Log;
using Adelanta.Data.IRepository;
using Adelanta.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using JsonSerializer = System.Text.Json.JsonSerializer;

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
            if (resultado == null)
                return Ok(string.Empty);
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
        [HttpPost("/api/Documento/ListarDocumentosFiltros")]
        public async Task<IActionResult> ListarDocumentosFiltros()
        {
            string Json = Request.Form["json"];
            var resultado = await _documentoRepository.ListarDocumentosFiltros(Json);
            if (resultado == null)
                return Ok(string.Empty);
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
        [HttpGet("/api/Documento/ListarDocumentosFactrack/{usuario}")]
        public async Task<IActionResult> ListarDocumentos([FromRoute] string usuario)
        {
            var resultado = await _documentoRepository.ListarDocumentosConformidadFactrack(usuario);
            if (resultado == null)
                return Ok(string.Empty);
            return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
        }
        [HttpPost("/api/Documento/ActualizarEstado")]
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
        [HttpPost("/api/Documento/Actualizar")]
        public async Task<IActionResult> DocumentosActualizar()
        {
            try
            {
                string Json = Request.Form["json"];
                if (Json == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _documentoRepository.DocumentosActualizar(Json);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpPost("/api/Documento/ConfirmarFactrack")]
        public async Task<IActionResult> ConfirmarFactrack()
        {
            try
            {
                string Json = Request.Form["json"];
                if (Json == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _documentoRepository.DocumentoConfirmarFactrack(Json);
                MensajeBE oMensajeBE = JsonSerializer.Deserialize<MensajeBE>(result);
                oMensajeBE.De = "vjanethh@gmail.com";
                oMensajeBE.CopiaOculta = "Josecmunozs@gmail.com;vjanethh@gmail.com";
                oMensajeBE.EsHTML = true;
                using (Adelanta.Core.EnvioCorreo smtp = new Adelanta.Core.EnvioCorreo())
                {
                    await smtp.SendAsync(oMensajeBE);
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                Log.grabarLog(ex);
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpPost("/api/Documento/DocumentoSolicitarAprobacion")]
        public async Task<IActionResult> DocumentoSolicitarAprobacion()
        {
            try
            {
                string Json = Request.Form["json"];
                if (Json == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _documentoRepository.DocumentoSolicitarAprobacion(Json);                
                var sbClientes = result.Split('|')[0];
                var sbDetalle = result.Split('|')[1];
                var sbCorreo = result.Split('|')[2];

                List<SolicitudBE> lSolicitudBE = JsonSerializer.Deserialize<List<SolicitudBE>>(sbClientes);
                List<DocumentoBE> lDocumentoBE = JsonSerializer.Deserialize<List<DocumentoBE>>(sbDetalle);
                List<MensajeBE> lMensajeBE = JsonSerializer.Deserialize<List<MensajeBE>>(sbCorreo);
                foreach (var oSolicitudBE in lSolicitudBE)
                {
                    string RutaArchivo = string.Empty;
                    if (oSolicitudBE.TipoOperacion == "C")
                    {
                       RutaArchivo = ExcelSolicitarAprobacion.ExportarDocumentosLiquidadosConfirming(oSolicitudBE, lDocumentoBE);
                    }
                    else
                    {
                       RutaArchivo = ExcelSolicitarAprobacion.ExportarDocumentosLiquidadorFactoring(oSolicitudBE, lDocumentoBE);
                    }

                    foreach (var oMensajeBE in lMensajeBE)
                    {
                        if (oSolicitudBE.IdSolicitud == oMensajeBE.IdSolicitud)
                        {
                            string[] arAdjuntos = new string[1];
                            bool hayArchivos = false;
                            oMensajeBE.De = "vjanethh@gmail.com";
                            oMensajeBE.CopiaOculta = "Josecmunozs@gmail.com;vjanethh@gmail.com";
                            oMensajeBE.EsHTML = true;
                            if (System.IO.File.Exists(RutaArchivo))
                            {
                                arAdjuntos[0] = RutaArchivo;
                                hayArchivos = true;
                            }
                            if (hayArchivos)
                            {
                                oMensajeBE.Archivos = arAdjuntos;
                            }
                            using (Adelanta.Core.EnvioCorreo smtp = new Adelanta.Core.EnvioCorreo())
                            {
                                await smtp.SendAsync(oMensajeBE);
                            }
                        }                       
                    }                    
                }                
                return NoContent();
            }
            catch (Exception ex)
            {
                Log.grabarLog(ex);
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost("/api/Documento/DocumentosEnviarCAVALI")]
        public async Task<IActionResult> DocumentosEnviarCAVALI()
        {
            try
            {
                string Json = Request.Form["json"];
                if (Json == null)
                    return BadRequest();
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var resultadoJsonEnviarCavali = await _documentoRepository.EnviarCavali(Json);
                var response = await CavaliAPI.addInvoiceXML(resultadoJsonEnviarCavali).ConfigureAwait(false);
                var resultado = await _documentoRepository.DocumentosActualizarEnvioCavali(Json, response);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpPost("/api/Documento/ListarDocumentosDesembolso")]
        public async Task<IActionResult> ListarDocumentosDesembolso()
        {
            try
            {
                string Usuario = Request.Form["usuario"];
                var resultado = await _documentoRepository.ListarDocumentosDesembolso(Usuario);
                if (resultado == null)
                    return Ok(string.Empty);
                return Ok(JsonSerializer.Deserialize<dynamic>(resultado));
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }            
        }
    }
}
