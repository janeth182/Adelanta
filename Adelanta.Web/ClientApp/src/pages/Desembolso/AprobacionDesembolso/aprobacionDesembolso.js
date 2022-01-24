import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, notification, Descriptions, Form, Select } from "antd";
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
import { useFormik } from "formik";
import { obtenerSolicitudDetalleLiquidacion } from "../../../services/solicitudService";
import { crearDesembolso } from "../../../services/desembolsoService";
import { AuthContext } from "../../../context/authProvider";
const { Option } = Select;
export const AprobacionDesembolsoPage = () => {
	const { isModal, showModal, hiddenModal } = useModal();
	const { isMessage, addMessage, messageInfo } = useMessageApi();
	const { logoutUser, user } = useContext(AuthContext);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [data, setData] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);
	const [nroLiquidacion, setNumeroLiquidacion] = useState();
	const [idCuentaCliente, setIdCuentaCliente] = useState();
	const [idCuenta, setIdCuenta] = useState(0);
	const history = useHistory();
	const [detalleSolicitud, setDetalleSolicitud] = useState([]);
	const [idDesembolso, setIdDesembolso] = useState([]);
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
			nroCuentaAdelanta: ''
		},
	});
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
			dataIndex: "proveedor",
			...getColumnSearchProps("proveedor"),
		},
		{
			title: "RUC",
			dataIndex: "rucPagador",
			...getColumnSearchProps("rucPagador"),
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
			title: "Intereses Inc. IGV",
			dataIndex: "interesesIGV",
			...getColumnSearchProps("interesesIGV"),
		},
		{
			title: "Gastos Inc. IGV",
			dataIndex: "gastosIGV",
			...getColumnSearchProps("interesesIGV"),
		},
		{
			title: "Monto Desembolsado",
			dataIndex: "montoDesembolso",
			...getColumnSearchProps("montoDesembolso"),
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
					console.log(rpta.data);
					setDetalleSolicitud(rpta.data.detalle);
					setNumeroLiquidacion(nroLiquidacion);
					setIdCuenta(rpta.data.idCuenta);
					setIdCuentaCliente(rpta.data.idCuentaCliente)
					setLoadingApi(false);
					setIdDesembolso(rpta.data.idDesembolso)
					showModal();
					console.log(idCuenta);
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

	const confirm = async (e) => {
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
							estado: estados.APROBAR_DESEMBOLSO,
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
	const guardarDetalle = async () => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				let rpta = '';
				const desembolso = {
					'NroLiquidacion': nroLiquidacion,
					'IdCuenta': idCuenta,
					'IdCuentaCliente': idCuentaCliente,
					'UsuarioCreado': user.usuario,
					'IdDesembolso': idDesembolso
				};
				rpta = await crearDesembolso(desembolso);
				if (rpta.status === 201) {
					if (suscribe) {
						notification['success']({
							message: 'Se proceso correctamente',
							description:
								'Se actualizado correctamente.',
						});
						setLoadingApi(false);
						hiddenModal();
					}
				} else {
					notification['error']({
						message: 'Error en el proceso',
						description:
							mensajeError.GENERAL,
					});
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
							<Select value={`${idCuenta}`}
								style={{ width: 420 }}
								size={'small'}
								onChange={value => setIdCuenta(value)}
							>
								<Option value="0">Seleccione una cuenta ...</Option>
								<Option value="1">BBVA - SOLES - Nro: 123456789123 - CCI: 123456789123</Option>
								<Option value="2">BCP - DOLARES - Nro: 123456789123 - CCI: 123456789123</Option>
							</Select>
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
