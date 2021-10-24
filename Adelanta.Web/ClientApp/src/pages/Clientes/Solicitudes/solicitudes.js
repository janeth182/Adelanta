import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Divider, Switch, Radio, Form, Select, Descriptions  } from "antd";
import { PlusSquareOutlined, RetweetOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { solicitudes }from "../../../model/mocks/solicitudes";
import { desembolsado }from "../../../model/mocks/desembolsado";
import { InputComponent } from "../../../components/formControl.js/input";
import { SelectComponent } from "../../../components/formControl.js/select";
import { useFormik } from "formik";
import { ModalComponent } from "../../../components/modal/modal";
import * as Yup from "yup";
const { Option } = Select;
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
            render: (value) => {
				return (
					<a type="primary" onClick={showModal}>
                    {value}
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
			title: "Importe",
			dataIndex: "importe",
			...getColumnSearchProps("importe"),
		},
        {
			title: "Moneda",
			dataIndex: "moneda",
			...getColumnSearchProps("moneda"),
		},
		{
			title: "Estado",
			dataIndex: "estado",
			...getColumnSearchProps("estado"),
            render: (value) => {
                return (
                    <Tag color={value === "Desembolso" ? "blue" : "red"} rou>
                        {value}
                    </Tag>
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

    const formik = useFormik({
		initialValues: {
			nombre: "",
			edad: "",
			direccion: "",
			sexo: "",
			estado: true,
			civil: "Soltero",
		},
		validationSchema: Yup.object().shape({
			nombre: Yup.string().required("El campo es requerido"),
			edad: Yup.string().required("El campo es requerido"),
			direccion: Yup.string().required("El campo es requerido"),
			sexo: Yup.string().required("El campo es requerido"),
			estado: Yup.boolean(),
			civil: Yup.string(),
		}),
		onSubmit: (value) => {
			handleNewUsuario(value);
		},
	});

	const handleFormatColumns = (dataArray = []) => {
		const data = dataArray.reduce((ac, el) => {
			ac.push({
				...el
			});
			return ac;
		}, []);
		setDataUsuario(data);
	};
    const handleNewUsuario = async (value) => {
		hiddenModal();
		await addMessage({
			type: "success",
			text: "Registro Existoso",
			description: "El usuario se registro correctamente",
		});
		console.log(value);
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
									history.push("/clientes/nueva-solicitud")
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
                        <Descriptions.Item label="Pagador" span={1}>Rimac</Descriptions.Item>
                        <Descriptions.Item label="Tipo de Operación" span={1}>Factoring</Descriptions.Item>                                                                                                                 
                    </Descriptions>             
                    <Descriptions title="Datos Adicionales">
                        <Descriptions.Item label="Fecha de Operacion" span={1}>22/09/2021</Descriptions.Item>
                        <Descriptions.Item label="TNM Op" span={1}>2.000%</Descriptions.Item>
                        <Descriptions.Item label="TNA Op" span={1}>24.00%</Descriptions.Item>
                        <Descriptions.Item label="Ejecutivo" span={1}>Gabriel Arredondo</Descriptions.Item>
                        <Descriptions.Item label="Financiamiento" span={1}>90%</Descriptions.Item>
						<Descriptions.Item label="F. Resguardo" span={1}>10%</Descriptions.Item>
						<Descriptions.Item label="Tipo de Cliente" span={1}>Recurrente</Descriptions.Item>
						<Descriptions.Item label="Com. Estructura" span={1}>0</Descriptions.Item>
						<Descriptions.Item label="Cant. Doc." span={1}>0</Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="Desembolsado">
                    	<Descriptions.Item label="Banco" span={1}>Interbak</Descriptions.Item>
                        <Descriptions.Item label="Nro Cuenta" span={1}>19707814852122</Descriptions.Item>
                        <Descriptions.Item label="Fecha desembolso" span={1}>26/09/2021</Descriptions.Item>                        
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
