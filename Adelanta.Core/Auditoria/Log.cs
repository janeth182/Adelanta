using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Core.Log
{
    public class Log
    {
        public static void grabarLog(Exception ex)
        {
            string archivo = string.Empty;
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            archivo = String.Format("{0}{1}", root.GetSection("AppSettings:LOG").Value, Cadena.fomatoAMD("LogError", ".txt"));
            Objeto<Exception>.grabarArchivoTexto(ex, archivo);
        }
        public static void grabarLog(string mensaje)
        {
            string archivo = string.Empty;
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            archivo = String.Format("{0}{1}", root.GetSection("AppSettings:LOG").Value, Cadena.fomatoAMD("LogError", ".txt"));

            using (FileStream fs = new FileStream(archivo, FileMode.Append, FileAccess.Write, FileShare.Write))
            {
                using (StreamWriter sw = new StreamWriter(fs, Encoding.Default))
                {   
                    sw.WriteLine(mensaje);
                }
            }
            
        }
        public class Cadena
        {
            public static string fomatoAMD(string texto, string extension = "")
            {
                DateTime fechaActual = DateTime.Now;
                string formato = String.Format("{0}_{1}_{2}_{3}_{4}_{5}_{6}{7}", texto, fechaActual.Year,
                    fechaActual.Month.ToString().PadLeft(2, '0'),
                    fechaActual.Day.ToString().PadLeft(2, '0'),
                    fechaActual.Hour.ToString().PadLeft(2, '0'),
                    fechaActual.Minute.ToString().PadLeft(2, '0'),
                    fechaActual.Second.ToString().PadLeft(2, '0'),
                    extension);
                return (formato);
            }
        }
    }
}
