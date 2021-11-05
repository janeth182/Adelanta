import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, message, Input, DatePicker } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { generacionArchivo }from "../../../model/mocks/generacionArchivo";
import moment from 'moment';
import { ExportCSV } from '../../../utils/excel';
export const GeneracionArchivoPage = () => {
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
			title: "Monto desembolsado",
			dataIndex: "montoDesembolso",
			...getColumnSearchProps("montoDesembolso"),
		},
		{
			title: "Banco",
			dataIndex: "banco",
			...getColumnSearchProps("banco"),
		},
        {
			title: "Moneda",
			dataIndex: "moneda",
			...getColumnSearchProps("moneda"),
		},	
        {
			title: "Nro Cuenta",
			dataIndex: "nroCuenta",
			...getColumnSearchProps("moneda"),
		},
        {
			title: "CCI",
			dataIndex: "cci",
			...getColumnSearchProps("cci"),
		},	
		{
			title: "Generar Archivo",
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
				const rpta = generacionArchivo;
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
						title="Generación Archivos"
						actions={[]}
						extra={
							<>
							 <Space>
								<Button								
									className="primary-b"
									type="primary"
									icon={<FileExcelOutlined style={{ fontSize: '16px'}}/>}								
									onClick={confirm}
								>
								Generar Archivo
								</Button>
                                <ExportCSV csvData={generacionArchivo} fileName={'GeneracionArchivo'} />  
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
