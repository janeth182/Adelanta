import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
    PageHeader,
    Row,
    Col,
    Card,
    Table,
    Button,
    Space,
    Checkbox,
    message,
    InputNumber,
    DatePicker,
    Form,
    Descriptions,
    notification,
} from "antd";
import { SaveOutlined, SendOutlined, EditOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { listarDocumentos, documentoSolicitarAprobacion } from "../../../services/documentoService";
import { estados, mensajeError } from "../../../utils/constant";
import { ModalComponent } from "../../../components/modal/modal";
import { detalleFacturas } from "../../../model/mocks/detalleFactura";
import { AuthContext } from "../../../context/authProvider";
import moment from "moment";
export const LiqSolicitarAprobacionPage = () => {
    const { logoutUser, user } = useContext(AuthContext);
    const { isModal, showModal, hiddenModal } = useModal();
    const { isMessage, addMessage, messageInfo } = useMessageApi();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [loadingApi, setLoadingApi] = useState(false);
    const history = useHistory();

    function onChange(date, dateString) {
        console.log(date, dateString);
    }
    function disabledDate(current) {
        return current && current < moment().endOf('day');
    }
    const columns = [
        {
            title: "Liquidación",
            dataIndex: "nroLiquidacion",
            ...getColumnSearchProps("nroLiquidacion"),
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
            title: "Sol Aprob.",
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

    function onChangeChecked(e) {
        console.log(`checked = ${JSON.stringify(e.target)}`);
    }
    const columsDetalle = [
        {
            title: "Nro. Factura",
            dataIndex: "idFactura",
        },
        {
            title: "Fecha Pago",
            dataIndex: "fechaEmision",
        },
        {
            title: "Monto de Pago",
            dataIndex: "montoSinIGV",
        },
        {
            title: "F. resguardo",
            dataIndex: "montoSinIGV",
        },
        {
            title: "Monto Pago",
            dataIndex: "total",
        },
        {
            title: "Intereses",
            dataIndex: "archivos",
        },
        {
            title: "Gastos",
            dataIndex: "archivos",
        },
        {
            title: "Desembolso",
            dataIndex: "archivos",
        },
    ];
    useEffect(() => {
        cargarDatos();
    }, []);

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
                            estado: estados.SOLICITAR_APROBACION,
                            usuario: user.usuario
                        };
                        lista.push(documento);
                    }
                }
                let data = new FormData();
                data.append("json", JSON.stringify(lista));
                const rpta = await documentoSolicitarAprobacion(data);
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
                const rpta = await listarDocumentos(estados.CONFIRMAR_FACTRACK);
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
                        title="Liquidacones Solicitar Aprobación"
                        actions={[]}
                        extra={
                            <>
                                <Space>
                                    <Button
                                        className="primary-b"
                                        type="primary"
                                        icon={<SendOutlined style={{ fontSize: "16px" }} />}
                                        onClick={solicitarAprobacion}
                                    >
                                        Solicitar Aprobación
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
                            50
                        </Descriptions.Item>
                        <Descriptions.Item label="Moneda" span={1}>
                            PEN
                        </Descriptions.Item>
                        <Descriptions.Item label="Cedente" span={1}>
                            ISI Group S.A.C
                        </Descriptions.Item>
                        <Descriptions.Item label="Pagador" span={1}>
                            Rimac
                        </Descriptions.Item>
                        <Descriptions.Item label="Tipo de Operación" span={1}>
                            Factoring
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="Datos Adicionales">
                        <Descriptions.Item label="Fecha Operación" span={1}>
                            <Space direction="vertical">
                                <DatePicker
                                    onChange={onChange}
                                    format={"DD/MM/YYYY"}
                                    disabledDate={disabledDate}
                                />
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="TNM Op." span={1}>
                            2.00 %
                        </Descriptions.Item>
                        <Descriptions.Item label="TNA op." span={1}>
                            24.00 %
                        </Descriptions.Item>
                        <Descriptions.Item label="Ejecutivo" span={1}>
                            Grabriel
                        </Descriptions.Item>
                        <Descriptions.Item label="Financiamiento" span={1}>
                            90%
                        </Descriptions.Item>
                        <Descriptions.Item label="F. Resguardo" span={1}>
                            10%
                        </Descriptions.Item>
                        <Descriptions.Item label="Com. Estruct." span={1}>
                            0.00%
                        </Descriptions.Item>
                        <Descriptions.Item label="Cant. Doc." span={1}>
                            4
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="Datos Contractuales">
                        <Descriptions.Item label="Contrato" span={1}>
                            S/. 3500.00
                        </Descriptions.Item>
                        <Descriptions.Item label="Gatos al ext." span={1}>
                            S/. 2000.00
                        </Descriptions.Item>
                        <Descriptions.Item label="Con. Carta Not." span={1}>
                            S/. 400.00
                        </Descriptions.Item>
                        <Descriptions.Item label="Ser. Cobr. Doc" span={1}>
                            S/. 100.00
                        </Descriptions.Item>
                        <Descriptions.Item label="Ser. Custodia" span={1}>
                            S/. 100.00
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha Carta Not." span={1}>
                            22/10/2021
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="Facturas"></Descriptions>
                    <Table
                        loading={loadingApi}
                        columns={columsDetalle}
                        dataSource={detalleFacturas.data}
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
