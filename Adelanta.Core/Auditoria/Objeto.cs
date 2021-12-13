using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Core.Log
{
    public class Objeto<T>
    {
        public static void grabarArchivoTexto(T obj, string archivo)
        {
            PropertyInfo[] propiedades = obj.GetType().GetProperties();
            using (FileStream fs = new FileStream(archivo, FileMode.Append, FileAccess.Write, FileShare.Write))
            {
                using (StreamWriter sw = new StreamWriter(fs, Encoding.Default))
                {
                    foreach (PropertyInfo propiedad in propiedades)
                    {
                        sw.Write(propiedad.Name);
                        sw.Write(" = ");
                        sw.WriteLine(propiedad.GetValue(obj, null) == null ? string.Empty : propiedad.GetValue(obj, null).ToString());
                    }
                    sw.WriteLine(new String('_', 50));
                }
            }
        }
    }
}
