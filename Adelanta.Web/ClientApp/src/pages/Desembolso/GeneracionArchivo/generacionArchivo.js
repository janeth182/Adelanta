import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, notification, Descriptions, Form, Upload } from "antd";
import { FileExcelOutlined, UploadOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { generacionArchivo } from "../../../model/mocks/generacionArchivo";
import { listarDocumentosDesembolso, documentosActualizarEstado } from "../../../services/documentoService";
import { ExportCSV } from '../../../utils/excel';
import { AuthContext } from "../../../context/authProvider";
import { estados, mensajeError } from "../../../utils/constant";
import { obtenerSolicitudDetalleLiquidacion } from "../../../services/solicitudService";
import { useFormik } from "formik";
import { ModalComponent } from "../../../components/modal/modal";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from "moment";
export const GeneracionArchivoPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { logoutUser, user } = useContext(AuthContext);
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [data, setData] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);
	const [detalleSolicitud, setDetalleSolicitud] = useState([]);
	const history = useHistory();
	function onChange(date, dateString) {
		console.log(date, dateString);
	}
	const columns = [
		{
			title: "Liquidación",
			dataIndex: "nroLiquidacion",
			...getColumnSearchProps("nroLiquidacion"),
			render: (text, _, index) => {
				return (
					<a type="primary" onClick={(v) => verDetalle(v, _.nroLiquidacion)}>
						{_.nroLiquidacion}
					</a>
				);
			},
		},
		{
			title: "Cedente",
			dataIndex: "cedente",
			...getColumnSearchProps("cedente"),
		},
		{
			title: "RUC",
			dataIndex: "rucCedente",
			...getColumnSearchProps("rucCedente"),
		},
		{
			title: "Monto desembolsado",
			dataIndex: "montoDesembolso",
			...getColumnSearchProps("montoDesembolso"),
		},
		{
			title: "Banco",
			dataIndex: "bancoCliente",
			...getColumnSearchProps("bancoCliente"),
		},
		{
			title: "Moneda",
			dataIndex: "monedaCliente",
			...getColumnSearchProps("monedaCliente"),
		},
		{
			title: "Nro Cuenta",
			dataIndex: "nroCuentaCliente",
			...getColumnSearchProps("nroCuentaCliente"),
		},
		{
			title: "CCI",
			dataIndex: "cciCliente",
			...getColumnSearchProps("cciCliente"),
		},
		{
			title: "Banco Adelanta",
			dataIndex: "bancoAdelanta",
			...getColumnSearchProps("bancoAdelanta"),
		},
		{
			title: "Moneda",
			dataIndex: "monedaAdelanta",
			...getColumnSearchProps("monedaAdelanta"),
		},
		{
			title: "Nro Cuenta",
			dataIndex: "nroCuentaAdelanta",
			...getColumnSearchProps("nroCuentaAdelanta"),
		},
		{
			title: "CCI",
			dataIndex: "cciAdelanta",
			...getColumnSearchProps("cciAdelanta"),
		},
		{
			title: "Generar Archivo",
			dataIndex: "idDocumento",
			render: (_, record) => {
				return (
					<>
						<Checkbox
							name={"archivo"}
							value={record.idDocumento}
						></Checkbox>
					</>
				);
			},
		},
		{
			title: "Confirmar",
			dataIndex: "idDocumento",
			render: (_, record) => {
				return (
					<>
						<Checkbox
							name={"liquidacion"}
							value={record.idDocumento}
						></Checkbox>
					</>
				);
			},
		}
	];
	const columsDetalle = [
		{
			title: "Nro. Factura",
			dataIndex: "serie",
		},
		{
			title: "Fecha Pago",
			dataIndex: "fechaPago",
		},
		{
			title: "F. resguardo",
			dataIndex: "fondoResguardo",
		},
		{
			title: "Monto Pago",
			dataIndex: "montoTotalVenta",
		},
		{
			title: "Intereses",
			dataIndex: "interesesIGV",
		},
		{
			title: "Gastos",
			dataIndex: "gastosIGV",
		},
		{
			title: "Desembolso",
			dataIndex: "montoDesembolso",
		},
	];
	const formik = useFormik({
		initialValues: {
			nroLiquidacion: '',
			fechaOperacion: '',
			idSolicitud: '',
			cedente: '',
			aceptante: '',
			tipoOperacion: '',
			tasaNominalMensual: 0,
			tasaNominalAnual: 0,
			financiamiento: 0,
			fondoResguardo: 0,
			cantidadDocumentos: 0,
			contrato: 0,
			comisionCartaNotarial: 0,
			serie: '',
			moneda: '',
			montoTotalImpuesto: 0,
			montoOperacion: 0,
			montoTotalVenta: 0,
			bancoCliente: '',
			nroCuenta: '',
			fechaDesembolso: '',
			idBanco: 0,
			idCuentaCliente: 0,
			bancoAdelanta: '',
			nroCuentaAdelanta: '',
			cciAdelanta: ''
		},
	});
	const cargarDatos = async () => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				let data = new FormData();
				data.append("usuario", 'admin');
				const rpta = await listarDocumentosDesembolso(data);
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
	useEffect(() => {
		cargarDatos();
	}, []);

	const confirm = async () => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			const cantidadControles = document.getElementsByName("liquidacion").length;
			try {
				debugger
				const lista = [];
				for (let i = 0; i < cantidadControles; i++) {
					if (document.getElementsByName("liquidacion")[i].checked) {
						const documento = {
							idDocumento: document.getElementsByName("liquidacion")[i].value,
							estado: estados.COMFIRMAR_DESEMBOLSO,
							usuario: user.usuario
						};
						lista.push(documento);
					}
				}
				let data = new FormData();
				data.append("json", JSON.stringify(lista));
				const rpta = await documentosActualizarEstado(data);
				if (rpta.status === 204) {
					cargarDatos();
					for (let i = 0; i < cantidadControles; i++) {
						if (document.getElementsByName("liquidacion")[i].checked) {
							document.getElementsByName("liquidacion")[i].click();
						}
					}
					notification['success']({
						message: 'Se proceso correctamente',
						description:
							'Los documentos enviados han si actualizados correctamente.',
					});
					setLoadingApi(false);
				} else {
					setLoadingApi(false);
				}
			} catch (error) {
				setLoadingApi(false);
				notification['error']({
					message: 'Error en el proceso',
					description:
						mensajeError.GENERAL,
				});
			}
		})();
		return () => {
			suscribe = false;
		};
	}
	const verDetalle = async (v, nroLiquidacion) => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = await obtenerSolicitudDetalleLiquidacion(nroLiquidacion);
				debugger
				if (suscribe) {
					console.log(rpta);
					formik.initialValues.nroLiquidacion = rpta.data.nroLiquidacion;
					formik.initialValues.cedente = rpta.data.cedente;
					formik.initialValues.aceptante = rpta.data.aceptante;
					formik.initialValues.tipoOperacion = rpta.data.tipoOperacion;
					formik.initialValues.tasaNominalMensual = rpta.data.tasaNominalMensual;
					formik.initialValues.tasaNominalAnual = rpta.data.tasaNominalAnual;
					formik.initialValues.financiamiento = rpta.data.financiamiento;
					formik.initialValues.fondoResguardo = rpta.data.fondoResguardo;
					formik.initialValues.cantidadDocumentos = rpta.data.cantidadDocumentos;
					formik.initialValues.contrato = rpta.data.contrato;
					formik.initialValues.comisionCartaNotarial = rpta.data.comisionCartaNotarial;
					formik.initialValues.serie = rpta.data.serie;
					formik.initialValues.moneda = rpta.data.moneda;
					formik.initialValues.montoTotalImpuesto = rpta.data.montoTotalImpuesto;
					formik.initialValues.montoOperacion = rpta.data.montoOperacion;
					formik.initialValues.montoTotalVenta = rpta.data.montoTotalVenta;
					formik.initialValues.servicioCobranza = rpta.data.servicioCobranza;
					formik.initialValues.servicioCustodia = rpta.data.servicioCustodia;
					formik.initialValues.comisionEstructuracion = rpta.data.comisionEstructuracion;
					formik.initialValues.ejecutivoComercial = rpta.data.ejecutivoComercial;
					formik.initialValues.fechaOperacion = rpta.data.fechaOperacion;
					formik.initialValues.bancoCliente = rpta.data.bancoCliente;
					formik.initialValues.nroCuenta = rpta.data.nroCuenta;
					formik.initialValues.fechaDesembolso = rpta.data.fechaDesembolso;
					formik.initialValues.idCuenta = rpta.data.idCuenta;
					formik.initialValues.idCuentaCliente = rpta.data.idCuentaCliente;
					formik.initialValues.bancoAdelanta = rpta.data.bancoAdelanta;
					formik.initialValues.nroCuentaAdelanta = rpta.data.nroCuentaAdelanta;
					formik.initialValues.cciAdelanta = rpta.data.cciAdelanta;
					setDetalleSolicitud(rpta.data.detalle);
					showModal();
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
	const guardarDetalle = async () => {
		notification['success']({
			message: 'Se proceso correctamente',
			description:
				'Los documentos enviados han si actualizados correctamente.',
		});
	}
	const generarArchivo = async () => {
		const columns = document.getElementsByName("archivo");
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const wsData = [];
		const cabecera = [
			'Cedente',
			'RUC',
			'Documento',
			'Aceptante',
			'Desembolso',
			'Banco Depósito',
			'Moneda Depósito',
			'Cuenta de Depósito',
			'CCI Depósito',
			'Banco de cargo',
			'Moneda',
			'Cuenta de Cargo'
		];
		wsData.push(cabecera);
		for (let p = 0; p < columns.length; p++) {
			debugger
			if (columns[p].checked === true) {
				for (let i = 0; i < data.length; i++) {
					if (+columns[p].value === data[i].idDocumento) {
						const fila = [
							data[i].cedente,
							data[i].rucCedente,
							data[i].documento,
							data[i].aceptante,
							data[i].montoDesembolso,
							data[i].bancoCliente,
							data[i].monedaCliente,
							data[i].nroCuentaCliente,
							data[i].cciCliente,
							data[i].bancoAdelanta,
							data[i].monedaAdelanta,
							data[i].nroCuentaAdelanta
						];
						wsData.push(fila);
					}
				}
			}
		}

		const ws = XLSX.utils.aoa_to_sheet(wsData);
		let wscols = [];
		for (let i = 0; i < cabecera.length; i++) {
			wscols.push({ wch: cabecera[i].length + 5 })
		}
		ws["!cols"] = wscols;
		const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const dataExcel = new Blob([excelBuffer], { type: fileType });

		const now = moment();
		const formatNow = moment(now).format('DDMMYYYYHHmmss');
		const fileName = `Desembolso_${formatNow}.xlsx`;
		FileSaver.saveAs(dataExcel, fileName);
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
						title="Generación Archivos"
						actions={[]}
						extra={
							<>
								<Space>
									<Button
										className="primary-b"
										type="primary"
										icon={<FileExcelOutlined style={{ fontSize: '16px' }} />}
										onClick={generarArchivo}
									>
										Generar Archivo
									</Button>
									<Button
										className="primary-b"
										type="primary"
										icon={<FileExcelOutlined style={{ fontSize: '16px' }} />}
										onClick={confirm}
									>
										Confirmar
									</Button>
									<ExportCSV csvData={generacionArchivo.data} fileName={'GeneracionArchivo'} />
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
			<ModalComponent
				title="Detalle de desembolso"
				onClose={hiddenModal}
				show={isModal}
				width={1000}
				footer={[
					<Button className="primary-b" type="primary" onClick={guardarDetalle}>
						Guardar
					</Button>,
					<Button className="primary-b" type="primary" onClick={hiddenModal}>
						Salir
					</Button>,
				]}
			>
				<Form layout="vertical" className="ant-advanced-search-form">
					<Descriptions title="Datos Principales">
						<Descriptions.Item label="Liquidación" span={2}>
							{formik.values.nroLiquidacion}
						</Descriptions.Item>
						<Descriptions.Item label="Moneda" span={2}>
							{formik.values.moneda}
						</Descriptions.Item>
						<Descriptions.Item label="Cedente" span={3}>
							{formik.values.cedente}
						</Descriptions.Item>
						<Descriptions.Item label="Pagador" span={2}>
							{formik.values.aceptante}
						</Descriptions.Item>
					</Descriptions>
					<Descriptions title="Cuenta Cliente">
						<Descriptions.Item label="Banco" span={1}>
							{formik.values.bancoCliente}
						</Descriptions.Item>
						<Descriptions.Item label="Nro Cuenta" span={1}>
							{formik.values.nroCuenta}
						</Descriptions.Item>
						<Descriptions.Item label="Fecha desembolso" span={1}>
							{formik.values.fechaDesembolso}
						</Descriptions.Item>
					</Descriptions>
					<Descriptions title="Cuenta Adelanta">
						<Descriptions.Item label="Banco" span={1}>
							{formik.values.bancoAdelanta}
						</Descriptions.Item>
						<Descriptions.Item label="Nro Cuenta" span={1}>
							{formik.values.nroCuentaAdelanta}
						</Descriptions.Item>
						<Descriptions.Item label="CCI" span={1}>
							{formik.values.cciAdelanta}
						</Descriptions.Item>
					</Descriptions>
					<Descriptions title="Adjuntar Evidencia">
						<Descriptions.Item label="Selecione archivo" span={1}>
							<Upload>
								<Button icon={<UploadOutlined />} size={'small'}>Adjuntar archivo</Button>
							</Upload>
						</Descriptions.Item>
					</Descriptions>
					<Descriptions title="Facturas"></Descriptions>
					<Table
						loading={loadingApi}
						columns={columsDetalle}
						dataSource={detalleSolicitud}
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
