using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Model
{
    public class MensajeBE
    {
        public string De { get; set; }
        public string Copia { get; set; }
        public string CopiaOculta { get; set; }
        public string Para { get; set; }
        public string Asunto { get; set; }
        public string Detalle { get; set; }
        public bool EsHTML { get; set; }
        public string[] Archivos { get; set; }
        public string Tipo { get; set; }
        public int IdSolicitud { get; set; }
    }
}
