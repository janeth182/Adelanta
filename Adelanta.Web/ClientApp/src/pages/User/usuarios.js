import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Divider, Switch, Radio, Form, Select, Input, message, Popconfirm } from "antd";
import { PlusSquareOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../components/layout/content";
import { listarUsuarios } from "../../services/usuariosService";
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

	function confirm(e) {
		console.log(e);
		message.success('Se eliminimo correctamente al usuario.');
	  }
	  
	  function cancel(e) {
		console.log(e);
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
								history.push("/editar-usuario/" + record.idUsuario, record.idUsuario)
							}
						></Button>
						<Divider type="vertical" />
						<Popconfirm
							title="Esta seguro que desea eliminar este usuario?"
							onConfirm={confirm}
							onCancel={cancel}
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
	}, []);

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
						actions={[<h1>©2021  Adelanta Factoring</h1>]}
						extra={
							<Button								
								className="primary-b"
								type="primary"
								icon={<PlusSquareOutlined style={{ fontSize: '16px'}}/>}								
								onClick={() =>
									history.push("/editar-usuario/0", 0)
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
