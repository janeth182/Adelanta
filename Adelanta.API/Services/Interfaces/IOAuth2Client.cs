using Adelanta.API.Services.Entities;
using System.Threading.Tasks;

namespace Adelanta.API.Services.Interfaces
{
    public interface IOAuth2Client
    {
        Task<Token> GetTokenAsync(string url, string clientId, string clientSecret);
    }
}
