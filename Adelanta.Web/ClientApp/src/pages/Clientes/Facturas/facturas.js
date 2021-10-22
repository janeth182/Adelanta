import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Divider, Switch, Radio, Form, Select, Input, message, Popconfirm } from "antd";
import { FilePdfOutlined , FileExcelOutlined   } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { listarUsuarios } from "../../../services/usuariosService";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { facturas }from "../../../model/mocks/facturas"

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
                    <FilePdfOutlined style={{ fontSize: '20px', color: 'red'}}/>				                      
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
							<Button																
								type="primary"
                                style={{background:'#389e0d'}}
								icon={<FileExcelOutlined  style={{ fontSize: '16px'}}/>}								
								onClick={() =>
									history.push("/editar-usuario/0", 0)
								}
							>
							Exportar
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
