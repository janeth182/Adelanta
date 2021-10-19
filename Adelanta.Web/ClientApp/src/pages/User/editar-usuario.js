import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Button, Switch, Radio, Form, Select, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../components/layout/content";
import { useMessageApi } from "../../hooks/useMessage";
import { MessageApi } from "../../components/message/message";
import { InputComponent } from "../../components/formControl.js/input";
import { SelectComponent } from "../../components/formControl.js/select";
import { crearUsuario } from "../../services/usuariosService";
import { SaveOutlined, RetweetOutlined  } from "@ant-design/icons";
const { Option } = Select;

export const EditarUsuariosPage = () => {
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [loadingApi, setLoadingApi] = useState(false);
	const history = useHistory();
	const formik = useFormik({
		initialValues: {
			apellidoMaterno: "Herhuay",
			apellidoPaterno: "Vargas",
			direccion: '',
			documento: "10460111299",
			email: "jvargas182@gmail.com",
			idRol: "1",
			idUsuario: 1,
			nombres: "Janeth",
			telefono: "",
			usuario: "jvargas",
			idEstado: 1,
			rol:'',
			estado:'',
			usuario: 'jvargas'		
		},
		validationSchema: Yup.object().shape({
			nombres: Yup.string().required("El campo es requerido"),
			apellidoMaterno: Yup.string().required("El campo es requerido"),
			apellidoPaterno: Yup.string().required("El campo es requerido"),
			documento: Yup.string().required("El campo es requerido"),
			estado: Yup.string().required("El campo es requerido"),
			telefono: Yup.string(),
			direccion: Yup.string(),
			email: Yup.string().required("El campo es requerido"),
			idRol: Yup.string().required("El campo es requerido")
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
				const rpta = await crearUsuario(value);
				if (rpta.status === 201) {
					if (suscribe) {
						await addMessage({
							type: "success",
							text: "Registro Existoso",
							description: "El usuario se registro correctamente",
						});
						console.log(value);
						setLoadingApi(false);
					}
				} else {
					message.error('This is an error message');
				}
			} catch (error) {
				setLoadingApi(false);
				console.log(error.response);
				message.error('This is an error message');
			}
		})();

		return () => {
			suscribe = false;
		};		
	};

	return (
		<ContentComponent style={{ padding: '0 24px', minHeight: 280 }}>
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
							<Button type="primary" onClick={formik.handleSubmit} icon={<SaveOutlined />}>
								Actualizar
							</Button>
							</div>,
						]}
					>
						<Form layout="vertical">
							<Row gutter={12}>
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
								<Col lg={12} xs={{ span: 24 }}>
									<InputComponent
										name="documento"
										value={formik.values.documento}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.documento}
										touched={formik.touched.documento}
										title="Nro RUC:"
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
										name="email"
										value={formik.values.email}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={formik.errors.email}
										touched={formik.touched.email}
										title="Email:"
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
										name="idRol"
										value={formik.values.idRol}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.setFieldValue("idRol", e);
										}}
										error={formik.errors.idRol}
										touched={formik.touched.idRol}
										title="Rol:"
									>
										<Option value="1">Administrador</Option>
										<Option value="2">Comercial</Option>
									</SelectComponent>
								</Col>
								<Col xs={24} lg={12}>
								<SelectComponent
										name="idEstado"
										value={formik.values.estado}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.setFieldValue("estado", e);
										}}
										error={formik.errors.estado}
										touched={formik.touched.estado}
										title="Estado:"
									>
										<Option value="1">Creado</Option>
										<Option value="2">Activo</Option>
										<Option value="3">Inactivo</Option>
									</SelectComponent>
								</Col>								
							</Row>
							<InputComponent
								name="direccion"
								value={formik.values.direccion}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								error={formik.errors.direccion}
								touched={formik.touched.direccion}
								title="Direccion:"
							/>
						</Form>
					</Card>
				</Col>
			</Row>
		</ContentComponent>
	);
};
