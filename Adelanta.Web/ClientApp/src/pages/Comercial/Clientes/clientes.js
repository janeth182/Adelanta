import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuesta } from "../../../model/mocks/clientes";
import { ExportCSV } from '../../../utils/excel';
import { listarClientes } from "../../../services/clienteService";
import { AuthContext } from "../../../context/authProvider";
export const ClientesPage = () => {
	const { logoutUser, user } = useContext(AuthContext);
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [dataCliente, setDataCliente] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);
	const history = useHistory();
	const urlEdicion = `${process.env.REACT_APP_RUTA_SERVIDOR}comercial/editar-cliente/`;
	const columns = [
		{
			title: "Nro",
			dataIndex: "idCliente",
			...getColumnSearchProps("idCliente"),
		},
		{
			title: "Nombre / Razón Social",
			dataIndex: "razonSocial",
			...getColumnSearchProps("razonSocial"),
		},
		{
			title: "RUC",
			dataIndex: "ruc",
			...getColumnSearchProps("ruc"),
		},
		{
			title: "Dirección Oficina",
			dataIndex: "direccionOficina",
			...getColumnSearchProps("direccionOficina"),
		},
		{
			title: "Contacto",
			dataIndex: "nombreContacto",
			...getColumnSearchProps("nombreContacto"),
		},
		{
			title: "Telefono",
			dataIndex: "telefonoContacto",
			...getColumnSearchProps("telefonoContacto"),
		},
		{
			title: "Correo",
			dataIndex: "emailContacto",
			...getColumnSearchProps("emailContacto"),
		},
		{
			title: "Acción",
			dataIndex: "actiion",
			width: 100,
			render: (_, record) => {
				return (
					<>
						<Button
							className="primary-b"
							type="primary"
							icon={<EditOutlined />}
							onClick={() =>
								history.push({ pathname: `${urlEdicion}${record.idCliente}`, state: record.idCliente })
							}
						></Button>
					</>
				);
			},
		},
	];

	useEffect(() => {
		cargarDatos();
	}, []);

	const confirm = async () => {
		message.success('Se proceso correctamente.');
	}
	const cargarDatos = async () => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = await listarClientes(user.usuario);
				if (rpta.status === 200) {
					console.log(rpta.data);
					setDataCliente(rpta.data);
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
	}
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
						title="Clientes Registrados"
						actions={[]}
						extra={
							<>
								<Space>
									<Button
										className="primary-b"
										type="primary"
										icon={<PlusSquareOutlined style={{ fontSize: '16px' }} />}
										onClick={confirm}
									>
										Nuevo Cliente
									</Button>
									<ExportCSV csvData={respuesta.data} fileName={'GeneracionArchivo'} />
								</Space>
							</>
						}
					>
						<Table
							loading={loadingApi}
							columns={columns}
							dataSource={dataCliente}
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
