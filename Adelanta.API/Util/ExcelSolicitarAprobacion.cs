using Adelanta.Model;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Adelanta.API.Util
{
    public  class ExcelSolicitarAprobacion
    {
        public static string ExportarDocumentosLiquidadorFactoring(SolicitudBE oSolicitudBE, List<DocumentoBE> lDocumentoBE)
        {
            string RutaArchivo = "Excel/LiquidacionManual" + oSolicitudBE.IdSolicitud + ".xlsx";
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (ExcelPackage excel = new ExcelPackage())
            {
                ExcelWorksheet worksheet = null;
                worksheet = excel.Workbook.Worksheets.Add("LIQUIDACION MANUAL");
                worksheet.Cells.Style.Font.Size = 12;
                worksheet.Cells.Style.Font.Name = "Arial";
                int headerCount = 0;
                string sCabecera = "N°|PROVEEDORES|Nro de Documento|Moneda|Fecha Confirmada de Pago|Monto pendiente de pago|Monto neto|Intereses (INC IGV)|Gastos (INC IGV)|TOTAL FACTURADO";
                string[] aCabecera = sCabecera.Split('|');
                int nCabecera = aCabecera.Length;
                Color colFromHex = System.Drawing.ColorTranslator.FromHtml("#ABB2B9");
                Color colFromHexFooter = System.Drawing.ColorTranslator.FromHtml("#D5D8DC");

                worksheet.Cells[5, 2].Value = "CLIENTE";
                worksheet.Cells[5, 3].Value = oSolicitudBE.Cedente;
                worksheet.Cells[5, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[5, 3].Style.Border.Top.Color.SetColor(colFromHex);
                worksheet.Cells[5, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[5, 3].Style.Border.Left.Color.SetColor(colFromHex);
                worksheet.Cells[5, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[5, 3].Style.Border.Right.Color.SetColor(colFromHex);
                worksheet.Cells[5, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[5, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                worksheet.Cells[6, 2].Value = "RUC CLIENTE";
                worksheet.Cells[6, 3].Value = oSolicitudBE.RucCedente;
                worksheet.Cells[6, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[6, 3].Style.Border.Top.Color.SetColor(colFromHex);
                worksheet.Cells[6, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[6, 3].Style.Border.Left.Color.SetColor(colFromHex);
                worksheet.Cells[6, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[6, 3].Style.Border.Right.Color.SetColor(colFromHex);
                worksheet.Cells[6, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[6, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                worksheet.Cells[7, 2].Value = "TASA";
                worksheet.Cells[7, 3].Value = oSolicitudBE.Tasa;
                worksheet.Cells[7, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[7, 3].Style.Border.Top.Color.SetColor(colFromHex);
                worksheet.Cells[7, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[7, 3].Style.Border.Left.Color.SetColor(colFromHex);
                worksheet.Cells[7, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[7, 3].Style.Border.Right.Color.SetColor(colFromHex);
                worksheet.Cells[7, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                worksheet.Cells[7, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                for (int p = 0; p < nCabecera; p++)
                {
                    headerCount++;
                    worksheet.Cells[10, headerCount].Value = aCabecera[p];
                    worksheet.Cells[10, headerCount].Style.Font.Color.SetColor(System.Drawing.Color.White);
                    worksheet.Cells[10, headerCount].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[10, headerCount].Style.Fill.BackgroundColor.SetColor(colFromHex);
                }
                int rowCounter = 10;
                int columnCounter = 0;
                int numeroRegistro = 0;
                decimal TotalMontoPendientePago = 0;
                decimal TotalNetoConfirmado = 0;
                decimal TotalInteresesIGV = 0;
                decimal TotalGastosIGV = 0;
                decimal TotalMontoFacturado = 0;

                foreach (var oDocumentoBE in lDocumentoBE)
                {              
                    if (oSolicitudBE.IdSolicitud == oDocumentoBE.IdSolicitud)
                    {
                        rowCounter++;
                        columnCounter = 1;
                        numeroRegistro++;

                        TotalMontoPendientePago += oDocumentoBE.MontoPendientePago;
                        TotalNetoConfirmado += oDocumentoBE.NetoConfirmado;
                        TotalInteresesIGV += oDocumentoBE.InteresesIGV;
                        TotalGastosIGV += oDocumentoBE.GastosIGV;
                        TotalMontoFacturado += oDocumentoBE.MontoFacturado;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = numeroRegistro;

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
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.Serie;

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
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoNeto;

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

                rowCounter++;
                columnCounter = 1;
                worksheet.Cells[rowCounter, columnCounter++].Value = "";

                worksheet.Cells[rowCounter, columnCounter++].Value = "";

                worksheet.Cells[rowCounter, columnCounter++].Value = "";

                worksheet.Cells[rowCounter, columnCounter++].Value = "";

                worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                worksheet.Cells[rowCounter, columnCounter++].Value = "Total";

                worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                worksheet.Cells[rowCounter, columnCounter++].Value = TotalMontoPendientePago;

                worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                worksheet.Cells[rowCounter, columnCounter++].Value = TotalNetoConfirmado;

                worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                worksheet.Cells[rowCounter, columnCounter++].Value = TotalInteresesIGV;

                worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                worksheet.Cells[rowCounter, columnCounter++].Value = TotalGastosIGV;

                worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                worksheet.Cells[rowCounter, columnCounter++].Value = TotalMontoFacturado;

                int firstRow = 1;
                int lastRow = worksheet.Dimension.End.Row;
                int firstColumn = 1;
                int lastColumn = worksheet.Dimension.End.Column;

                ExcelRange rg = worksheet.Cells[firstRow, firstColumn, lastRow, lastColumn];
                //worksheet.Cells[worksheet.Dimension.Address].AutoFilter = true;
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                FileInfo excelFile = new FileInfo(RutaArchivo);
                excel.SaveAs(excelFile);
            }
            return RutaArchivo;
        }
        public static string ExportarDocumentosLiquidadosConfirming(SolicitudBE oSolicitudBE, List<DocumentoBE> lDocumentoBE)
        {
            string RutaArchivo = "Excel/LiquidacionIndividual" + oSolicitudBE.IdSolicitud + ".xlsx";
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (ExcelPackage excel = new ExcelPackage())
            {
                ExcelWorksheet worksheet = null;
                worksheet = excel.Workbook.Worksheets.Add("LIQUIDACION INDIVIDUAL");
                worksheet.Cells.Style.Font.Size = 12;
                worksheet.Cells.Style.Font.Name = "Arial";
                int headerCount = 0;
                string sCabecera = "N°|Pagador|Nro de Documento|Moneda|Fecha Confirmada de Pago|Monto pendiente de pago|Fondo de Resguardo|Monto neto|Intereses (INC IGV)|Gastos (INC IGV)|Monto de Desembolso";
                string[] aCabecera = sCabecera.Split('|');
                int nCabecera = aCabecera.Length;
                Color colFromHex = System.Drawing.ColorTranslator.FromHtml("#ABB2B9");
                Color colFromHexFooter = System.Drawing.ColorTranslator.FromHtml("#B2BABB");
                int rowCounter = 0;
                int columnCounter = 0;
                
                foreach (var oDocumentoBE in lDocumentoBE)
                {
                    if (oSolicitudBE.IdSolicitud == oDocumentoBE.IdSolicitud)
                    {
                        rowCounter += 5;
                        worksheet.Cells[rowCounter, 2].Value = "LIQUIDACIÓN DE DESEMBOLSO";
                        worksheet.Cells[rowCounter, 3].Value = oSolicitudBE.Liquidacion;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter++, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                        worksheet.Cells[rowCounter, 2].Value = "CLIENTE";
                        worksheet.Cells[rowCounter, 3].Value = oSolicitudBE.Cedente;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter++, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                        worksheet.Cells[rowCounter, 2].Value = "RUC CLIENTE";
                        worksheet.Cells[rowCounter, 3].Value = oSolicitudBE.RucCedente;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter++, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                        worksheet.Cells[rowCounter, 2].Value = "TASA";
                        worksheet.Cells[rowCounter, 3].Value = oSolicitudBE.Tasa;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, 3].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter++, 3].Style.Border.Bottom.Color.SetColor(colFromHex);

                        rowCounter++;
                        rowCounter++;
                        headerCount = 0;
                        for (int p = 0; p < nCabecera; p++)
                        {
                            headerCount++;
                            worksheet.Cells[rowCounter, headerCount].Value = aCabecera[p];
                            worksheet.Cells[rowCounter, headerCount].Style.Font.Color.SetColor(System.Drawing.Color.Black);
                            worksheet.Cells[rowCounter, headerCount].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[rowCounter, headerCount].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }

                        rowCounter++;
                        columnCounter = 1;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = "1";

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.Pagador;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.Serie;

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
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.FondoResguardo;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoNeto;

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
                        /*Totales*/
                        rowCounter++;
                        columnCounter = 1;
                        worksheet.Cells[rowCounter, columnCounter++].Value = "";

                        worksheet.Cells[rowCounter, columnCounter++].Value = "";

                        worksheet.Cells[rowCounter, columnCounter++].Value = "";

                        worksheet.Cells[rowCounter, columnCounter++].Value = "";

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = "Total";

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoPendientePago;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);                        
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.FondoResguardo;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);                        
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoNeto;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.InteresesIGV;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.GastosIGV;

                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Top.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Left.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Right.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowCounter, columnCounter].Style.Border.Bottom.Color.SetColor(colFromHex);
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[rowCounter, columnCounter].Style.Fill.BackgroundColor.SetColor(colFromHexFooter);
                        worksheet.Cells[rowCounter, columnCounter++].Value = oDocumentoBE.MontoFacturado;
                    }
                }
                int firstRow = 1;
                int lastRow = worksheet.Dimension.End.Row;
                int firstColumn = 1;
                int lastColumn = worksheet.Dimension.End.Column;

                ExcelRange rg = worksheet.Cells[firstRow, firstColumn, lastRow, lastColumn];
                //worksheet.Cells[worksheet.Dimension.Address].AutoFilter = true;
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                FileInfo excelFile = new FileInfo(RutaArchivo);
                excel.SaveAs(excelFile);
            }
            return RutaArchivo;
        }
    }
}
