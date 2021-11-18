import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button, Radio, Form, Upload, Space , message, Descriptions,Tabs } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../../components/layout/content";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { SaveOutlined, RetweetOutlined, UploadOutlined } from "@ant-design/icons";
import { useModal } from "../../../hooks/useModal";
import { cargarDocumentos } from "../../../services/solicitudService";
import XMLParser from 'react-xml-parser';
export const NuevaSolicitud2Page = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, messageInfo } = useMessageApi();
	const [loadingApi, setLoadingApi] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [fileListPDF, setFileListPDF] = useState([]);
	const [fileListXLSX, setFileListXLSX] = useState([]);
	const [tipoOperacion, setTipoOperacion] = useState('F');
	const [documentoCabecera, setDocumentoCabecera] = useState([]);
	const [documentoDetalle, setDocumentoDetalle] = useState([]);
	const history = useHistory();	
	const formik = useFormik({
		initialValues: {
			tipoFactoring: 0,            
            tipoConfirming: 0,
		},
		validationSchema: Yup.object().shape({			
            tipoFactoring: Yup.string().required("El campo es requerido"),            
            tipoConfirming: Yup.string().required("El campo es requerido"),
		}),
		onSubmit: (value) => {
			//handleNewUsuario(value);
		},
	});	
	const { TabPane } = Tabs;
	let fileReader;

	const handleupload = async (file) =>{	
		debugger		
		if(file.type === 'text/xml'){
			setFileList(fileList => [...fileList, file]);
			let reader = new FileReader();
			reader.onload = function(file) {	  
			  const jsonDataFromXml = new XMLParser().parseFromString(file.target.result);		  
			  const detalle = {		
				pagador: jsonDataFromXml.children[15].children[0].children[1].children[0].value,
				rucPagador: jsonDataFromXml.children[15].children[0].children[0].children[0].value,
				ubigeoPagador: jsonDataFromXml.children[16].children[0].children[0].children[0].value,
				departamentoPagador: jsonDataFromXml.children[16].children[0].children[0].children[2].value,
				provinciaPagador: jsonDataFromXml.children[16].children[0].children[0].children[3].value,	  
				distritoPagador: jsonDataFromXml.children[16].children[0].children[0].children[5].value,	 
				direccionPagador: jsonDataFromXml.children[16].children[0].children[0].children[6].children[0].value,
				proveedor: jsonDataFromXml.children[14].children[0].children[2].children[0].value,
				rucProveedor: jsonDataFromXml.children[14].children[0].children[0].children[0].value,
				ubigeoProveedor: jsonDataFromXml.children[14].children[0].children[2].children[1].children[0].value,
				departamentoProveedor: jsonDataFromXml.children[14].children[0].children[2].children[1].children[4].value,
				provinciaProveedor: jsonDataFromXml.children[14].children[0].children[2].children[1].children[5].value,
				distritoProveedor: jsonDataFromXml.children[14].children[0].children[2].children[1].children[6].value,
				direccionProveedor: jsonDataFromXml.children[14].children[0].children[2].children[1].children[2].value,		  						
				serie: jsonDataFromXml.children[4].value,
				moneda: jsonDataFromXml.children[10].value,
				fechaEmision: jsonDataFromXml.children[5].value,
				horaEmision: jsonDataFromXml.children[6].value,
				fechaVencimiento: jsonDataFromXml.children[7].value,
				formaPago: jsonDataFromXml.children[17].children[1].value,
				montoTotalImpuesto: jsonDataFromXml.children[18].children[0].value,
				montoOperacion: jsonDataFromXml.children[18].children[1].children[0].value,
				montoTotalVenta: jsonDataFromXml.children[19].children[2].value,
				codigoTributo: jsonDataFromXml.children[18].children[1].children[2].children[1].children[0].value,
				nombreTributo: jsonDataFromXml.children[18].children[1].children[2].children[1].children[1].value,
				codigoInternacionalTributo: jsonDataFromXml.children[18].children[1].children[2].children[1].children[2].value,
				detalle: jsonDataFromXml.children[20],
				nombreArchivo: file.name,
				xml: file.target.result,
			 }
			 setDocumentoDetalle(documentoDetalle => [...documentoDetalle, detalle]);
			};
			reader.readAsText(file);
		} else if(file.type === 'application/pdf'){
			setFileListPDF(fileListPDF => [...fileListPDF, file]);
		} else if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
			setFileListXLSX(fileListXLSX => [...fileListXLSX, file]);
		} else {
			//Upload.LIST_IGNORE;
			message.error('Formato de archivo no permitido.');
		}
		
		return false;
	}	
	const enviarDocumentos = async () => {
		console.log(documentoDetalle) 	
		if(fileList.length > 0){
			let data = new FormData();
			for(let i = 0; i < fileList.length; i++){
				data.append('file[]', fileList[i]);
			}			
			console.log(documentoCabecera);
			data.append('tipoOperacion', tipoOperacion);
			/*data.append('ruc', documentoCabecera[0].ruc);
			data.append('moneda', documentoCabecera[0].moneda);*/
			const rpta = await cargarDocumentos(data);
			console.log(rpta);
			message.success('Solicitud registrada correctamente.');
		} else {
			message.info('Usted no ha cargado archivos.');
		}		
	}
	const obtenerCabeceraDocumento = (file)=>{
		let reader = new FileReader();
		reader.onload = function(file) {	  
		  const jsonDataFromXml = new XMLParser().parseFromString(file.target.result);
		  const cabecera = {
			 aceptante: jsonDataFromXml.children[15].children[0].children[0].children[0].value,
			 moneda: jsonDataFromXml.children[10].value
		  }
		  setDocumentoCabecera(documentoCabecera => [...documentoCabecera, cabecera]);
		};
		reader.readAsText(file);
	}
	const obtenerTipoOperacion = async(e) => {
		setTipoOperacion(e);
	}

	return (
		<ContentComponent style={{ padding: '0 24px', minHeight: 280 }} >
			<MessageApi
				type={messageInfo.type}
				message={messageInfo.text}
				description={messageInfo.description}
				visibility={isMessage}
			/>
			<Row>
				<Col span={24}>
					<Card
						title="Nueva Solicitud"
						actions={[
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									padding: `0 16px`,
								}}
							>
							<Button type="secondary"
								icon={<RetweetOutlined />}
								onClick={() =>								
								history.push({pathname: `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/solicitudes`, state: 0})
							}
							>Regresar</Button>
							</div>,
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									padding: `0 16px`,
								}}
							>
							<Button type="primary" onClick={enviarDocumentos} icon={<SaveOutlined />} loading={loadingApi}>
								Guardar
							</Button>
							</div>,
						]}
					>
						<Form layout="vertical">
                            <Descriptions title="Información">
                                <Descriptions.Item label="">
                                Para registrar una nueva solicitud, haga click en el boton "Cargar Documentos", y seleccione los documentos que desea ceder a Adelanta Factoring.
                                <br />Para los casos de factoring, cargue los archivos PDF y XML.
                                <br />Luego de que los documentos hayan sido cargados, hacer click en el botón procesar, para registrarlos en el sistema.
                                </Descriptions.Item>                           
                            </Descriptions>
                            <Descriptions title="Tipo de Servicio">     							                                                      
                            </Descriptions>
							<Tabs type="card" onChange={obtenerTipoOperacion}>
								<TabPane tab="Factoring" key="F">
								<Form layout="vertical"  className="ant-advanced-search-form">   													                           
								<Descriptions title="Proceso de Carga">                                                           
								</Descriptions>
									<Space direction="vertical" style={{ width: '100%' }} size="large">
										<Upload
										action=""
										listType="picture"
										maxCount={20}
										multiple
										beforeUpload={handleupload} 
										accept="application/pdf"											
										>
										<Button icon={<UploadOutlined />}>Adjuntar PDF</Button>
										</Upload>
										<Upload
										action=""
										listType="picture"
										maxCount={20}
										beforeUpload={handleupload}
										multiple
										accept="text/xml"	
										className="upload-list-inline"
										>
										<Button icon={<UploadOutlined />}>Adjuntar XML</Button>
										</Upload>									
									</Space>        
								</Form>     		
								</TabPane>
								<TabPane tab="Confirming" key="C">
								<Form layout="vertical"  className="ant-advanced-search-form">   													                           
								<Descriptions title="Proceso de Carga">                                                           
								</Descriptions>
									<Space direction="vertical" style={{ width: '100%' }} size="large">
										<Upload
										action=""
										listType="picture"
										maxCount={20}
										multiple
										beforeUpload={handleupload} 
										accept="application/pdf"											
										>
										<Button icon={<UploadOutlined />}>Adjuntar PDF</Button>
										</Upload>
										<Upload
										action=""
										listType="picture"
										maxCount={20}
										beforeUpload={handleupload}
										multiple
										accept="text/xml"	
										>
										<Button icon={<UploadOutlined />}>Adjuntar XML</Button>
										</Upload>
										<Upload
										action=""
										listType="picture"
										maxCount={20}
										beforeUpload={handleupload}
										multiple									
										accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
										>
										<Button icon={<UploadOutlined />}>Adjuntar XLSX</Button>
										</Upload>
									</Space>        
								</Form>     		
								</TabPane>					
							</Tabs>																
						</Form>
					</Card>
				</Col>
			</Row>
		</ContentComponent>
	);
};
