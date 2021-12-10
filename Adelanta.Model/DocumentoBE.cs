using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Model
{
    public class DocumentoBE
    {
        public int IdDocumento { get; set; }
        public int IdSolicitud { get; set; }
        public string Pagador { get; set; }
        public string RucPagador { get; set; }
        public string Proveedor { get; set; }
        public string RucProveedor { get; set; }
        public string Serie { get; set; }
        public string Moneda { get; set; }
        public string FechaPago { get; set; }
        public decimal MontoPendientePago { get; set; }
        public decimal FondoResguardo { get; set; }
        public decimal NetoConfirmado { get; set; }
        public decimal MontoNeto { get; set; }
        public decimal InteresesIGV { get; set; }
        public decimal GastosIGV { get; set; }
        public decimal MontoDesembolso { get; set; }
        public decimal MontoFacturado { get; set; }
    }
}
