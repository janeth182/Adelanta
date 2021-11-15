import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, message, Tag } from "antd";
import { FileExcelOutlined, FileTextOutlined, FilePdfOutlined, DeleteOutlined  } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { generacionArchivo }from "../../../model/mocks/consultaFacturas";
import { ExportCSV } from '../../../utils/excel';
import MyPDF from '../../../file/FACTURAE001-32.pdf';
import MyXML from '../../../file/20514535222-01-F001-00004348.xml';
export const ConsultaFacturasPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);	
	const [dataUsuario, setDataUsuario] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);	
	const history = useHistory();
	const columns = [
        {
			title: "Nro. Factura",
			dataIndex: "nroFactura",
			...getColumnSearchProps("nroFactura"),
		},	
		{
			title: "Nro. Liquidación",
			dataIndex: "nroLiquidacion",
			...getColumnSearchProps("nroLiquidacion"),
		},	       
        {
			title: "Fecha Emisión",
			dataIndex: "fechaEmision",
			...getColumnSearchProps("fechaEmision"),   	
		},
        {
			title: "Descripción",
			dataIndex: "descripcion",
			...getColumnSearchProps("descripcion"),   	
		},
        {
			title: "Importe Sin IGV",
			dataIndex: "importeSinIGV",
			...getColumnSearchProps("importeSinIGV"),   	
		},
        {
			title: "% IGV",
			dataIndex: "igv",
			...getColumnSearchProps("igv"),   	
		},
        {
			title: "Total",
			dataIndex: "total",
			...getColumnSearchProps("total"),   	
		},
        {
			title: "Estado",
			dataIndex: "estado",
			...getColumnSearchProps("estado"),
            render: (value) => {
				return (
					<Tag color={value === "Cobrada" ? "green" : "red"} rou>
						{value}
					</Tag>
				);
			}
		},
        {
			title: "Descargar",
			dataIndex: "documento",
			...getColumnSearchProps("documento"),            
            render: (_, record) => {
                if(record.estado ==='Cobrada'){
                    return (
                        <>
                        <Space>
                        <Button type="link" href={MyPDF}  download="FACTURAE001-32.pdf" danger icon={<FilePdfOutlined style={{ fontSize: '16px', color: 'red'}} />}>
                        PDF
                        </Button>
                        <Button type="link" href={MyXML} download="20514535222-01-F001-00004348.xml" info icon={<FileTextOutlined  style={{ fontSize: '16px', color: 'blue'}}/>} >
                        XML
                        </Button>							                      
                        </Space>                    
                        </>
                    );
                }               
            }  	
		},
		{
			title: "Cancelar Factura",
			dataIndex: "cavali",
			...getColumnSearchProps("cavali"),
            render: (_, record) => {
                if(record.estado !=='Cobrada'){
                    return (
                        <Checkbox></Checkbox>                    
                    );
                }              
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
						title="Consulta de Facturas"
						actions={[]}
						extra={
							<>
							 <Space>
								<Button								
									className="primary-b"
									type="primary"
									icon={<DeleteOutlined  style={{ fontSize: '16px'}}/>}								
									onClick={confirm}
								>
								Cancelar Factura
								</Button>
                                <ExportCSV csvData={generacionArchivo.data} fileName={'GeneracionArchivo'} />  
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
