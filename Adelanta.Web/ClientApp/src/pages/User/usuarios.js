import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Divider, Switch, Radio, Form, Select, Input } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../components/layout/content";
import { listarUsuariosService } from "../../services/usuariosService";
import { getColumnSearchProps } from "../../components/table/configTable";
import { useModal } from "../../hooks/useModal";
import { ModalComponent } from "../../components/modal/modal";
import { useMessageApi } from "../../hooks/useMessage";
import { MessageApi } from "../../components/message/message";
import { InputComponent } from "../../components/formControl.js/input";
import { SelectComponent } from "../../components/formControl.js/select";

const { Option } = Select;

export const UsuariosPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [valueSearch, setValueSearch] = useState("");

	const [dataUsuario, setDataUsuario] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);

	const history = useHistory();

	const columns = [
		{
			title: "Nro.",
			dataIndex: "idUsuario",
			...getColumnSearchProps("idUsuario"),
		},	
		{
			title: "Usuario",
			dataIndex: "usuario",
			...getColumnSearchProps("usuario"),
		},
		{
			title: "Nombres",
			dataIndex: "nombres",
			...getColumnSearchProps("nombres"),
		},
		{
			title: "A. Paterno",
			dataIndex: "apellidoPaterno",
			...getColumnSearchProps("apellidoPaterno"),
		},
		{
			title: "A. Materno",
			dataIndex: "apellidoMaterno",
			...getColumnSearchProps("apellidoMaterno"),
		},
		{
			title: "Email",
			dataIndex: "email",
			...getColumnSearchProps("email"),
		},
		{
			title: "Documento",
			dataIndex: "documento",
			...getColumnSearchProps("documento"),
		},
		{
			title: "Rol",
			dataIndex: "documento",
			...getColumnSearchProps("documento"),
		},
		{
			title: "Estado",
			dataIndex: "status",
			render: (value) => {
				return (
					<Tag color={value === "active" ? "green" : "red"} rou>
						{value}
					</Tag>
				);
			},
			filters: [
				{
					text: "Activo",
					value: "active",
				},
				{
					text: "Inactivo",
					value: "inactive",
				},
			],
			onFilter: (value, record) => record.status.indexOf(value) === 0,
		},
		{
			title: "Acción",
			dataIndex: "actiion",
			width: 100,
			render: (_, record) => {
				return (
					<>
						<Button
							type="success"
							icon={<EditOutlined />}
							onClick={() =>
								history.push("/editar-usuario/" + record.id)
							}
						></Button>
						<Divider type="vertical" />
						<Button
							danger
							icon={<DeleteOutlined />}
							onClick={() => alert(record.id)}
						></Button>
					</>
				);
			},
		},
	];

	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = await listarUsuariosService();

				if (rpta.status === 200) {
					if (suscribe) {
						console.log(rpta.data)
						handleFormatColumns(rpta.data);
						setLoadingApi(false);
					}
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

	const formik = useFormik({
		initialValues: {
			nombre: "",
			edad: "",
			direccion: "",
			sexo: "",
			estado: true,
			civil: "Soltero",
		},
		validationSchema: Yup.object().shape({
			nombre: Yup.string().required("El campo es requerido"),
			edad: Yup.string().required("El campo es requerido"),
			direccion: Yup.string().required("El campo es requerido"),
			sexo: Yup.string().required("El campo es requerido"),
			estado: Yup.boolean(),
			civil: Yup.string(),
		}),
		onSubmit: (value) => {
			handleNewUsuario(value);
		},
	});

	const handleFormatColumns = (dataArray = []) => {
		const data = dataArray.reduce((ac, el) => {
			ac.push({
				...el,
				key: el.id,
				age: Math.floor(Math.random() * (100 - 1)) + 1,
			});
			return ac;
		}, []);
		setDataUsuario(data);
	};

	const handleNewUsuario = async (value) => {
		hiddenModal();
		await addMessage({
			type: "success",
			text: "Registro Existoso",
			description: "El usuario se registro correctamente",
		});
		console.log(value);
	};

	return (
		<ContentComponent>
			<PageHeader
				backIcon={null}
				className="site-page-header"
				onBack={() => null}
				title="Listar Usuarios"
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
						title="Listar Usuarios"
						actions={[<h1>©2021  Adelanta Factoring</h1>]}
						extra={
							<Button
								// style={{ backgroundColor: "red" }}
								className="primary-b"
								type="primary"
								icon={<UserAddOutlined />}
								onClick={showModal}
							>
								Usuario
							</Button>
						}
					>
						<Row>
							<Col xs={24} lg={12}>
								<Row>
									<Col xs={24} lg={20} style={{ marginBottom: 10 }}>
										<Input
											placeholder="Buscar"
											value={valueSearch}
											onChange={(e) =>
												setValueSearch(e.target.value)
											}
										/>
									</Col>
									<Col xs={24} lg={4} style={{ marginBottom: 10 }}>
										<Button type="primary" block>
											Buscar
										</Button>
									</Col>
								</Row>
							</Col>
						</Row>
						<Table
							loading={loadingApi}
							columns={columns}
							dataSource={dataUsuario}
							size="middle"
							pagination={{
								current: page,
								pageSize: pageSize,
								onChange: (page, pageSize) => {
									setPage(page);
									setPageSize(pageSize);
								},
							}}
						/>
					</Card>
				</Col>
			</Row>

			<ModalComponent
				title="Registrar Usuario"
				onClose={hiddenModal}
				show={isModal}
				nameButton="Guardar"
				onPress={formik.handleSubmit}
			>
				<Form layout="vertical">
					<Row gutter={16}>
						<Col span={12}>
							<InputComponent
								name="nombre"
								value={formik.values.nombre}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								error={formik.errors.nombre}
								touched={formik.touched.nombre}
								title="Nombre"
							/>
						</Col>
						<Col span={12}>
							<InputComponent
								name="edad"
								value={formik.values.edad}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								error={formik.errors.edad}
								touched={formik.touched.edad}
								title="Edad"
							/>
						</Col>
					</Row>
					<InputComponent
						name="direccion"
						value={formik.values.direccion}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						error={formik.errors.direccion}
						touched={formik.touched.direccion}
						title="Direccion"
					/>
					<Row gutter={16}>
						<Col span={12}>
							<SelectComponent
								name="sexo"
								value={formik.values.sexo}
								onBlur={formik.handleBlur}
								onChange={(e) => {
									formik.setFieldValue("sexo", e);
								}}
								error={formik.errors.sexo}
								touched={formik.touched.sexo}
								title="Sexo"
							>
								<Option value="male">Masculino</Option>
								<Option value="female">Femenino</Option>
							</SelectComponent>
						</Col>
						<Col span={12}>
							<Form.Item label="Estado:" valuePropName="checked">
								<Switch
									name="estado"
									checked={formik.values.estado}
									value={formik.values.estado}
									onBlur={formik.handleBlur}
									onChange={(e) => {
										formik.setFieldValue("estado", e);
									}}
								/>
							</Form.Item>
						</Col>
						<Radio.Group
							onChange={(e) => {
								console.log(e);
								formik.setFieldValue("civil", e.target.value);
							}}
							value={formik.values.civil}
						>
							<Radio value="1">Casado</Radio>
							<Radio value="2">Soltero</Radio>
							<Radio value="3">Divoriciado</Radio>
							<Radio value="4">Viudo</Radio>
						</Radio.Group>
					</Row>
				</Form>
			</ModalComponent>
		</ContentComponent>
	);
};
