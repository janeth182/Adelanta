import { useState, useEffect } from "react";
import { PageHeader, Row, Col, Card, Table, Space,Checkbox} from "antd";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuesta }from "../../../model/mocks/checkList";
import { ExportCSV } from '../../../utils/excel';
export const CheckListPage = () => {	
	const { isMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);	
	const [dataUsuario, setDataUsuario] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);	
	const columns = [
        {
			title: "Nro. Solicitud",
			dataIndex: "idSolicitud",
			...getColumnSearchProps("idSolicitud"),
		},	
		{
			title: "Cliente",
			dataIndex: "cliente",
			width:200,			
			...getColumnSearchProps("cliente"),
		},	       
        {
			title: "RUC Cliente",
			dataIndex: "rucCliente",
			...getColumnSearchProps("RucCliente"),   	
		},
        {
			title: "Aceptante",
			dataIndex: "aceptante",
			...getColumnSearchProps("aceptante"),   	
		},
        {
			title: "RUC Aceptante",
			dataIndex: "rucAceptante",
			...getColumnSearchProps("rucAceptante"),   	
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
			title: "Monto",
			dataIndex: "monto",
			...getColumnSearchProps("monto"),   	
		},
		{
			title: "%Tasa",
			dataIndex: "perTasa",
			...getColumnSearchProps("perTasa"),   	
		},
		{
			title: "%F.Resguardo",
			dataIndex: "perFResguardo",
			...getColumnSearchProps("perFResguardo"),   	
		},
		{
			title: "Fecha de pago",
			dataIndex: "fechaPago",
			...getColumnSearchProps("fechaPago"),   	
		},
		{
			title: "Pendiente de pago",
			dataIndex: "pendientePago",
			...getColumnSearchProps("pendientePago"),   	
		},
		{
			title: "Pendiente confirmado",
			dataIndex: "pendienteConfirmado",
			...getColumnSearchProps("pendienteConfirmado"),   	
		},
		{
			title: "Fondo de resguardo",
			dataIndex: "fondoResguardo",
			...getColumnSearchProps("fondoResguardo"),   	
		},
		{
			title: "Tipo de operación",
			dataIndex: "tipoOperacion",
			...getColumnSearchProps("tipoOperacion"),   	
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
		},
		{
			title: "Check List",
			dataIndex: "checklist",
			...getColumnSearchProps("checklist"),
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
						title="Check List Registrados"
						actions={[]}
						extra={
							<>
							 <Space>								
                                <ExportCSV csvData={respuesta.data} fileName={'GeneracionArchivo'} />  
							 </Space>							
							</>						
						}
					>	
						<Table
							loading={loadingApi}
							columns={columns}
							dataSource={dataUsuario}
							size="large"
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
