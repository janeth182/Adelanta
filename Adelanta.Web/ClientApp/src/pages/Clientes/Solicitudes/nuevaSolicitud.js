import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button, Radio, Form, Upload, Space , message, Descriptions} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../../components/layout/content";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { SaveOutlined, RetweetOutlined, UploadOutlined } from "@ant-design/icons";
import { useModal } from "../../../hooks/useModal";
export const NuevaSolicitudPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, messageInfo } = useMessageApi();
	const [loadingApi, setLoadingApi] = useState(false);
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

	const confirm = async () => {
		message.success('Solicitud registrada correctamente.');		
	}

	const ocultarUpload = async(e) => {
		if(e.target.value === 'f'){			
			document.getElementsByClassName('ant-space-item')[2].style.display = 'none';
		} else {
			document.getElementsByClassName('ant-space-item')[2].removeAttribute('style');
		}
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
							<Button type="primary" onClick={confirm} icon={<SaveOutlined />} loading={loadingApi}>
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
							<Row gutter={12}>
								<Col lg={12} xs={{ span: 24 }}>
                                <Radio.Group defaultValue="c" buttonStyle="solid">
                                    <Radio.Button value="f" onClick={ocultarUpload}>Factoring</Radio.Button>
                                    <Radio.Button value="c" onClick={ocultarUpload}>Confirming</Radio.Button>                                
                                </Radio.Group>
								</Col>																	
							</Row>						
							<Form layout="vertical"  className="ant-advanced-search-form">   						                           
							<Descriptions title="Proceso de Carga">                                                           
                            </Descriptions>
								<Space direction="vertical" style={{ width: '100%' }} size="large">
									<Upload
									action=""
									listType="picture"
									maxCount={1}
									>
									<Button icon={<UploadOutlined />}>Adjuntar PDF</Button>
									</Upload>
									<Upload
									action=""
									listType="picture"
									maxCount={1}
									multiple
									>
									<Button icon={<UploadOutlined />}>Adjuntar XML</Button>
									</Upload>
									<Upload
									action=""
									listType="picture"
									maxCount={1}
									multiple
									id='btnXLS'
									>
									<Button icon={<UploadOutlined />}>Adjuntar XLSX</Button>
									</Upload>
								</Space>        
							</Form>     											
						</Form>
					</Card>
				</Col>
			</Row>
		</ContentComponent>
	);
};
