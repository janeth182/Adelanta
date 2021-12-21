using Adelanta.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace Adelanta.Core
{
    public class EnvioCorreo: BaseCore
    {
        public async Task SendAsync(MensajeBE mensaje)
        {
            try
            {
                using (var mail = new MailMessage())
                {
                    IConfigurationBuilder builder = new ConfigurationBuilder();
                    builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
                    var root = builder.Build();

                    string s_emails_to = mensaje.Para;
                    string s_emails_cc = mensaje.Copia;
                    string s_emails_bcc = mensaje.CopiaOculta;
                    string[] lista_to = s_emails_to.Split(';');
                    for (var i = 0; i < lista_to.Length; i++)
                    {
                        mail.To.Add(new MailAddress(lista_to[i]));
                    }
                    if (s_emails_cc != null && s_emails_cc != "")
                    {
                        string[] lista_cc = s_emails_cc.Split(';');
                        for (var i = 0; i < lista_cc.Length; i++)
                        {
                            mail.CC.Add(new MailAddress(lista_cc[i]));
                        }
                    }
                    if (s_emails_bcc != null && s_emails_bcc != "")
                    {
                        string[] lista_bcc = s_emails_bcc.Split(';');
                        for (var i = 0; i < lista_bcc.Length; i++)
                        {
                            mail.Bcc.Add(new MailAddress(lista_bcc[i]));
                        }
                    }
                    mail.From = new MailAddress(mensaje.De);
                    mail.Subject = mensaje.Asunto;
                    mail.Body = mensaje.Detalle;
                    mail.IsBodyHtml = mensaje.EsHTML;
                    mail.BodyEncoding = System.Text.Encoding.UTF8;

                    if (mensaje.Archivos != null && mensaje.Archivos.Length > 0)
                    {
                        int nFiles = mensaje.Archivos.Length;
                        for (int i = 0; i < nFiles; i++)
                        {
                            FileInfo fiArchivo = new FileInfo(mensaje.Archivos[i]);
                            string nombreArchivo = fiArchivo.Name;
                            FileStream fs = new FileStream(mensaje.Archivos[i], FileMode.Open, FileAccess.Read);
                            Attachment a = new Attachment(fs, nombreArchivo, ObtenerMime(fiArchivo.Extension));
                            mail.Attachments.Add(a);
                        }
                    }

                    using (var smtp = new SmtpClient())
                    {
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Host = root.GetSection("AppSettings:ServerSMTP").Value;
                        smtp.Port = Convert.ToInt32(root.GetSection("AppSettings:PuertoSMTP").Value);
                        string requiereCredencial = root.GetSection("AppSettings:RequiereCredencialSMTP").Value;
                        string requiereSSL = root.GetSection("AppSettings:RequiereSSLSMTP").Value; 
                        if (requiereCredencial == "1")
                        {
                            smtp.UseDefaultCredentials = false;
                            string s_usuarioSMTP = root.GetSection("AppSettings:UsuarioSMTP").Value; 
                            string s_claveSMTP = root.GetSection("AppSettings:ClaveSMTP").Value;
                            //System.Net.NetworkCredential credenciales = new System.Net.NetworkCredential(s_usuarioSMTP, s_claveSMTP);
                            smtp.Credentials = new NetworkCredential(s_usuarioSMTP, s_claveSMTP);
                        }
                        else
                        {
                            smtp.UseDefaultCredentials = true;
                        }
                        if (requiereSSL == "1")
                        {
                            smtp.EnableSsl = true;
                        }
                        else
                        {
                            smtp.EnableSsl = false;
                        }
                        await smtp.SendMailAsync(mail);
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Log.grabarLog(ex);
            }
        }
        private string ObtenerMime(string extension)
        {
            string mime = string.Empty;
            switch (extension)
            {
                case ".txt":
                    mime = MediaTypeNames.Text.Plain;
                    break;
                case ".pdf":
                    mime = MediaTypeNames.Application.Pdf;
                    break;
                default:
                    mime = MediaTypeNames.Application.Zip;
                    break;

            }
            return mime;
        }
    }
}
