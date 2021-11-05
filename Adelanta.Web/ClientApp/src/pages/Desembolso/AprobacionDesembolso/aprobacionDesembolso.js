import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, message, Descriptions, Form } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { aprobacionDeselmbolso } from "../../../model/mocks/aprobacionDesembolso";
import { ExportCSV } from '../../../utils/excel';
import { ModalComponent } from "../../../components/modal/modal";
import { desembolsado }from "../../../model/mocks/desembolsado";
export const AprobacionDesembolsoPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);	
	const [dataUsuario, setDataUsuario] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);	
	const history = useHistory();	
	function onChange(date, dateString) {
		console.log(date, dateString);
	}
	const columns = [
		{
			title: "Nro. Liquidación",
			dataIndex: "nroLiquidacion",
			...getColumnSearchProps("nroLiquidacion"),
            render: (_, record) => {
				return (
                    <a type="primary" onClick={showModal}>
                    {record.nroLiquidacion}
                    </a>
                );
			}	
		},	
		{
			title: "Aceptante",
			dataIndex: "aceptante",
			...getColumnSearchProps("aceptante"),
		},
        {
			title: "Nro. Documento",
			dataIndex: "nroDocumento",
			...getColumnSearchProps("nroDocumento"),   	
		},
        {
			title: "Moneda",
			dataIndex: "moneda",
			...getColumnSearchProps("moneda"),
		},
		{
			title: "Fecha de Pago",
			dataIndex: "fechaPago",
			...getColumnSearchProps("fechaPago"),
		},		
		{
			title: "Monto Neto",
			dataIndex: "montoNeto",
			...getColumnSearchProps("montoNeto"),
		},
		{
			title: "Intereses Inc. IGV",
			dataIndex: "interesIGV",
			...getColumnSearchProps("interesIGV"),
		},
        {
			title: "Gatos Inc. IGV",
			dataIndex: "gatosIGV",
			...getColumnSearchProps("gatosIGV"),
		},
        {
			title: "Monto desembolsado",
			dataIndex: "montoDesembolso",
			...getColumnSearchProps("montoDesembolso"),
		},
		{
			title: "Aprobado",
			dataIndex: "Aprobado",
			...getColumnSearchProps("Aprobado"),
            render: (value) => {
                return (
					<Checkbox></Checkbox>                    
                );
            }		
		}		
	];
	const columsLiquidacion = [
		{
			title: "Documento",
			dataIndex: "nroDocumento",
			...getColumnSearchProps("nroDocumento"),
		},	
		{
			title: "Fecha de Pago",
			dataIndex: "fechaPago",
			...getColumnSearchProps("fechaPago"),
		},
		{
			title: "Monto de Pago",
			dataIndex: "montoPago",
			...getColumnSearchProps("montoPago"),
		},
		{
			title: "F. Resguardo",
			dataIndex: "fResguardo",
			...getColumnSearchProps("fResguardo"),
		},
		{
			title: "Monto Neto",
			dataIndex: "montoNeto",
			...getColumnSearchProps("montoNeto"),
		},
		{
			title: "Intereses",
			dataIndex: "intereses",
			...getColumnSearchProps("intereses"),
		},
		{
			title: "Gastos",
			dataIndex: "gastos",
			...getColumnSearchProps("gastos"),
		},
		{
			title: "Desembolso",
			dataIndex: "desembolso",
			...getColumnSearchProps("desembolso"),
		},
	]
			
	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = aprobacionDeselmbolso;
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
						title="Aprobación de desembolso"
						actions={[]}
						extra={
							<>
							 <Space>
								<Button								
									className="primary-b"
									type="primary"
									icon={<CheckCircleOutlined style={{ fontSize: '16px'}}/>}								
									onClick={confirm}
								>
								Aprobar
								</Button>
                                <ExportCSV csvData={aprobacionDeselmbolso} fileName={'AprobacionDesembolso'} />  
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
            <ModalComponent
				title="Liquidación"
				onClose={hiddenModal}
				show={isModal}				
                width={1000}	
				footer={[
					<Button	className="primary-b" type="primary" onClick={hiddenModal} > 
					Salir
					</Button>
				]}			 
			>
				<Form layout="vertical"  className="ant-advanced-search-form">
                    <Descriptions title="Datos Principales">
                        <Descriptions.Item label="Liquidacion" span={1}>LIQ-0004-2021</Descriptions.Item>
                        <Descriptions.Item label="Moneda" span={1}>Soles</Descriptions.Item>
                        <Descriptions.Item label="Cedente" span={1}>ISI Group S.A.C</Descriptions.Item>
                        <Descriptions.Item label="Aceptante" span={1}>Rimac</Descriptions.Item>                                                                                                                        
                    </Descriptions>     
                    <Descriptions title="Desembolsado">   
                        <Descriptions.Item label="Banco" span={1}>BBVA</Descriptions.Item>
                        <Descriptions.Item label="Nro Cuenta" span={1}>190078147852122</Descriptions.Item>
                        <Descriptions.Item label="Fecha desembolso" span={1}>15/11/2021</Descriptions.Item>                                                                                                             
                    </Descriptions>                                                 
                    <Table
						loading={loadingApi}
						columns={columsLiquidacion}
						dataSource={desembolsado.data}
						size="small"
						pagination={{
							current: page,
							pageSize: pageSize,
							onChange: (page, pageSize) => {
								setPage(page);
								setPageSize(pageSize);
							},
						}}
					/>
				</Form>
			</ModalComponent>          
		</ContentComponent>
	);
};
