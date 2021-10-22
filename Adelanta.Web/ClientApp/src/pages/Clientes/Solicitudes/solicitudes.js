import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Divider, Switch, Radio, Form, Select, Input, message, Popconfirm } from "antd";
import { PlusSquareOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { listarUsuarios } from "../../../services/usuariosService";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { solicitudes }from "../../../model/mocks/solicitudes"

export const SolicitudesPage = () => {
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
			title: "Nro. Solicitud",
			dataIndex: "idSolicitud",
			...getColumnSearchProps("idSolicitud"),
		},	
		{
			title: "Fecha Solicitud",
			dataIndex: "fechaSolicitud",
			...getColumnSearchProps("fechaSolicitud"),
		},
        {
			title: "Liquidación",
			dataIndex: "liquidacion",
			...getColumnSearchProps("liquidacion"),
		},
		{
			title: "Aceptante",
			dataIndex: "aceptante",
			...getColumnSearchProps("aceptante"),
		},		
		{
			title: "RUC",
			dataIndex: "ruc",
			...getColumnSearchProps("ruc"),
		},
		{
			title: "Documento",
			dataIndex: "documento",
			...getColumnSearchProps("documento"),
		},
		{
			title: "Fecha de Emisión",
			dataIndex: "fechaEmision",
			...getColumnSearchProps("fechaEmision"),
		},
		{
			title: "importe",
			dataIndex: "importe",
			...getColumnSearchProps("importe"),
		},
		{
			title: "Estado",
			dataIndex: "estado",
			...getColumnSearchProps("estado"),
			render: (value) => {
				return (
					<Tag color={value === "Aprobar liquidación" ? "green" : "red"} rou>
						{value}
					</Tag>
				);
			}			
		}		
	];

	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = solicitudes;
				if (suscribe) {
                    console.log(rpta.data)
                    handleFormatColumns(rpta.data);
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
				style={{backgroundcolor:'#f0f2f5'}}
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
						title="Solicitudes"
						actions={[]}
						extra={
							<Button								
								className="primary-b"
								type="primary"
								icon={<PlusSquareOutlined style={{ fontSize: '16px'}}/>}								
								onClick={() =>
									history.push("/editar-usuario/0", 0)
								}
							>
							Nueva Solicitud
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
