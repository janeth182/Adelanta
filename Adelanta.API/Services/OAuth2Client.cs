using Adelanta.API.Services.Entities;
using Adelanta.API.Services.Interfaces;
using Adelanta.Core.Log;
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
		public static async Task<Token> GetTokenAsync(HttpClient client)
		{
            try
            {
				IConfigurationBuilder builder = new ConfigurationBuilder();
				builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
				var root = builder.Build();
				Dictionary<string, string> authenticationCredentials = root.GetSection("Authentication:Credentials").GetChildren().Select(x => new KeyValuePair<string, string>(x.Key, x.Value)).ToDictionary(x => x.Key, x => x.Value);
				FormUrlEncodedContent content = new FormUrlEncodedContent(authenticationCredentials);
				Log.grabarLog("EntroGetTokenAsync: ");
				Log.grabarLog("authenticationUrl: " + root.GetSection("Authentication:URL").Value);
				Log.grabarLog("content: " + content.ToString());
				HttpResponseMessage response = await client.PostAsync(root.GetSection("Authentication:URL").Value, content).ConfigureAwait(false);
				Log.grabarLog("response" + response.StatusCode.ToString());
				if (response.StatusCode != System.Net.HttpStatusCode.OK)
				{
					string message = String.Format("POST failed. Received HTTP {0}", response.StatusCode);
					Log.grabarLog("EntroGetTokenAsyncExcep");
					throw new ApplicationException(message);
				}
				Log.grabarLog("SalioThrowoGetTokenAsync: ");
				string responseString = await response.Content.ReadAsStringAsync();

				Token token = JsonConvert.DeserializeObject<Token>(responseString);

				return token;
			}
            catch (Exception ex)
            {
				Log.grabarLog(ex);
				throw;
            }			
		}	
	}
}
