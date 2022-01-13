import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button, Form, Space, notification, Input, InputNumber, Descriptions } from "antd";
import { ContentComponent } from "../../../components/layout/content";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { SaveOutlined, RetweetOutlined, LikeOutlined, CalculatorOutlined } from "@ant-design/icons";
import { useModal } from "../../../hooks/useModal";
import { buscarClienteRUC } from "../../../services/clienteService";
import { ModalComponent } from "../../../components/modal/modal";
import { AuthContext } from "../../../context/authProvider";
import { mime, mensajeError, estados } from "../../../utils/constant";
import { InputComponent } from "../../../components/formControl.js/input";
import { crearSolicitudCapitalTrabajo } from "../../../services/solicitudService";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { SelectComponent } from "../../../components/formControl.js/select";
export const CapitalTrabajoPage = () => {
    const { Search } = Input;
    const { logoutUser, user } = useContext(AuthContext);
    const { isModal, showModal, hiddenModal } = useModal();
    const { isMessage, messageInfo } = useMessageApi();
    const [loadingApi, setLoadingApi] = useState(false);
    const history = useHistory();
    const [dataCliente, setDataCliente] = useState([]);
    const [dataMontoGarantia, setDataMontoGarantia] = useState();
    const [dataRUC, setDataRUC] = useState();
    const [dataRazonSocial, setDataRazonSocial] = useState();
    const [dataCapitalTrabajo, setDataCapitalTrabajo] = useState();
    const [dataFechaPago, setDataFechaPago] = useState();
    const [dataDiasPrestamo, setDataDiasPrestamo] = useState();
    const [dataTasaAnual, setDataTasaAnual] = useState(0);
    const [dataIntereses, setDataIntereses] = useState();
    const [dataGastos, setDataGastos] = useState();
    const [dataTotalFacturar, setDataTotalFacturar] = useState();
    const [dataTotalDesembolsar, setDataTotalDesembolsar] = useState();
    const [dataComisionCartaNotarial, setDataComisionCartaNotarial] = useState();
    const [dataServicioCobranza, setDataServicioCobranza] = useState();
    const [dataServicioCustodia, setDataServicioCustodia] = useState();
    const [dataIdSolicitud, setDataIdSolicitud] = useState();
    const [dataTipo, setDataTipo] = useState('CN');

    const urlSolicitud = `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/Solicitudes`;

    const buscarCliente = e => {
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            try {
                const ruc = e;
                debugger
                setDataRUC(ruc);
                if (ruc.length > 10) {
                    const rpta = await buscarClienteRUC(ruc);
                    if (suscribe) {
                        console.log(JSON.stringify(rpta.data));
                        setDataRazonSocial(rpta.data.razonSocial);
                        setDataTasaAnual(rpta.data.tasaNominalAnual);
                        setDataComisionCartaNotarial(rpta.data.comisionCartaNotarial);
                        setDataServicioCobranza(rpta.data.servicioCobranza);
                        setDataServicioCustodia(rpta.data.servicioCobranza);
                        setLoadingApi(false);
                    }
                } else {
                    setDataRazonSocial('');
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
    const ingresarMontoGarantia = e => {
        debugger
        setDataCapitalTrabajo(e.target.value);
        setDataMontoGarantia(e.target.value);
    }
    const validarCapitalSolicitado = e => {
        const montoGarantia = dataMontoGarantia;
        const capitalSolicitado = e.target.value;
        debugger
        if (capitalSolicitado > montoGarantia) {
            notification['info']({
                message: 'Información',
                description: 'Capital Solicitado no puede ser mayor al monto de garantía.'

            });
        } else {
            setDataCapitalTrabajo(e.target.value);
        }
    }
    const calcular = () => {
        debugger
        const dias = dataDiasPrestamo;
        let startdate = moment();
        startdate = moment(startdate, "DD-MM-YYYY").add(dias, 'days');
        startdate = startdate.format("DD/MM/YYYY");
        const capitalTrabajo = dataCapitalTrabajo;
        const tasaAnual = dataTasaAnual;
        const interes = parseFloat(capitalTrabajo * (((tasaAnual / 100) * 12) / 360) * dias * 1.18).toFixed(2);
        const gastos = parseFloat((dataComisionCartaNotarial + dataServicioCobranza + dataServicioCustodia) * 1.18).toFixed(2);
        const totalFacturar = parseFloat(interes + gastos).toFixed(2);
        const totalDesembolsar = dataTipo === 'CN' ? dataCapitalTrabajo : dataCapitalTrabajo - totalFacturar;
        setDataIntereses(interes);
        setDataGastos(gastos);
        setDataFechaPago(startdate);
        setDataTotalFacturar(totalFacturar);
        setDataTotalDesembolsar(totalDesembolsar);
    };
    const validateMessages = {
        required: '${label} is requerido!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const layout = {
        labelCol: {
            span: 12,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const onFinish = (values) => {
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            try {
                debugger
                values.solicitud.fechaPago = dataFechaPago;
                values.solicitud.interesIGV = dataIntereses;
                values.solicitud.gatosIGV = dataGastos;
                values.solicitud.totalFacturar = dataTotalFacturar;
                values.solicitud.totalDesembolsar = dataTotalDesembolsar;
                values.solicitud.tipoOperacion = dataTipo;
                values.solicitud.razonSocial = dataRazonSocial;
                values.solicitud.usuario = user.usuario;
                console.log("Success:", values);
                let data = new FormData();
                data.append("json", JSON.stringify(values.solicitud));
                const rpta = await crearSolicitudCapitalTrabajo(data);
                if (rpta.status === 200) {
                    console.log(rpta.data);
                    setDataIdSolicitud(rpta.data.idSolicitud);
                    showModal();
                    setLoadingApi(false);
                } else {
                    notification['error']({
                        message: 'Error',
                        description: mensajeError.GENERAL

                    });
                    setLoadingApi(false);
                }
            }
            catch (error) {
                setLoadingApi(false);
                notification['error']({
                    message: 'Error',
                    description: mensajeError.GENERAL

                });
            }
        })();

        return () => {
            suscribe = false;
        };
    };
    return (
        <ContentComponent style={{ padding: "0 24px", minHeight: 280 }}>
            <MessageApi
                type={messageInfo.type}
                message={messageInfo.text}
                description={messageInfo.description}
                visibility={isMessage}
            />
            <Row>
                <Col span={24}>
                    <Card
                        title="Nueva Solicitud Capital de Trabajo"
                        actions={[
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    padding: `0 16px`,
                                }}
                            >
                                <Button
                                    type="secondary"
                                    icon={<RetweetOutlined />}
                                    onClick={() =>
                                        history.push({
                                            pathname: `${urlSolicitud}`,
                                        })
                                    }
                                >
                                    Regresar
                                </Button>
                            </div>,
                        ]}
                    >
                        <Form {...layout} autoComplete="off" onFinish={onFinish} validateMessages={validateMessages}>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <SelectComponent
                                        title="Seleccione Tipo:"
                                        value={dataTipo}
                                        onChange={value => setDataTipo(value)}
                                        options={[{ value: 'CN', label: 'Capital de Trabajo Neto' }, { value: 'CB', label: 'Capital de Trabajo Bruto' }]}
                                    >
                                    </SelectComponent>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <Form.Item name={['solicitud', 'ruc']}
                                        label="Ingrese RUC"
                                        value={dataRUC}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                        <Search placeholder="Ingrese RUC" onSearch={buscarCliente} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <InputComponent
                                        name={['solicitud', 'razonSocial']}
                                        value={dataRazonSocial}
                                        bordered={false}
                                        title="Total a Desembolsar con IGV:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <Form.Item bordered={false}
                                        name={['solicitud', 'montoGarantia']}
                                        label="Monto de la Garantia:"
                                        onChange={ingresarMontoGarantia}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <InputNumber value={dataMontoGarantia} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <Form.Item bordered={false}
                                        name={['solicitud', 'capitalTrabajoSolicitado']}
                                        label="Capital de Trabajo Solicitado:"
                                        onChange={validarCapitalSolicitado}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <InputNumber value={dataCapitalTrabajo} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <Form.Item bordered={false}
                                        name={['solicitud', 'diasPrestamo']}
                                        label="Días de prestamo:"
                                        value={dataDiasPrestamo}
                                        onChange={e => {
                                            setDataDiasPrestamo(e.target.value)
                                        }}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <InputComponent
                                        name={['solicitud', 'fechaPago']}
                                        value={dataFechaPago}
                                        bordered={false}
                                        title="Fecha de Pago:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <InputComponent
                                        name={['solicitud', 'interes']}
                                        value={dataIntereses}
                                        bordered={false}
                                        title="Intereses incluido IGV:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <InputComponent
                                        name={['solicitud', 'gastosIncluidoIGV']}
                                        value={dataGastos}
                                        bordered={false}
                                        title="Gastos incluido IGV:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <InputComponent
                                        name={['solicitud', 'totalFacturarIGV']}
                                        value={dataTotalFacturar}
                                        bordered={false}
                                        title="Total a Facturar con IGV:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <InputComponent
                                        name={['solicitud', 'totalDesembolsarIGV']}
                                        value={dataTotalDesembolsar}
                                        bordered={false}
                                        title="Total a Desembolsar con IGV:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={6} xs={{ span: 24 }}>
                                    <Space>
                                        <Button
                                            className="primary-b"
                                            type="primary"
                                            icon={<CalculatorOutlined style={{ fontSize: "16px" }} />}
                                            onClick={calcular}
                                        >
                                            Calcular
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                        >
                                            Registrar Solicitud
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <ModalComponent
                title="Resumen de la Operación"
                onClose={() =>
                    history.push({
                        pathname: `${urlSolicitud}`,
                    })
                }
                show={isModal}
                width={1000}
                footer={[
                    <Button
                        className="primary-b"
                        type="primary"
                        onClick={() =>
                            history.push({
                                pathname: `${urlSolicitud}`,
                            })
                        }
                    >
                        Finalizar
                    </Button>,
                ]}
            >
                <Form layout="vertical" className="ant-advanced-search-form">
                    <Descriptions title="Solicitud Generada" bordered>
                        <Descriptions.Item label="Nro Solicitud">{dataIdSolicitud}</Descriptions.Item>
                    </Descriptions>
                </Form>
            </ModalComponent>
        </ContentComponent >
    );
};
