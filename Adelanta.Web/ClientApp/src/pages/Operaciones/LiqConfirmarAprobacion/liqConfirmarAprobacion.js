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
    notification,
} from "antd";
import { LikeOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { listarDocumentos, documentosActualizarEstado } from "../../../services/documentoService";
import { estados, mensajeError } from "../../../utils/constant";
import { AuthContext } from "../../../context/authProvider";
import moment from "moment";
export const LiqConfirmarAprobacionPage = () => {
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
        </ContentComponent>
    );
};
