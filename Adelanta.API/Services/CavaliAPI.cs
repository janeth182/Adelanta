using Adelanta.API.Services.Entities;
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
using System.Threading.Tasks;

namespace Adelanta.API.Services
{
    public class CavaliAPI
    {
        public static async Task<string> addInvoice(string trama)
        {
            string responseObj = string.Empty;

            using (var client = new HttpClient())
            {

                Token authorization = GeToken();

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authorization.AccessToken);
                client.DefaultRequestHeaders.Add("x-api-key", "ZHTPyt9lRe6XCmqvDdrsMkzB77JrOtRlspXyJ100");
                
                client.BaseAddress = new Uri("https://api.qae.cavali.com.pe/factrack/v2");

                HttpContent httpContent = new StringContent(trama, Encoding.UTF8);
                httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");                                
                var content = new StringContent(trama, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(new Uri("https://api.qae.cavali.com.pe/factrack/v2/add-invoice-xml"), content);
                if (response.IsSuccessStatusCode)
                {
                    return responseObj = await response.Content.ReadAsStringAsync();
                }                
            }
            return responseObj;
        }

        public static Token GeToken()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            Dictionary<string, string> authenticationCredentials = root.GetSection("Authentication:Credentials").GetChildren().Select(x => new KeyValuePair<string, string>(x.Key, x.Value)).ToDictionary(x => x.Key, x => x.Value);

            Token token =  OAuth2Client.GetTokenAsync(root.GetSection("Authentication:URL").Value, authenticationCredentials).Result;

            return token;
        }
    }
}
