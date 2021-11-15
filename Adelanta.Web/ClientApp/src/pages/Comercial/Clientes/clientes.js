import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, message} from "antd";
import { EditOutlined, DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuesta }from "../../../model/mocks/clientes";
import { ExportCSV } from '../../../utils/excel';
export const ClientesPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);	
	const [dataUsuario, setDataUsuario] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);	
	const history = useHistory();
	const columns = [
        {
			title: "Nro",
			dataIndex: "idCliente",
			...getColumnSearchProps("idCliente"),
		},	
		{
			title: "Nombre / Razón Social",
			dataIndex: "nombre",
			...getColumnSearchProps("nombre"),
		},	       
        {
			title: "Dirección",
			dataIndex: "direccion",
			...getColumnSearchProps("direccion"),   	
		},
        {
			title: "RUC",
			dataIndex: "ruc",
			...getColumnSearchProps("ruc"),   	
		},
        {
			title: "Contacto",
			dataIndex: "contacto",
			...getColumnSearchProps("contacto"),   	
		},
        {
			title: "Telefono",
			dataIndex: "telefono",
			...getColumnSearchProps("telefono"),   	
		},
        {
			title: "Correo",
			dataIndex: "correo",
			...getColumnSearchProps("correo"),   	
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
								console.log('ss')
							}
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
				const rpta = respuesta;
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
	const confirm = async () => {
		message.success('Se proceso correctamente.');		
	}
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
						title="Clientes Registrados"
						actions={[]}
						extra={
							<>
							 <Space>
								<Button								
									className="primary-b"
									type="primary"
									icon={<PlusSquareOutlined  style={{ fontSize: '16px'}}/>}								
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
