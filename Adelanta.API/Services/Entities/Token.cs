using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Adelanta.API.Services.Entities
{
    public class Token
    {
		//[JsonPropertyName("access_token")]
		//public string AccessToken { get; set; }

		//[JsonPropertyName("expires_in")]
		//public int ExpiresIn { get; set; }

		//[JsonPropertyName("token_type")]
		//public string TokenType { get; set; }

		//[JsonPropertyName("scope")]
		//public string Scope { get; set; }
		public Token()
		{
			Issued = DateTime.Now;
		}

		[JsonProperty("access_token")]
		public string AccessToken { get; set; }

		[JsonProperty("token_type")]
		public string TokenType { get; set; }

		[JsonProperty("expires_in")]
		public int ExpiresIn { get; set; }

		[JsonProperty("refresh_token")]
		public string RefreshToken { get; set; }

		[JsonProperty("as:client_id")]
		public string ClientId { get; set; }

		[JsonProperty("userName")]
		public string UserName { get; set; }

		[JsonProperty("as:region")]
		public string Region { get; set; }

		[JsonProperty(".issued")]
		public DateTime Issued { get; set; }

		[JsonProperty(".expires")]
		public DateTime Expires
		{
			get { return Issued.AddMilliseconds(ExpiresIn); }
		}

		[JsonProperty("bearer")]
		public string Bearer { get; set; }
	}
}
