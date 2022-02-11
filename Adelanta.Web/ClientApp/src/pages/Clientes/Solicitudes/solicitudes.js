import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col, Card, Table, Button, Tag, Form, Descriptions, Space, Popconfirm, message } from "antd";
import { PlusSquareOutlined, DeleteOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { solicitudes } from "../../../model/mocks/solicitudes";
import { desembolsado } from "../../../model/mocks/desembolsado";
import { ModalComponent } from "../../../components/modal/modal";
import { ExportCSV } from "../../../utils/excel";
import { listarSolicitudes, eliminarSolicitud, obtenerSolicitudDetalle } from "../../../services/solicitudService";
import { useFormik } from "formik";
export const SolicitudesPage = () => {
  const { isModal, showModal, hiddenModal } = useModal();
  const { isMessage, addMessage, messageInfo } = useMessageApi();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const history = useHistory();
  const [detalleSolicitud, setDetalleSolicitud] = useState([]);
  const formik = useFormik({
    initialValues: {
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
      montoTotalVenta: 0
    },
  });
  const columns = [
    {
      title: "Nro. Solicitud",
      dataIndex: "idSolicitud",
      ...getColumnSearchProps("idSolicitud"),
      render: (text, _, index) => {
        return (
          <a type="primary" onClick={(v) => verDetalle(v, _.idSolicitud)}>
            {_.idSolicitud}
          </a>
        );
      },
    },
    {
      title: "Fecha Solicitud",
      dataIndex: "fechaSolicitud",
      ...getColumnSearchProps("fechaSolicitud"),
    },
    {
      title: "Nro. Liquidación",
      dataIndex: "nroLiquidacion",
      ...getColumnSearchProps("nroLiquidacion"),
      render: (_, record) => {
        if (record.estado === "Desembolso") {
          return (
            <a type="primary" onClick={showModal}>
              {record.liquidacion}
            </a>
          );
        } else {
          return record.liquidacion;
        }
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
      title: "Aceptante",
      dataIndex: "aceptante",
      ...getColumnSearchProps("aceptante"),
    },
    {
      title: "RUC",
      dataIndex: "ruc",
      ...getColumnSearchProps("ruc"),
    },
    {
      title: "Importe",
      dataIndex: "importeTotal",
      ...getColumnSearchProps("importeTotal"),
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
      ...getColumnSearchProps("moneda"),
    },
    {
      title: "Nro. Facturas",
      dataIndex: "cantidadDocumentos",
      ...getColumnSearchProps("cantidadDocumentos"),
    },
    {
      title: "Tipo Operación",
      dataIndex: "tipoOperacion",
      ...getColumnSearchProps("tipoOperacion"),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      ...getColumnSearchProps("estado"),
      render: (value) => {
        return (
          <Tag color={value === "Desembolso" ? "blue" : "red"} rou>
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Acción",
      dataIndex: "actiion",
      width: 100,
      render: (_, record) => {
        return (
          <>
            <Popconfirm
              title="Esta seguro que desea eliminar la solicitud?"
              onConfirm={() => {
                confirm(record.idSolicitud);
              }}
              onCancel={() => {
                cancel(record.idSolicitud);
              }}
              okText="Sí"
              cancelText="No"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm>
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
      title: "Fecha Emisión",
      dataIndex: "fechaEmision",
    },
    {
      title: "IGV",
      dataIndex: "montoTotalImpuesto",
    },
    {
      title: "Monto Operación",
      dataIndex: "montoOperacion",
    },
    {
      title: "Monto Pago",
      dataIndex: "montoTotalVenta",
    },
    {
      title: "Forma Pago",
      dataIndex: "formaPago",
    },
  ];
  const cancel = async (e) => {
    message.error('No se elimino la solicitud.');
  }
  const confirm = async (id) => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        debugger
        const rpta = await eliminarSolicitud(id);
        if (rpta.status === 204) {
          if (suscribe) {
            message.success('Se eliminimo correctamente la solicitud.');
            cargarDatos();
            setLoadingApi(false);
          }
        } else {
          message.error('Ocurrio un error al momento de procesar la solicitud.');
          setLoadingApi(false);
        }
      } catch (error) {
        message.error('Ocurrio un error al momento de procesar la solicitud.');
        console.log(error.response);
        setLoadingApi(false);
      }
    })();
    return () => {
      suscribe = false;
    };
  }
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        const rpta = await listarSolicitudes();
        if (suscribe) {
          console.log(rpta.data);
          handleFormatColumns(rpta.data);
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

  const handleFormatColumns = (dataArray = []) => {
    const data = dataArray.reduce((ac, el) => {
      ac.push({
        ...el,
      });
      return ac;
    }, []);
    setDataUsuario(data);
  };

  const verDetalle = async (v, idSolicitud) => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        console.log(idSolicitud);
        const rpta = await obtenerSolicitudDetalle(idSolicitud);
        if (suscribe) {
          formik.initialValues.idSolicitud = rpta.data[0].idSolicitud;
          formik.initialValues.cedente = rpta.data[0].cedente;
          formik.initialValues.aceptante = rpta.data[0].aceptante;
          formik.initialValues.tipoOperacion = rpta.data[0].tipoOperacion;
          formik.initialValues.tasaNominalMensual = rpta.data[0].tasaNominalMensual;
          formik.initialValues.tasaNominalAnual = rpta.data[0].tasaNominalAnual;
          formik.initialValues.financiamiento = rpta.data[0].financiamiento;
          formik.initialValues.fondoResguardo = rpta.data[0].fondoResguardo;
          formik.initialValues.cantidadDocumentos = rpta.data[0].cantidadDocumentos;
          formik.initialValues.contrato = rpta.data[0].contrato;
          formik.initialValues.comisionCartaNotarial = rpta.data[0].comisionCartaNotarial;
          formik.initialValues.serie = rpta.data[0].serie;
          formik.initialValues.moneda = rpta.data[0].moneda;
          formik.initialValues.montoTotalImpuesto = rpta.data[0].montoTotalImpuesto;
          formik.initialValues.montoOperacion = rpta.data[0].montoOperacion;
          formik.initialValues.montoTotalVenta = rpta.data[0].montoTotalVenta;
          formik.initialValues.servicioCobranza = rpta.data[0].servicioCobranza;
          formik.initialValues.servicioCustodia = rpta.data[0].servicioCustodia;
          formik.initialValues.comisionEstructuracion = rpta.data[0].comisionEstructuracion;
          formik.initialValues.ejecutivoComercial = rpta.data[0].ejecutivoComercial;
          console.log(rpta.data);
          showModal();
          setDetalleSolicitud(rpta.data[0].detalle);
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
            title="Solicitudes"
            actions={[]}
            extra={
              <Space>
                <Button
                  className="primary-b"
                  type="primary"
                  icon={<PlusSquareOutlined style={{ fontSize: "16px" }} />}
                  onClick={() =>
                    history.push({
                      pathname: `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/Solicitudes/nueva-solicitud`,
                      state: 0,
                    })
                  }
                >
                  Nueva Solicitud
                </Button>
                <Button
                  className="primary-b"
                  type="primary"
                  icon={<PlusSquareOutlined style={{ fontSize: "16px" }} />}
                  onClick={() =>
                    history.push({
                      pathname: `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/Solicitudes/capital-trabajo`,
                      state: 0,
                    })
                  }
                >
                  Nueva Solicitud Capital de Trabajo
                </Button>
                <ExportCSV
                  csvData={solicitudes.data}
                  fileName={"solicitudes"}
                />
              </Space>
            }
          >
            <Table
              loading={loadingApi}
              columns={columns}
              dataSource={dataUsuario}
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
        title="Detalle de la Solicitud"
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
            <Descriptions.Item label="Solicitud" span={1}>
              {formik.values.idSolicitud}
            </Descriptions.Item>
            <Descriptions.Item label="Moneda" span={1}>
              {formik.values.moneda}
            </Descriptions.Item>
            <Descriptions.Item label="Cedente" span={1}>
              {formik.values.cedente}
            </Descriptions.Item>
            <Descriptions.Item label="Pagador" span={1}>
              {formik.values.aceptante}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Operación" span={1}>
              {formik.values.tipoOperacion}
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
