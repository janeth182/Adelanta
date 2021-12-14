using Adelanta.API.Services.Entities;
using Adelanta.API.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Adelanta.API.Services
{
    public class OAuth2Client
    {
		public static async Task<Token> GetTokenAsync(string authenticationUrl, Dictionary<string, string> authenticationCredentials)
        {
            HttpClient client = new HttpClient();

            FormUrlEncodedContent content = new FormUrlEncodedContent(authenticationCredentials);

            using (HttpResponseMessage response = await client.PostAsync(authenticationUrl, content))
            {
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    string message = String.Format("POST failed. Received HTTP {0}", response.StatusCode);
                    throw new ApplicationException(message);
                }

                string responseString = await response.Content.ReadAsStringAsync();

                Token token = JsonConvert.DeserializeObject<Token>(responseString);

                return token;
            }
        }

    }
}
