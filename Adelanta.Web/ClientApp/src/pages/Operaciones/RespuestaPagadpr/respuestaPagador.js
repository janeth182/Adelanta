import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, message, Calendar  } from "antd";
import { SaveOutlined, SendOutlined, EditOutlined  } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuestaPagador }from "../../../model/mocks/respuestaPagador";
export const RespuestaPagadorPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);	
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
			title: "Cliente",
			dataIndex: "cliente",
			...getColumnSearchProps("cliente"),
		},
        {
			title: "RUC",
			dataIndex: "ruc",
			...getColumnSearchProps("ruc"),   	
		},
		{
			title: "Aceptante",
			dataIndex: "aceptante",
			...getColumnSearchProps("aceptante"),
		},		
		{
			title: "RUC",
			dataIndex: "rucAceptante",
			...getColumnSearchProps("rucAceptante"),
		},
		{
			title: "Nro. Documento",
			dataIndex: "nroDocumento",
			...getColumnSearchProps("nroDocumento"),
		},
		{
			title: "Fecha de Pago",
			dataIndex: "fechaPago",
			...getColumnSearchProps("fechaPago"),
		},
		{
			title: "Neto Confirmado",
			dataIndex: "netoConfirmado",
			...getColumnSearchProps("netoConfirmado"),
		},
        {
			title: "Fecha Confirmación",
			dataIndex: "fechaComunicacion",
			...getColumnSearchProps("fechaComunicacion"),            		
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
						></Button>								
					</>
				);
			},
		},
		{
			title: "Cavali",
			dataIndex: "cavali",
			...getColumnSearchProps("cavali"),
            render: (value) => {
                return (
					<Checkbox></Checkbox>                    
                );
            }		
		}		
	];

			
	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = respuestaPagador;
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
	function onPanelChange(value, mode) {
		console.log(value, mode);
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
						title="Respuesta Pagador"
						actions={[]}
						extra={
							<>
							 <Space>
								<Button								
									className="primary-b"
									type="primary"
									icon={<SaveOutlined  style={{ fontSize: '16px'}}/>}								
									onClick={confirm}
								>
								Guardar
								</Button>
								<Button								
									className="primary-b"
									type="primary"
									icon={<SendOutlined  style={{ fontSize: '16px'}}/>}								
									onClick={confirm}
								>
								Cavali
								</Button>
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
