namespace Adelanta.Model
{
    public class MenuBE
    {
        public int IdMenu { get; set; }
        public int IdMenuPadre { get; set; }
        public string Menu { get; set; }
        public string Descripcion { get; set; }
        public string Css { get; set; }
        public string RutaPagina { get; set; }
    }
}
