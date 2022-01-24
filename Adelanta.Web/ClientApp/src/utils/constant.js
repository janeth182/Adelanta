export const estados = {
    DISCONFORMIDAD: 5,
    CONFORMIDAD_EXPRESA: 4,
    REGISTRADO: 7,
    CONFIRMAR_FACTRACK: 8,
    SOLICITAR_APROBACION: 9,
    CONFIRMAR_APROBACION: 10,
    PENDIENTE_CAVALI: 11,
    ERROR_CAVALI: 12,
    APROBAR_DESEMBOLSO: 13,
    COMFIRMAR_DESEMBOLSO: 16
};
export const mensajeError = {
    GENERAL: 'Ocurrio un error al momento de procesar la solicitud, comuniquese con el administrador de sistema.',
    FOMARTO_ARCHIVO: 'Formato de archivo no permitido.',
    ARCHIVO_DUPLICADO: 'El Archivo {0} ya se encuentra cargado.',
    SELECCIONE_UNO: 'Seleccione al menos un registro.',
    ENVIO_CAVALI: 'El documento {0} no debe tener el campo F. Pago Confirmado y Neto Confirmado vacios.'
};
export const mensajeOK = {
    GENERAL: 'Los documentos, han sido procesados correctamente..',
    CORRECTO_CAVALI: 'Los documentos enviados a Cavali, han sido procesados correctamente.',
};
export const mime = {
    PDF: 'application/pdf',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    XML: 'text/xml'
};
export const tipoOperacion = {
    FACTORING: 'F',
    CONFIRMING: 'C'
}