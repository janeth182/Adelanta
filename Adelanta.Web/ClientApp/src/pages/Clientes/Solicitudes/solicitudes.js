import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  PageHeader,
  Row,
  Col,
  Card,
  Table,
  Button,
  Tag,
  Form,
  Descriptions,
  Space,
} from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { solicitudes } from "../../../model/mocks/solicitudes";
import { desembolsado } from "../../../model/mocks/desembolsado";
import { ModalComponent } from "../../../components/modal/modal";
import { ExportCSV } from "../../../utils/excel";
import { listarSolicitudes } from "../../../services/solicitudService";
export const SolicitudesPage = () => {
  const { isModal, showModal, hiddenModal } = useModal();
  const { isMessage, addMessage, messageInfo } = useMessageApi();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const history = useHistory();
  const columns = [
    {
      title: "Nro. Solicitud",
      dataIndex: "idSolicitud",
      ...getColumnSearchProps("idSolicitud"),
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
  ];

  const columsLiquidacion = [
    {
      title: "Documento",
      dataIndex: "nroDocumento",
      ...getColumnSearchProps("nroDocumento"),
    },
    {
      title: "Fecha de Pago",
      dataIndex: "fechaPago",
      ...getColumnSearchProps("fechaPago"),
    },
    {
      title: "Monto de Pago",
      dataIndex: "montoPago",
      ...getColumnSearchProps("montoPago"),
    },
    {
      title: "F. Resguardo",
      dataIndex: "fResguardo",
      ...getColumnSearchProps("fResguardo"),
    },
    {
      title: "Monto Neto",
      dataIndex: "montoNeto",
      ...getColumnSearchProps("montoNeto"),
    },
    {
      title: "Intereses",
      dataIndex: "intereses",
      ...getColumnSearchProps("intereses"),
    },
    {
      title: "Gastos",
      dataIndex: "gastos",
      ...getColumnSearchProps("gastos"),
    },
    {
      title: "Desembolso",
      dataIndex: "desembolso",
      ...getColumnSearchProps("desembolso"),
    },
  ];

  useEffect(() => {
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
  }, []);

  const handleFormatColumns = (dataArray = []) => {
    const data = dataArray.reduce((ac, el) => {
      ac.push({
        ...el,
      });
      return ac;
    }, []);
    setDataUsuario(data);
  };
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
        title="Liquidación"
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
            <Descriptions.Item label="Liquidacion" span={1}>
              LIQ-0004-2021
            </Descriptions.Item>
            <Descriptions.Item label="Moneda" span={1}>
              Soles
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
          <Table
            loading={loadingApi}
            columns={columsLiquidacion}
            dataSource={desembolsado.data}
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
