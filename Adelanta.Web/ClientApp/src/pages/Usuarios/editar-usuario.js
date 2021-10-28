import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Button, Form, Select, message} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../components/layout/content";
import { useMessageApi } from "../../hooks/useMessage";
import { MessageApi } from "../../components/message/message";
import { InputComponent } from "../../components/formControl.js/input";
import { SelectComponent } from "../../components/formControl.js/select";
import { crearUsuario, obtenerUsuario, actualizarUsuario, ObtenerUsuarioPorUserName } from "../../services/usuariosService";
import { SaveOutlined, RetweetOutlined  } from "@ant-design/icons";
const { Option } = Select;

export const EditarUsuariosPage = () => {
	const { isMessage, messageInfo } = useMessageApi();
	const [loadingApi, setLoadingApi] = useState(false);
	const history = useHistory();	
	const formik = useFormik({
		initialValues: {
			apellidoMaterno: '',
			apellidoPaterno: '',
			direccion: '',
			documento: '',
			email: '',
			idRol: 1,
			idUsuario: '0',
			nombres: '',
			telefono: '',
			usuario: '',
			idEstado: 1,
			rol:'',
			estado: '',
			usuario: ''	
		},
		validationSchema: Yup.object().shape({
			usuario: Yup.string().required("El campo es requerido"),
			nombres: Yup.string().required("El campo es requerido"),
			apellidoMaterno: Yup.string().required("El campo es requerido"),
			apellidoPaterno: Yup.string().required("El campo es requerido"),
			documento: Yup.number().required("El campo es requerido"),
			idEstado: Yup.string().required("El campo es requerido"),
			telefono: Yup.string(),
			direccion: Yup.string(),
			email: Yup.string().required("El campo es requerido"),
			idRol: Yup.number().required("El campo es requerido")
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
						title="Editar Usuario"
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
								history.push("/usuarios")}
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
							<Row gutter={12}>
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="usuario"
										value={formik.values.usuario}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.usuario}
										touched={formik.touched.usuario}
										title="Usuario:"
										disabled= {history.location.state === 0 ? false: true}
									/>
								</Col>
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="nombres"
										value={formik.values.nombres}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.nombres}
										touched={formik.touched.nombres}
										title="Nombres:"
									/>
								</Col>																
							</Row>
							<Row gutter={12}>
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="apellidoPaterno"
										value={formik.values.apellidoPaterno}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.apellidoPaterno}
										touched={formik.touched.apellidoPaterno}
										title="Apellido Paterno:"
									/>
								</Col>
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="apellidoMaterno"
										value={formik.values.apellidoMaterno}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.apellidoMaterno}
										touched={formik.touched.apellidoMaterno}
										title="Apellido Materno:"
									/>
								</Col>
							</Row>
							<Row gutter={12}>
							    <Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="documento"
										value={formik.values.documento}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.documento}
										touched={formik.touched.documento}
										maxLength={11}
										title="Nro RUC:"
									/>
								</Col>
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="email"
										value={formik.values.email}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.email}
										touched={formik.touched.email}
										title="Email:"
									/>
								</Col>							
							</Row>
							<Row gutter={16}>
								<Col lg={12} xs={{ span: 24 }}>
								<InputComponent
									name="direccion"
									value={formik.values.direccion}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									error={formik.errors.direccion}
									touched={formik.touched.direccion}
									title="Direccion:"
								/>
								</Col>
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="telefono"
										value={formik.values.telefono}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.telefono}
										touched={formik.touched.telefono}
										title="Telefono:"
									/>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col xs={24} lg={12}>
									<SelectComponent
										value={formik.values.idRol}
										onBlur={formik.handleBlur}
										onChange={value => formik.setFieldValue("idRol", value.value)}
										error={formik.errors.idEstado}
										touched={formik.touched.idEstado}
										title="Rol:"
										options={[{value: 1, label:'Administrador'}, {value:2 , label:'Comercial'}]}
									>
									</SelectComponent>
								</Col>
								<Col xs={24} lg={12}>
									<SelectComponent 
										value={formik.values.idEstado}
										onBlur={formik.handleBlur}
										onChange={value => formik.setFieldValue("idEstado", value.value)}
										error={formik.errors.idEstado}
										touched={formik.touched.idEstado}
										title="Estado:"
										options={[{value: 1, label:'Creado'},{value: 2, label:'Activo'},{value: 3, label:'Inactivo'}]}
									>
									</SelectComponent>
								</Col>								
							</Row>																			
						</Form>
					</Card>
				</Col>
			</Row>
		</ContentComponent>
	);
};
