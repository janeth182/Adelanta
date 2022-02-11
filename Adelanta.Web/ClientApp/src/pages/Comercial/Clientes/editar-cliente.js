import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Space, message, Form } from "antd";
import { RetweetOutlined, SaveOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuesta } from "../../../model/mocks/clientes";
import { ExportCSV } from '../../../utils/excel';
import { AuthContext } from "../../../context/authProvider";
import { InputComponent } from "../../../components/formControl.js/input";
import { SelectComponent } from "../../../components/formControl.js/select";
import { useFormik } from "formik";
import { listarClientes, obtenerClientePorIdCliente, mantenimientoCliente } from "../../../services/clienteService";
import * as Yup from "yup";
export const EditarClientePage = () => {
    const { isMessage, messageInfo } = useMessageApi();
    const [loadingApi, setLoadingApi] = useState(false);
    const history = useHistory();
    const { logoutUser, user } = useContext(AuthContext);
    const formik = useFormik({
        initialValues: {
            idCliente: 0,
            razonSocial: '',
            ruc: '',
            direccionOficina: '',
            direccionFacturacion: '',
            nombreContacto: '',
            telefonoContacto: '',
            emailContacto: '',
            tasaNominalMensual: 0,
            tasaNominalAnual: 0,
            ejecutivoComercial: 0,
            tipoOperacion: 0,
            financiamiento: 0,
            comisionEstructuracion: 0,
            gastosContrato: 0,
            comisionCartaNotarial: 0,
            servicioCobranza: 0,
            servicioCustodia: 0,
            estado: 1,
            usuario: user.usuario
        },
        validationSchema: Yup.object().shape({
            razonSocial: Yup.string().required("El campo es requerido"),
            ruc: Yup.string().required("El campo es requerido"),
            direccionOficina: Yup.string().required("El campo es requerido"),
            direccionFacturacion: Yup.string().required("El campo es requerido"),
            nombreContacto: Yup.string().required("El campo es requerido"),
            telefonoContacto: Yup.string().required("El campo es requerido"),
            emailContacto: Yup.string().required("El campo es requerido"),
            tasaNominalMensual: Yup.string().required("El campo es requerido"),
            tasaNominalAnual: Yup.string().required("El campo es requerido"),
            ejecutivoComercial: Yup.string().required("El campo es requerido"),
            tipoOperacion: Yup.string().required("El campo es requerido"),
            financiamiento: Yup.string().required("El campo es requerido"),
            comisionEstructuracion: Yup.string().required("El campo es requerido"),
            gastosContrato: Yup.string().required("El campo es requerido"),
            comisionCartaNotarial: Yup.string().required("El campo es requerido"),
            servicioCobranza: Yup.string().required("El campo es requerido"),
            servicioCustodia: Yup.string().required("El campo es requerido")
        }),
        onSubmit: (value) => {
            handleNewUsuario(value);
        },
    });
    const urlClientes = `${process.env.REACT_APP_RUTA_SERVIDOR}comercial/clientes`;
    const handleNewUsuario = async (value) => {
        let suscribe = true;
        debugger
        (async () => {
            setLoadingApi(true);
            try {
                let rpta = '';
                if (history.location.state === 0) {
                    rpta = await mantenimientoCliente(value);
                } else {
                    rpta = await mantenimientoCliente(value);
                }
                if (rpta.status === 201) {
                    if (suscribe) {
                        message.success('Se registro correctamente el usuario.');
                        setLoadingApi(false);
                    }
                } else if (rpta.status === 204) {
                    message.success('Se actualizo correctamente el usuario.');
                    setLoadingApi(false);
                } else if (rpta.status === 200) {
                    message.info('El usuario ingresado ya existe.');
                    setLoadingApi(false);
                } else {
                    message.error('Ocurrio un error al momento de procesar la solicitud.');
                    setLoadingApi(false);
                }
            } catch (error) {
                setLoadingApi(false);
                message.error('Ocurrio un error al momento de procesar la solicitud.');
            }
        })();

        return () => {
            suscribe = false;
        };
    };

    useEffect(() => {
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            try {
                debugger
                if (history.location.state !== 0) {
                    const rpta = await obtenerClientePorIdCliente(history.location.state);
                    if (rpta.status === 200) {
                        if (suscribe) {

                            formik.initialValues.idCliente = rpta.data.idCliente;
                            formik.initialValues.razonSocial = rpta.data.razonSocial;
                            formik.initialValues.ruc = rpta.data.ruc;
                            formik.initialValues.direccionOficina = rpta.data.direccionOficina;
                            formik.initialValues.direccionFacturacion = rpta.data.direccionFacturacion;
                            formik.initialValues.nombreContacto = rpta.data.nombreContacto;
                            formik.initialValues.telefonoContacto = rpta.data.telefonoContacto;
                            formik.initialValues.emailContacto = rpta.data.emailContacto;
                            formik.initialValues.tasaNominalMensual = rpta.data.tasaNominalMensual;
                            formik.initialValues.tasaNominalAnual = rpta.data.tasaNominalAnual;
                            formik.initialValues.ejecutivoComercial = rpta.data.ejecutivoComercial;
                            formik.initialValues.tipoOperacion = rpta.data.tipoOperacion;
                            formik.initialValues.financiamiento = rpta.data.financiamiento
                            formik.initialValues.comisionEstructuracion = rpta.data.comisionEstructuracion;
                            formik.initialValues.gastosContrato = rpta.data.gastosContrato;
                            formik.initialValues.comisionCartaNotarial = rpta.data.comisionCartaNotarial
                            formik.initialValues.servicioCobranza = rpta.data.servicioCobranza;
                            formik.initialValues.servicioCustodia = rpta.data.servicioCustodia;
                            formik.initialValues.estado = rpta.data.estado;
                            console.log(rpta.data)
                            setLoadingApi(false);
                        }
                    }
                } else {
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
    return (
        <ContentComponent style={{ padding: '0 24px', minHeight: 280 }} >
            <PageHeader
                backIcon={null}
                className="site-page-header"
                onBack={() => null}
                title=""
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
                        title="Editar Cliente"
                        actions={[
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    padding: `0 16px`,
                                }}
                            >
                                <Button type="secondary"
                                    icon={<RetweetOutlined />}
                                    onClick={() =>
                                        history.push({ pathname: `${urlClientes}` })}
                                >Regresar</Button>
                            </div>,
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    padding: `0 16px`,
                                }}
                            >
                                <Button type="primary" onClick={formik.handleSubmit} icon={<SaveOutlined />} loading={loadingApi}>
                                    Guardar
                                </Button>
                            </div>,
                        ]}
                    >
                        <Form layout="vertical">
                            <Row gutter={12}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="razonSocial"
                                        value={formik.values.razonSocial}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.razonSocial}
                                        touched={formik.touched.razonSocial}
                                        title="Razon Social:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="ruc"
                                        value={formik.values.ruc}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.ruc}
                                        touched={formik.touched.ruc}
                                        title="RUC:"
                                        disabled={history.location.state === 0 ? false : true}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="direccionOficina"
                                        value={formik.values.direccionOficina}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.direccionOficina}
                                        touched={formik.touched.direccionOficina}
                                        title="Dirección Oficina:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="direccionFacturacion"
                                        value={formik.values.direccionFacturacion}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.direccionFacturacion}
                                        touched={formik.touched.direccionFacturacion}
                                        title="Dirección Facturación:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="nombreContacto"
                                        value={formik.values.nombreContacto}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.nombreContacto}
                                        touched={formik.touched.nombreContacto}
                                        maxLength={11}
                                        title="Nombre Contacto:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="telefonoContacto"
                                        value={formik.values.telefonoContacto}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.telefonoContacto}
                                        touched={formik.touched.telefonoContacto}
                                        title="Telefono Contacto:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="emailContacto"
                                        value={formik.values.emailContacto}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.emailContacto}
                                        touched={formik.touched.emailContacto}
                                        title="Email Contacto:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="tasaNominalMensual"
                                        value={formik.values.tasaNominalMensual}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.tasaNominalMensual}
                                        touched={formik.touched.tasaNominalMensual}
                                        title="Tasa Nominal Mensual:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="tasaNominalAnual"
                                        value={formik.values.tasaNominalAnual}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.tasaNominalAnual}
                                        touched={formik.touched.tasaNominalAnual}
                                        title="Tasa Nominal Anual:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="financiamiento"
                                        value={formik.values.financiamiento}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.financiamiento}
                                        touched={formik.touched.financiamiento}
                                        title="Finacimiento:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="comisionEstructuracion"
                                        value={formik.values.comisionEstructuracion}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.comisionEstructuracion}
                                        touched={formik.touched.comisionEstructuracion}
                                        title="Comisión Estructuración:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="gastosContrato"
                                        value={formik.values.gastosContrato}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.gastosContrato}
                                        touched={formik.touched.gastosContrato}
                                        title="Gastos Contrato:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="comisionCartaNotarial"
                                        value={formik.values.comisionCartaNotarial}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.comisionCartaNotarial}
                                        touched={formik.touched.comisionCartaNotarial}
                                        title="Comisión Carta Notarial:"
                                    />
                                </Col>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="servicioCobranza"
                                        value={formik.values.servicioCobranza}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.servicioCobranza}
                                        touched={formik.touched.servicioCobranza}
                                        title="Servicio Cobranza:"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} xs={{ span: 24 }}>
                                    <InputComponent
                                        name="servicioCustodia"
                                        value={formik.values.servicioCustodia}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.errors.servicioCustodia}
                                        touched={formik.touched.servicioCustodia}
                                        title="Servicio Custodia:"
                                    />
                                </Col>
                                <Col xs={24} lg={12}>
                                    <SelectComponent
                                        value={formik.values.estado}
                                        onBlur={formik.handleBlur}
                                        onChange={value => formik.setFieldValue("estado", value)}
                                        error={formik.errors.estado}
                                        touched={formik.touched.estado}
                                        title="Estado:"
                                        options={[{ value: 1, label: 'Activo' }, { value: 0, label: 'Inactivo' }]}
                                    >
                                    </SelectComponent>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </ContentComponent>
    );
};
