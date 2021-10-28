import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Button, Radio, Form, Select, message, Descriptions} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../../components/layout/content";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { crearUsuario, obtenerUsuario, actualizarUsuario, ObtenerUsuarioPorUserName } from "../../../services/usuariosService";
import { SaveOutlined, RetweetOutlined  } from "@ant-design/icons";

export const NuevaSolicitudPage = () => {
	const { isMessage, messageInfo } = useMessageApi();
	const [loadingApi, setLoadingApi] = useState(false);
	const history = useHistory();	
	const formik = useFormik({
		initialValues: {
			tipoFactoring: 0,
            tipoCapitalTrabajo: 0,
            tipoConfirming: 0,
		},
		validationSchema: Yup.object().shape({			
            tipoFactoring: Yup.string().required("El campo es requerido"),
            tipoCapitalTrabajo: Yup.string().required("El campo es requerido"),
            tipoConfirming: Yup.string().required("El campo es requerido"),
		}),
		onSubmit: (value) => {
			handleNewUsuario(value);
		},
	});

	const handleNewUsuario = async (value) => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				let rpta = '';
				if(history.location.state === 0){
					rpta = await ObtenerUsuarioPorUserName(value.usuario);
					if(rpta.data.usuario !== value.usuario){											
						rpta = await crearUsuario(value);
					}										
				} else {
					rpta = await actualizarUsuario(value);
				}
				if (rpta.status === 201) {
					if (suscribe) {
						message.success('Se registro correctamente el usuario.');
						setLoadingApi(false);
					}
				} else if(rpta.status === 204){
					message.success('Se actualizo correctamente el usuario.');
					setLoadingApi(false);
				} else if (rpta.status === 200){
					message.info('El usuario ingresado ya existe.');
					setLoadingApi(false);
				} else {
					message.error('Ocurrio un error al momento de procesar la solicitud.');
					setLoadingApi(false);
				}
			} catch (error) {
				setLoadingApi(false);
				message.error('Ocurrio un error al momento de procesar la solicitud.');
			}
		})();

		return () => {
			suscribe = false;
		};		
	};

	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				if(history.location.state !== 0 ){
					const rpta = await obtenerUsuario(history.location.state);
					if (rpta.status === 200) {
						if (suscribe) {						
							formik.initialValues.apellidoMaterno = rpta.data.apellidoMaterno;
							formik.initialValues.apellidoPaterno = rpta.data.apellidoPaterno;
							formik.initialValues.direccion = rpta.data.direccion;
							formik.initialValues.documento = rpta.data.documento;
							formik.initialValues.email = rpta.data.email;
							formik.initialValues.idRol = rpta.data.idRol;
							formik.initialValues.idUsuario = rpta.data.idUsuario;
							formik.initialValues.nombres = rpta.data.nombres;
							formik.initialValues.telefono = rpta.data.telefono;
							formik.initialValues.usuario = rpta.data.usuario;
							formik.initialValues.idEstado = rpta.data.idEstado;
							formik.initialValues.rol = rpta.data.rol;
							formik.initialValues.estado = rpta.data.estado;
							formik.initialValues.usuario = rpta.data.usuario;
							console.log(rpta.data)
							setLoadingApi(false);
						}
					}
				} else {
					setLoadingApi(false);
				}				
			} catch (error) {
				setLoadingApi(false);
				console.log(error.response);
			}
		})();
		return () => {
			suscribe = false;
		};
	}, []);
	return (
		<ContentComponent style={{ padding: '0 24px', minHeight: 280 }} >
			<PageHeader
				backIcon={null}
				className="site-page-header"
				onBack={() => null}
				title=""
			/>
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
								history.push("/clientes/solicitudes")}
							>Regresar</Button>
							</div>,
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									padding: `0 16px`,
								}}
							>
							<Button type="primary" onClick={formik.handleSubmit} icon={<SaveOutlined />} loading={loadingApi}>
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
                                <br />Para los casos de Capital de trabajo, cargue la letra de cambio.
                                <br />Luego de que los documentos hayan sido cargados, hacer click en el botón procesar, para registrarlos en el sistema.
                                </Descriptions.Item>                           
                            </Descriptions>
                            <Descriptions title="Tipo de Servicio">                                                           
                            </Descriptions>
							<Row gutter={12}>
								<Col lg={12} xs={{ span: 24 }}>
                                <Radio.Group defaultValue="a" buttonStyle="solid">
                                    <Radio.Button value="a">Factoring</Radio.Button>
                                    <Radio.Button value="b">Capital de Trabajo</Radio.Button>
                                    <Radio.Button value="c">Confirming</Radio.Button>                                
                                </Radio.Group>
								</Col>																	
							</Row>													
						</Form>
					</Card>
				</Col>
			</Row>
		</ContentComponent>
	);
};
