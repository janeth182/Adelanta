using Adelanta.API.Services.Entities;
using Adelanta.Core.Log;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Adelanta.API.Services
{
    public class CavaliAPI
    {
        public static async Task<string> addInvoice(string trama)
        {
            var client = new HttpClient();
            Token authorization = await OAuth2Client.GetTokenAsync(client).ConfigureAwait(false);
            Log.grabarLog("ResultadoToken" + authorization.AccessToken.ToString());
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authorization.AccessToken);
            client.DefaultRequestHeaders.Add("x-api-key", "ZHTPyt9lRe6XCmqvDdrsMkzB77JrOtRlspXyJ100");

            HttpContent httpContent = new StringContent(trama, Encoding.UTF8);
            httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var content = new StringContent(trama, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(new Uri("https://api.qae.cavali.com.pe/factrack/v2/add-invoice-xml"), content);
            if (response.IsSuccessStatusCode)
            {
                Log.grabarLog("ResultadoOK" + response.ToString());
                return await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            }
            else
            {
                Log.grabarLog("ResultadoERROR");
                return string.Empty;
            }
        }
        //public static async Task<Token> GeToken()
        //{
        //    try
        //    {
        //        IConfigurationBuilder builder = new ConfigurationBuilder();
        //        Log.grabarLog("InicioToken");
        //        builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        //        var root = builder.Build();
        //        Dictionary<string, string> authenticationCredentials = root.GetSection("Authentication:Credentials").GetChildren().Select(x => new KeyValuePair<string, string>(x.Key, x.Value)).ToDictionary(x => x.Key, x => x.Value);
        //        Log.grabarLog("FormaJSON");
        //        Token token = await OAuth2Client.GetTokenAsync(root.GetSection("Authentication:URL").Value, authenticationCredentials).ConfigureAwait(false);
        //        Log.grabarLog("finalizaToken: " + token.ToString());
        //        return token;
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.grabarLog(ex);
        //        throw;
        //    }
        //}
        public static async Task<string> addInvoiceXML(string trama)
        {
            var jsonSerializerOptions = new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            using (var httpClient = new HttpClient())
            {               
                Dictionary<string, string> authenticationCredentials = root.GetSection("Authentication:Credentials").GetChildren().Select(x => new KeyValuePair<string, string>(x.Key, x.Value)).ToDictionary(x => x.Key, x => x.Value);
                Log.grabarLog("Llamando Token");
                FormUrlEncodedContent content = new FormUrlEncodedContent(authenticationCredentials);
                var httpRespuestaToken = await httpClient.PostAsync(root.GetSection("Authentication:URL").Value, content);
                Log.grabarLog("Termino Llamando Token");
                var respuestaToken = JsonConvert.DeserializeObject<Token>(await httpRespuestaToken.Content.ReadAsStringAsync());
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", respuestaToken.AccessToken);
                httpClient.DefaultRequestHeaders.Add("x-api-key", "ZHTPyt9lRe6XCmqvDdrsMkzB77JrOtRlspXyJ100");
                Log.grabarLog("Inicio invoce Token");
                var contentBody = new StringContent(trama, Encoding.UTF8, "application/json");
                var respuesta = await httpClient.PostAsync("https://api.qae.cavali.com.pe/factrack/v2/add-invoice-xml", contentBody);
                Log.grabarLog("Fin");
                if (respuesta.IsSuccessStatusCode)
                {
                    Log.grabarLog("ResultadoOK" + respuesta.ToString());
                    return await respuesta.Content.ReadAsStringAsync().ConfigureAwait(false);
                }
                else
                {
                    Log.grabarLog("ResultadoERROR");
                    return string.Empty;
                }
            }            
        }
    }
}
