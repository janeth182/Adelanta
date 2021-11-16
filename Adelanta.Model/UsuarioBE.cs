namespace Adelanta.Model
{
    public class UsuarioBE
    {
        public int IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Email { get; set; }
        public string Documento { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public int IdRol { get; set; }
        public string Rol { get; set; }
        public string Estado { get; set; }
        public int IdEstado { get; set; }
    }
}
