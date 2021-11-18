using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Model
{
    public class SolicitudBE
    {
        public int? IdSolicitud { get; set; }
        public string Ruc { get; set; }
        public string RazonSocial { get; set; }
        public decimal Importe { get; set; }
        public string Moneda { get; set; }
        public string TipoDocumento { get; set; }
        public string TipoOperacion { get; set; }
        public string DocumentoJson { get; set; }
    }
}
