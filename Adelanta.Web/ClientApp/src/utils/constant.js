export const estados = {
    DISCONFORMIDAD: 5,
    CONFORMIDAD_EXPRESA: 4,
    REGISTRADO: 7,
    CONFIRMAR_FACTRACK: 8,
    SOLICITAR_APROBACION: 9,
    CONFIRMAR_APROBACION: 10,
    PENDIENTE_CAVALI: 11,
    ERROR_CAVALI: 12
};
export const mensajeError = {
    GENERAL: 'Ocurrio un error al momento de procesar la solicitud, comuniquese con el administrador de sistema.',
    FOMARTO_ARCHIVO: 'Formato de archivo no permitido.',
    ARCHIVO_DUPLICADO: 'El Archivo {0} ya se encuentra cargado.'
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