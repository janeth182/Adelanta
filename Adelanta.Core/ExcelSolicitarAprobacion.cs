using Adelanta.Model;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adelanta.Core
{
    public class ExcelSolicitarAprobacion: BaseCore
    {
        public string ExportarDocumentosLiquidadosConforming(SolicitudBE oSolicitudBE, List<DocumentoBE> lDocumentoBE)
        {
            string RutaArchivo = "Excel/LiquidacionManual" + oSolicitudBE.IdSolicitud + ".xlsx";
            using (ExcelPackage excel = new ExcelPackage())
            {
                ExcelWorksheet worksheet = null;
                worksheet = excel.Workbook.Worksheets.Add("Hoja1");
                worksheet.Cells.Style.Font.Size = 8;
                worksheet.Cells.Style.Font.Name = "Arial";
                int headerCount = 0;                           
                string sCabecera = "PROVEEDORES|Nro de Documento|Moneda|Fecha Confirmada de Pago|Monto pendiente de pago|Monto neto|Intereses (INC IGV)|Gastos (INC IGV)|TOTAL FACTURADO";
                string[] aCabecera = sCabecera.Split('|');
                int nCabecera = aCabecera.Length;
                Color colFromHex = System.Drawing.ColorTranslator.FromHtml("#37657D");
                for (int p = 0; p < nCabecera; p++)
                {
                    headerCount++;
                    worksheet.Cells[1, headerCount].Value = aCabecera[p];
                    worksheet.Cells[1, headerCount].Style.Font.Color.SetColor(System.Drawing.Color.White);
                    worksheet.Cells[1, headerCount].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[1, headerCount].Style.Fill.BackgroundColor.SetColor(colFromHex);
                }
                int rowCounter = 1;
                int columnCounter = 0;
                foreach (var oDocumentoBE in lDocumentoBE)
                {
                    rowCounter++;
                    columnCounter = 1;
                    if (oSolicitudBE.IdSolicitud == oDocumentoBE.IdSolicitud)
                    {
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.Proveedor;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.RucProveedor;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.Moneda;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.FechaPago;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoPendientePago;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.NetoConfirmado;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.InteresesIGV;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.GastosIGV;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoFacturado;
                    }
                }
                int firstRow = 1;
                int lastRow = worksheet.Dimension.End.Row;
                int firstColumn = 1;
                int lastColumn = worksheet.Dimension.End.Column;

                ExcelRange rg = worksheet.Cells[firstRow, firstColumn, lastRow, lastColumn];
                worksheet.Cells[worksheet.Dimension.Address].AutoFilter = true;
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                FileInfo excelFile = new FileInfo(RutaArchivo);
                excel.SaveAs(excelFile);
            }
            return RutaArchivo;
        }
        public string ExportarDocumentosLiquidadosFactoring(SolicitudBE oSolicitudBE, List<DocumentoBE> lDocumentoBE)
        {
            string RutaArchivo = string.Empty;

            return RutaArchivo;
        }
    }
}
