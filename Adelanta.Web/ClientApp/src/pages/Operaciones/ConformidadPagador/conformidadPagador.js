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
    Form,
    Descriptions,
    notification
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { listarDocumentosFactrack, documentosConfirmarFactrack } from "../../../services/documentoService";
import { ModalComponent } from "../../../components/modal/modal";
import { estados, mensajeError } from "../../../utils/constant";
import { AuthContext } from "../../../context/authProvider";
import { useFormik } from "formik";
export const ConformidadPagadorPage = () => {
    const { logoutUser, user } = useContext(AuthContext);
    const { isModal, showModal, hiddenModal } = useModal();
    const { isMessage, addMessage, messageInfo } = useMessageApi();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [loadingApi, setLoadingApi] = useState(false);
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
            title: "Conf. Pagador",
            dataIndex: "estadoDescripcion",
            ...getColumnSearchProps("estadoDescripcion"),
            render: (_, record) => {
                if (record.estado === 5) {
                    return (
                        <a type="primary" onClick={showModal}>
                            {record.estadoDescripcion}
                        </a>
                    );
                } else {
                    return (
                        <>
                            {record.estadoDescripcion}
                        </>
                    )
                }
            },
        },
        {
            title: "Confirmar",
            dataIndex: "tipoOperacion",
            render: (_, record) => {
                if (record.estado !== 5) {
                    return (
                        <>
                            <Checkbox
                                onChange={onChangeChecked}
                                name={"confirmar"}
                                value={record.idDocumento}
                                data-sol={record.idSolicitud}
                            ></Checkbox>
                        </>
                    );
                }
            },
        },
    ];

    function onChangeChecked(e) {
        console.log(`checked = ${JSON.stringify(e.target)}`);
    }
    const confirmarFactrack = async (e) => {
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            const cantidadControles = document.getElementsByName("confirmar").length;
            try {
                debugger
                const lista = [];
                for (let i = 0; i < cantidadControles; i++) {
                    if (document.getElementsByName("confirmar")[i].checked) {
                        const documento = {
                            idDocumento: document.getElementsByName("confirmar")[i].value,
                            estado: estados.CONFIRMAR_FACTRACK,
                            usuario: user.usuario,
                            idSolicitud: document.getElementsByName("confirmar")[i].getAttribute("data-sol"),
                            nroLiquidacion: ""
                        };
                        lista.push(documento);
                    }
                }
                let data = new FormData();
                data.append("json", JSON.stringify(lista));
                const rpta = await documentosConfirmarFactrack(data);
                if (rpta.status === 204) {
                    debugger
                    cargarDatos();
                    for (let i = 0; i < cantidadControles; i++) {
                        if (document.getElementsByName("confirmar")[i].checked) {
                            document.getElementsByName("confirmar")[i].click();
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

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        let suscribe = true;
        (async () => {
            setLoadingApi(true);
            try {
                const rpta = await listarDocumentosFactrack(user.usuario);
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
                        title="Conformidad Factrack"
                        actions={[]}
                        extra={
                            <>
                                <Space>
                                    <Button
                                        className="primary-b"
                                        type="primary"
                                        icon={<CheckCircleOutlined style={{ fontSize: "16px" }} />}
                                        onClick={confirmarFactrack}
                                    >
                                        Confirmar factrack
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
                title="Detalle de la disconformidad"
                onClose={hiddenModal}
                show={isModal}
                footer={[
                    <Button className="primary-b" type="primary" onClick={hiddenModal}>
                        Salir
                    </Button>,
                ]}
            >
                <Form layout="vertical" className="ant-advanced-search-form">
                    <Descriptions title="">
                        <Descriptions.Item label="" span={1}>
                            Observaciones Factrack
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
            </ModalComponent>
        </ContentComponent>
    );
};
