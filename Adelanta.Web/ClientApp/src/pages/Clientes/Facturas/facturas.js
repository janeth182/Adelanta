import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Space} from "antd";
import { FilePdfOutlined , FileTextOutlined   } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { facturas }from "../../../model/mocks/facturas"
import { ExportCSV } from '../../../utils/excel';
import MyPDF from '../../../file/FACTURAE001-32.pdf';
import MyXML from '../../../file/20514535222-01-F001-00004348.xml';
export const FacturasPage = () => {
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
			title: "Nro. Factura",
			dataIndex: "idFactura",
			...getColumnSearchProps("idFactura"),
		},
        {
			title: "Nro. Liquidación",
			dataIndex: "nroLiquidacion",
			...getColumnSearchProps("nroLiquidacion"),
		},
        {
			title: "Fecha de Emisión",
			dataIndex: "fechaEmision",
			...getColumnSearchProps("fechaEmision"),
		},       
		{
			title: "Importe Sin IGV",
			dataIndex: "importeSinIGV",
			...getColumnSearchProps("importeSinIGV"),
		},		
		{
			title: "IGV",
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
					<Tag color={value === "Pagada" ? "green" : "red"} rou>
						{value}
					</Tag>
				);
			}			
		},
        {
			title: "Descargar Factura",
			dataIndex: "archivoFactura",
            render: () => {
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
		},
	];

	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = facturas;
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

	const exportarExcel = (e) => {
		alert('export')
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
						title="Facturas"
						actions={[]}
						extra={
							<ExportCSV csvData={dataUsuario} fileName={'Facturas'} />                           
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
