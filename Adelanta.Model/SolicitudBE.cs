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
        public decimal Tasa { get; set; }
        public decimal FondoResguardo { get; set; }
        public string Liquidacion { get; set; }
        public string Usuario { get; set; }
    }
}
