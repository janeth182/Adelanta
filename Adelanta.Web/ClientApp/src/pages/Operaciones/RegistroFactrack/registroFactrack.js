import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, message, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuesta }from "../../../model/mocks/registroFactrack";
import { ExportCSV } from '../../../utils/excel';
const { Option } = Select;

export const RegistroFactrackPage = () => {
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
			title: "RUC Cliente",
			dataIndex: "ruc",
			...getColumnSearchProps("ruc"),   	
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
			title: "%Tasa",
			dataIndex: "tasa",
			...getColumnSearchProps("tasa"),
		},
        {
			title: "%F. resguardo",
			dataIndex: "fResguardo",
			...getColumnSearchProps("fResguardo"),
		},
		{
			title: "Fecha de Pago",
			dataIndex: "fechaPago",
			...getColumnSearchProps("fechaPago")			
		},
		{
			title: "Pendiente Pago",
			dataIndex: "pendientePago",
			...getColumnSearchProps("pendientePago"),	
		},
        {
			title: "Pendiente confirmado",
			dataIndex: "pendienteConfirmado",
			...getColumnSearchProps("pendienteConfirmado"),	
		},
        {
			title: "Fondo resguardo",
			dataIndex: "fondeResguardo",
			...getColumnSearchProps("fondeResguardo"),	
		},
		{
			title: "Cavali",
			dataIndex: "cavali",
            render: (value) => {
                return (
					<Checkbox></Checkbox>                    
                );
            }		
		},
        {
			title: "FacTrack",
			dataIndex: "netoConfirmado",
            render: (value) =>{
                return (
                    <Select defaultValue="-1" style={{ width: 120 }}>
                        <Option value="-1">Seleccione ...</Option>
                        <Option value="0">No</Option>
                        <Option value="1">Si</Option>
                    </Select>
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
						title="Registro Factrack"
						actions={[]}
						extra={
							<>
							 <Space>							
								<Button								
									className="primary-b"
									type="primary"
									icon={<SendOutlined  style={{ fontSize: '16px'}}/>}								
									onClick={confirm}
								>
								Confirmar
								</Button>
                                <ExportCSV csvData={respuesta.data} fileName={'registroFactrack'} /> 
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
