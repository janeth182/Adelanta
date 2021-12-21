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
import { listarDocumentos, documentosActualizarEstado } from "../../../services/documentoService";
import { estados, mensajeError } from "../../../utils/constant";
export const AprobacionDesembolsoPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [data, setData] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);
	const history = useHistory();
	const columns = [
		{
			title: "Liquidación",
			dataIndex: "nroLiquidacion",
			...getColumnSearchProps("pagador"),
			render: (_, record) => {
				return (
					<a type="primary" onClick={showModal}>
						{record.nroLiquidacion}
					</a>
				);
			},
		},
		{
			title: "Solicitud",
			dataIndex: "idSolicitud",
			...getColumnSearchProps("idSolicitud"),
		},
		{
			title: "Cliente",
			dataIndex: "pagador",
			...getColumnSearchProps("pagador"),
		},
		{
			title: "RUC",
			dataIndex: "rucPagador",
			...getColumnSearchProps("rucPagador"),
		},
		{
			title: "Aceptante",
			dataIndex: "proveedor",
			...getColumnSearchProps("proveedor"),
		},
		{
			title: "RUC",
			dataIndex: "rucProveedor",
			...getColumnSearchProps("rucProveedor"),
		},
		{
			title: "Nro. Documento",
			dataIndex: "serie",
			...getColumnSearchProps("serie"),
		},
		{
			title: "Moneda",
			dataIndex: "moneda",
			...getColumnSearchProps("moneda"),
		},
		{
			title: "F. Pago Confirmado",
			dataIndex: "fechaPago",
		},
		{
			title: "Neto Confirmado",
			dataIndex: "netoConfirmado",
		},
		{
			title: "T. Operación",
			dataIndex: "tipoOperacion",
			...getColumnSearchProps("tipoOperacion"),
		},
		{
			title: "Aprobar.",
			dataIndex: "tipoOperacion",
			render: (_, record) => {
				return (
					<>
						<Checkbox
							onChange={onChangeChecked}
							name={"liquidacion"}
							value={record.idDocumento}
						></Checkbox>
					</>
				);
			},
		},
	];
	const cargarDatos = async () => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = await listarDocumentos(estados.CONFIRMAR_APROBACION);
				if (rpta.status === 200) {
					console.log(rpta.data);
					setData(rpta.data);
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
	}
	function onChangeChecked(e) {
		console.log(`checked = ${JSON.stringify(e.target)}`);
	}

	useEffect(() => {
		cargarDatos();
	}, []);

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
				style={{ backgroundcolor: '#f0f2f5' }}
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
										icon={<CheckCircleOutlined style={{ fontSize: '16px' }} />}
										onClick={confirm}
									>
										Aprobar
									</Button>
									<ExportCSV csvData={aprobacionDeselmbolso.data} fileName={'AprobacionDesembolso'} />
								</Space>
							</>
						}
					>
						<Table
							loading={loadingApi}
							columns={columns}
							dataSource={data}
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
