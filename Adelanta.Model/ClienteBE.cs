using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Model
{
    public class ClienteBE
    {
        public int? IdCliente { get; set; }
        public string RazonSocial { get; set; }
        public string RUC { get; set; }
        public string DireccionOficina { get; set; }
        public string DireccionFacturacion { get; set; }
        public string NombreContacto { get; set; }
        public string TelefonoContacto { get; set; }
        public string EmailContacto { get; set; }
        public decimal TasaNominalMensual { get; set; }
        public decimal TasaNominalAnual { get; set; }
        public string EjecutivoComercial { get; set; }
        public string TipoOperacion { get; set; }
        public decimal Financiamiento { get; set; }
        public decimal ComisionEstructuracion { get; set; }
        public decimal GastosContrato { get; set; }
        public decimal ComisionCartaNotarial { get; set; }
        public decimal ServicioCobranza { get; set; }
        public decimal ServicioCustodia { get; set; }
        public int Estado { get; set; }
        public string Usuario { get; set; }
    }
}
