import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button, Form, Space, notification, Input, InputNumber, Descriptions, Select } from "antd";
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
const { Option } = Select;
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
    const [dataIntereses, setDataIntereses] = useState(0);
    const [dataMontoDescontar, setDataMontoDescontar] = useState(0);
    const [dataGastos, setDataGastos] = useState(0);
    const [dataTotalFacturar, setDataTotalFacturar] = useState(0);
    const [dataTotalDesembolsar, setDataTotalDesembolsar] = useState(0);
    const [dataComisionCartaNotarial, setDataComisionCartaNotarial] = useState();
    const [dataServicioCobranza, setDataServicioCobranza] = useState();
    const [dataServicioCustodia, setDataServicioCustodia] = useState();
    const [dataIdSolicitud, setDataIdSolicitud] = useState();
    const [dataMoneda, setDataMoneda] = useState('PEN');
    const [dataTipo, setDataTipo] = useState('CB');
    const [dataTasaMensual, setDataTasaMensual] = useState(0);
    const urlSolicitud = `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/Solicitudes`;

    const buscarCliente = async (e) => {
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
                        setDataTasaAnual(rpta.data.tasaAnual);
                        setDataComisionCartaNotarial(rpta.data.comisionCartaNotarial);
                        setDataServicioCobranza(rpta.data.servicioCobranza);
                        setDataServicioCustodia(rpta.data.servicioCustodia);
                        setDataTasaMensual(rpta.data.tasaNominalMensual);
                        setLoadingApi(false);
                    }
                } else {
                    setDataRazonSocial('');
                    setLoadingApi(false);
                }
            } catch (error) {
                setLoadingApi(false);
                console.log(error.response);
                setDataRazonSocial('');
                setDataTasaAnual(0);
                setDataComisionCartaNotarial(0);
                setDataServicioCobranza(0);
                setDataServicioCustodia(0);
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
        const montoGarantia = dataMontoGarantia.replace(/\$\s?|(,*)/g, "");
        const capitalSolicitado = e.target.value.replace(/\$\s?|(,*)/g, "");
        debugger
        if (+capitalSolicitado > +montoGarantia) {
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
        const capitalTrabajo = +(dataCapitalTrabajo.replace(/\$\s?|(,*)/g, ""));
        const tasaAnual = +dataTasaAnual / 100;
        const tasaMensual = +dataTasaMensual / 100;
        const gatosSinIGV = parseFloat(((+dataComisionCartaNotarial) + (+dataServicioCobranza) + (+dataServicioCustodia))).toFixed(2);
        const gastos = parseFloat(gatosSinIGV * 1.18).toFixed(2);
        const montoDescontar = dataTipo === 'CN' ? parseFloat(((360 * capitalTrabajo) + (360 * gatosSinIGV)) / (360 - (dias * (tasaMensual * 12) * 1.18))).toFixed(2) : 0;
        const interes = dataTipo === 'CN' ? parseFloat(montoDescontar * dias * ((tasaMensual * 12) / 360) * 1.18).toFixed(2) : parseFloat((+capitalTrabajo) * (((+tasaAnual) * 12) / 360) * dias * 1.18).toFixed(2);
        const totalFacturar = parseFloat((+interes) + (+gastos)).toFixed(2);
        const totalDesembolsar = dataTipo === 'CN' ? dataCapitalTrabajo : parseFloat(capitalTrabajo + (+totalFacturar)).toFixed(2);
        setDataIntereses(interes);
        setDataGastos(gastos);
        setDataFechaPago(startdate);
        setDataTotalFacturar(totalFacturar);
        setDataTotalDesembolsar(totalDesembolsar);
        setDataMontoDescontar(montoDescontar);
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
            flex: '210px'
        },
        wrapperCol: {
            span: 12,
        },
    };
    const onFinish = (values) => {
        debugger
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            try {
                values.solicitud.fechaPago = dataFechaPago;
                values.solicitud.interesIGV = dataIntereses;
                values.solicitud.gatosIGV = dataGastos;
                values.solicitud.totalFacturar = dataTotalFacturar;
                values.solicitud.totalDesembolsar = dataTotalDesembolsar;
                values.solicitud.tipoOperacion = dataTipo;
                values.solicitud.razonSocial = dataRazonSocial;
                values.solicitud.usuario = user.usuario;
                values.solicitud.montoDescontar = dataMontoDescontar;
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
    const cambiarTipo = (e) => {
        setDataTipo(e);
        if (e !== 'CN') {
            setDataMontoDescontar(0);
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
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
                        <Row>
                            <Col lg={12} xs={{ span: 24 }}>
                                <Form {...layout}
                                    autoComplete="off"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    validateMessages={validateMessages}>
                                    <Form.Item
                                        label="Seleccione Tipo"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select value={dataTipo} placeholder="Seleccione Tipo" onChange={cambiarTipo} >
                                            <Option value="CN">Capital de Trabajo Neto</Option>
                                            <Option value="CB">Capital de Trabajo Bruto</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={['solicitud', 'moneda']}
                                        label="Seleccione Moneda"
                                    >
                                        <Select defaultValue={dataMoneda} disabled placeholder="Seleccione Moneda" onChange={value => setDataMoneda(value)}>
                                            <Option value="PEN">Soles</Option>
                                            <Option value="USD">Dolares</Option>
                                        </Select>
                                    </Form.Item>
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
                                    <Form.Item name={['solicitud', 'razonSocial']}
                                        label="Razon Social:"
                                    >
                                        <label>{dataRazonSocial}</label>
                                    </Form.Item>
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
                                        <InputNumber value={dataMontoGarantia}
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                        />
                                    </Form.Item>
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
                                        <InputNumber value={dataCapitalTrabajo}
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                        />
                                    </Form.Item>
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
                                    <InputComponent
                                        name={['solicitud', 'fechaPago']}
                                        value={dataFechaPago}
                                        bordered={false}
                                        title="Fecha de Pago:"
                                    />
                                    <Form.Item name={['solicitud', 'montoDescontar']}
                                        label="Monto a descontar:"
                                        style={dataTipo !== 'CN' ? { display: 'none' } : { display: '' }}
                                    >
                                        <label>{dataMontoDescontar !== 0 ? dataMontoDescontar.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : dataMontoDescontar}</label>
                                    </Form.Item>
                                    <InputComponent
                                        name={['solicitud', 'interes']}
                                        value={dataIntereses !== 0 ? dataIntereses.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : dataIntereses}
                                        bordered={false}
                                        title="Intereses incluido IGV:"
                                    />
                                    <InputComponent
                                        name={['solicitud', 'gastosIncluidoIGV']}
                                        value={dataGastos !== 0 ? dataGastos.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : dataGastos}
                                        bordered={false}
                                        title="Gastos incluido IGV:"
                                    />
                                    <InputComponent
                                        name={['solicitud', 'totalFacturarIGV']}
                                        value={dataTotalFacturar !== 0 ? dataTotalFacturar.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : dataTotalFacturar}
                                        bordered={false}
                                        title="Total a Facturar con IGV:"
                                    />
                                    <InputComponent
                                        name={['solicitud', 'totalDesembolsarIGV']}
                                        value={dataTotalDesembolsar !== 0 ? dataTotalDesembolsar.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : dataTotalDesembolsar}
                                        bordered={false}
                                        title="Total a Desembolsar con IGV:"
                                    />
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
                            </Col>
                            <Col lg={6} xs={{ span: 24 }}>
                                <div>
                                    <Descriptions
                                        title="Datos del Cliente"
                                        bordered
                                    >
                                        <Descriptions.Item label="Tasa Anual" span={3}>% {dataTasaAnual}</Descriptions.Item>
                                        <Descriptions.Item label="Tasa Mensual" span={3}>% {dataTasaMensual}</Descriptions.Item>
                                        <Descriptions.Item label="Comisión Carta Notarial" span={3}>S/. {dataComisionCartaNotarial}</Descriptions.Item>
                                        <Descriptions.Item label="Servicio Cobranza" span={3}>S/. {dataServicioCobranza}</Descriptions.Item>
                                        <Descriptions.Item label="Servicio Custodia" span={3}>S/. {dataServicioCustodia}</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </Col>
                            <Col lg={6} xs={{ span: 24 }}>

                            </Col>

                        </Row>

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
                        <Descriptions.Item label="Moneda">{dataMoneda}</Descriptions.Item>
                    </Descriptions>
                </Form>
            </ModalComponent>
        </ContentComponent >
    );
};
