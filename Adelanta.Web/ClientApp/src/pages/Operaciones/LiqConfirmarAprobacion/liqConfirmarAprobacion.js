import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, notification, Descriptions, Form, Upload } from "antd";
import { LikeOutlined, UploadOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { listarDocumentos, documentosActualizarEstado } from "../../../services/documentoService";
import { estados, mensajeError } from "../../../utils/constant";
import { obtenerSolicitudDetalleLiquidacion } from "../../../services/solicitudService";
import { AuthContext } from "../../../context/authProvider";
import { useFormik } from "formik";
import { ModalComponent } from "../../../components/modal/modal";
export const LiqConfirmarAprobacionPage = () => {
    const { logoutUser, user } = useContext(AuthContext);
    const { isModal, showModal, hiddenModal } = useModal();
    const { isMessage, addMessage, messageInfo } = useMessageApi();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [loadingApi, setLoadingApi] = useState(false);
    const history = useHistory();
    const [detalleSolicitud, setDetalleSolicitud] = useState([]);
    const formik = useFormik({
        initialValues: {
            nroLiquidacion: '',
            fechaOperacion: '',
            idSolicitud: '',
            cedente: '',
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
            montoTotalVenta: 0
        },
    });
    const columns = [
        {
            title: "Liquidación",
            dataIndex: "nroLiquidacion",
            ...getColumnSearchProps("pagador"),
            render: (text, _, index) => {
                return (
                    <a type="primary" onClick={(v) => verDetalle(v, _.nroLiquidacion)}>
                        {_.nroLiquidacion}
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
            title: "Aceptante",
            dataIndex: "pagador",
            ...getColumnSearchProps("pagador"),
        },
        {
            title: "RUC",
            dataIndex: "rucPagador",
            ...getColumnSearchProps("rucPagador"),
        },
        {
            title: "Cedente",
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
            title: "Conf.",
            render: (_, record) => {
                return (
                    <>
                        <Upload >
                            <Button icon={<UploadOutlined />} size={"small"}></Button>
                        </Upload>
                    </>
                );
            },
        },
        {
            title: "Aprob.",
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
                    showModal();
                    setDetalleSolicitud(rpta.data.detalle);
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

    const solicitarAprobacion = async (e) => {
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
                            estado: estados.CONFIRMAR_APROBACION,
                            usuario: user.usuario
                        };
                        lista.push(documento);
                    }
                }
                let data = new FormData();
                data.append("json", JSON.stringify(lista));
                const rpta = await documentosActualizarEstado(data);
                if (rpta.status === 204) {
                    debugger
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
    };
    const cargarDatos = async () => {
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            try {
                const rpta = await listarDocumentos(estados.SOLICITAR_APROBACION);
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
    return (
        <ContentComponent>
            <PageHeader
                backIcon={null}
                className="site-page-header"
                onBack={() => null}
                title=""
                style={{ backgroundcolor: "#f0f2f5" }}
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
                        title="Liquidaciones Confirmar Aprobación"
                        actions={[]}
                        extra={
                            <>
                                <Space>
                                    <Button
                                        className="primary-b"
                                        type="primary"
                                        icon={<LikeOutlined style={{ fontSize: "16px" }} />}
                                        onClick={solicitarAprobacion}
                                    >
                                        Confirmar Aprobación
                                    </Button>
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
                title="Detalle de la Liquidacion"
                onClose={hiddenModal}
                show={isModal}
                width={1000}
                footer={[
                    <Button className="primary-b" type="primary" onClick={hiddenModal}>
                        Salir
                    </Button>,
                ]}
            >
                <Form layout="vertical" className="ant-advanced-search-form">
                    <Descriptions title="Datos Principales">
                        <Descriptions.Item label="Liquidación" span={1}>
                            {formik.values.nroLiquidacion}
                        </Descriptions.Item>
                        <Descriptions.Item label="Moneda" span={1}>
                            {formik.values.moneda}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cedente" span={1}>
                            {formik.values.cedente}
                        </Descriptions.Item>
                        <Descriptions.Item label="Pagador" span={1}>
                            Rimac
                        </Descriptions.Item>
                        <Descriptions.Item label="Tipo de Operación" span={1}>
                            {formik.values.tipoOperacion}
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="Datos Adicionales">
                        <Descriptions.Item label="Fecha Operación" span={1}>
                            {formik.values.fechaOperacion}
                        </Descriptions.Item>
                        <Descriptions.Item label="TNM Op." span={1}>
                            {formik.values.tasaNominalMensual} %
                        </Descriptions.Item>
                        <Descriptions.Item label="TNA op." span={1}>
                            {formik.values.tasaNominalAnual} %
                        </Descriptions.Item>
                        <Descriptions.Item label="Ejecutivo" span={1}>
                            {formik.values.ejecutivoComercial}
                        </Descriptions.Item>
                        <Descriptions.Item label="Financiamiento" span={1}>
                            {formik.values.financiamiento} %
                        </Descriptions.Item>
                        <Descriptions.Item label="F. Resguardo" span={1}>
                            {formik.values.fondoResguardo} %
                        </Descriptions.Item>
                        <Descriptions.Item label="Com. Estruct." span={1}>
                            {formik.values.comisionEstructuracion} %
                        </Descriptions.Item>
                        <Descriptions.Item label="Cant. Doc." span={1}>
                            {formik.values.cantidadDocumentos}
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="Datos Contractuales">
                        <Descriptions.Item label="Contrato" span={1}>
                            S/. {formik.values.contrato}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gatos al ext." span={1}>
                            S/. 2000.00
                        </Descriptions.Item>
                        <Descriptions.Item label="Com. Carta Not." span={1}>
                            S/. {formik.values.comisionCartaNotarial}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ser. Cobr. Doc" span={1}>
                            S/. {formik.values.servicioCobranza}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ser. Custodia" span={1}>
                            S/. {formik.values.servicioCustodia}
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha Carta Not." span={1}>
                            22/10/2021
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
