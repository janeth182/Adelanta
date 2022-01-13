namespace Adelanta.Model
{
    public class SolicitudBE
    {
        public int? IdSolicitud { get; set; }
        public string Cedente { get; set; }
        public string RucCedente { get; set; }
        public string Aceptante { get; set; }
        public string RucAceptante { get; set; }
        public decimal Importe { get; set; }
        public string Moneda { get; set; }        
        public string TipoDocumento { get; set; }
        public string TipoOperacion { get; set; }
        public string DocumentoJson { get; set; }
        public decimal Tasa { get; set; }
        public decimal FondoResguardo { get; set; }
        public string Liquidacion { get; set; }
        public string Usuario { get; set; }
        public decimal MontoTotalVenta { get; set; }
    }
}
