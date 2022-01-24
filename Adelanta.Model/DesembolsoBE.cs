using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Model
{
    public class DesembolsoBE
    {
        public int? IdDesembolso { get; set; }
        public string NroLiquidacion { get; set; }
        public int? IdCuenta { get; set; }
        public int? IdCuentaCliente { get; set; }
        public string UsuarioCreado  { get; set; }
    }
}
