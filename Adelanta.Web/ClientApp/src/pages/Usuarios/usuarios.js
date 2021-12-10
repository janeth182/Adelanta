import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Divider, message, Popconfirm } from "antd";
import { PlusSquareOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../components/layout/content";
import { listarUsuarios, eliminarUsuario } from "../../services/usuariosService";
import { getColumnSearchProps } from "../../components/table/configTable";
import { useMessageApi } from "../../hooks/useMessage";
import { MessageApi } from "../../components/message/message";

export const UsuariosPage = () => {
	const { isMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [dataUsuario, setDataUsuario] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);
	const history = useHistory();
	const urlEdicion = `${process.env.REACT_APP_RUTA_SERVIDOR}usuarios/editar-usuario/`;
	const confirm = async (id) => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				debugger
				const rpta = await eliminarUsuario(id);
				if (rpta.status === 204) {
					if (suscribe) {
						message.success('Se eliminimo correctamente al usuario.');
						cargarUsuarios();
						setLoadingApi(false);
					}
				} else {
					message.error('Ocurrio un error al momento de procesar la solicitud.');
					setLoadingApi(false);
				}
			} catch (error) {
				message.error('Ocurrio un error al momento de procesar la solicitud.');
				console.log(error.response);
				setLoadingApi(false);
			}
		})();
		return () => {
			suscribe = false;
		};
	}

	const cancel = async (e) => {
		message.error('No se elimino al usuario.');
	}

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
			dataIndex: "rol",
			...getColumnSearchProps("rol"),
		},
		{
			title: "Estado",
			dataIndex: "estado",
			...getColumnSearchProps("estado"),
			render: (value) => {
				return (
					<Tag color={value === "Activo" ? "green" : "red"} rou>
						{value}
					</Tag>
				);
			}
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
								history.push({ pathname: `${urlEdicion}${record.idUsuario}`, state: record.idUsuario })
							}
						></Button>
						<Divider type="vertical" />
						<Popconfirm
							title="Esta seguro que desea eliminar este usuario?"
							onConfirm={() => {
								confirm(record.idUsuario);
							}}
							onCancel={() => {
								cancel(record.idUsuario);
							}}
							okText="Sí"
							cancelText="No"
						>
							<Button
								danger
								icon={<DeleteOutlined />}
							></Button>
						</Popconfirm>
					</>
				);
			},
		},
	];

	useEffect(() => {
		cargarUsuarios();
	}, []);

	const cargarUsuarios = async () => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = await listarUsuarios();
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
	}

	const handleFormatColumns = (dataArray = []) => {
		const data = dataArray.reduce((ac, el) => {
			ac.push({
				...el
			});
			return ac;
		}, []);
		setDataUsuario(data);
	};
	return (
		<ContentComponent>
			<PageHeader
				backIcon={null}
				className="site-page-header"
				onBack={() => null}
				title=""
				style={{ backgroundcolor: '#f0f2f5' }}
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
						title="Usuarios"
						actions={[]}
						extra={
							<Button
								className="primary-b"
								type="primary"
								icon={<PlusSquareOutlined style={{ fontSize: '16px' }} />}
								onClick={() =>
									history.push({ pathname: `${urlEdicion}0`, state: 0 })
								}
							>
								Crear Usuario
							</Button>
						}
					>
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
		</ContentComponent>
	);
};
