import { useState, useEffect } from "react";
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
  Tag,
} from "antd";
import { SaveOutlined, SendOutlined, EditOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import { respuesta } from "../../../model/mocks/respuesta-pagador";
import {
  listarDocumentos,
  documentosActualizarEstado,
} from "../../../services/documentoService";
import { ModalComponent } from "../../../components/modal/modal";
import { detalleFacturas } from "../../../model/mocks/detalleFactura";
import moment from "moment";
export const RespuestaPagadorPage = () => {
  const { isModal, showModal, hiddenModal } = useModal();
  const { isMessage, addMessage, messageInfo } = useMessageApi();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [documento, setDocumento] = useState([]);
  const history = useHistory();

  const columns = [
    {
      title: "Solicitud",
      dataIndex: "idSolicitud",
      ...getColumnSearchProps("idSolicitud"),
      render: (_, record) => {
        return (
          <a type="primary" onClick={showModal}>
            {record.idSolicitud}
          </a>
        );
      },
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
      render: (_, record) => {
        return (
          <>
            <DatePicker
              //defaultValue={moment('record.fechaVencimiento', "DD/MM/YYYY")}
              name={"fecha"}
              onChange={onChange}
              format={"DD/MM/YYYY"}
            />
          </>
        );
      },
    },
    {
      title: "Neto Confirmado",
      dataIndex: "netoConfirmado",
      render: (_, record) => {
        return (
          <>
            <InputNumber
              defaultValue={record.netoConfirmado}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={onChangeInput}
              name={"neto"}
              data={record.idDocumento}
            />
          </>
        );
      },
    },
    {
      title: "T. Operación",
      dataIndex: "tipoOperacion",
      ...getColumnSearchProps("tipoOperacion"),
    },
    {
      title: "Cavali",
      dataIndex: "enviadoCavali",
      render: (_, record) => {
        return (
          <>
            <Checkbox
              onChange={onChangeChecked}
              name={"cavali"}
              defaultValue={`${JSON.stringify(record)}`}
            ></Checkbox>
          </>
        );
      },
    },
  ];

  function onChangeChecked(e) {
    console.log(`checked = ${JSON.stringify(e.target)}`);
  }
  function onChange(e, dateString) {
    console.log(e, dateString);
  }
  function onChangeInput(e) {
    console.log(e);
  }
  const guardarDocumento = async (e) => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        const cantidadControles = document.getElementsByName("fecha").length;
        const lista = [];
        for (let i = 0; i < cantidadControles; i++) {
          if (
            document.getElementsByName("fecha")[i].value !== "" ||
            document.getElementsByName("neto")[i].value !== ""
          ) {
            const documento = {
              fechaConfirmada: document.getElementsByName("fecha")[i].value,
              netoConfirmado: document.getElementsByName("neto")[i].value,
              idDocumento: document
                .getElementsByName("neto")
              [i].getAttribute("data"),
              estado: 0
            };
            lista.push(documento);
          }
        }
        debugger;
        const Json = { Json: (lista) };
        let data = new FormData();
        data.append("json", JSON.stringify(lista));
        const rpta = await documentosActualizarEstado(data);
        if (rpta.status === 200) {
          message.success("Se proceso correctamente.");
          setLoadingApi(false);
        } else {
          setLoadingApi(false);
        }
      } catch (error) {
        setLoadingApi(false);
        message.error("Ocurrio un error al momento de procesar la solicitud.");
      }
    })();
    return () => {
      suscribe = false;
    };
  };
  const enviarCavali = async (e) => {
    message.success("Se proceso correctamente.");
  };

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
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        const rpta = await listarDocumentos(0);
        if (suscribe) {
          console.log(rpta.data);
          setDataUsuario(rpta.data);
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
            title="Respuesta Pagador"
            actions={[]}
            extra={
              <>
                <Space>
                  <Button
                    className="primary-b"
                    type="primary"
                    icon={<SaveOutlined style={{ fontSize: "16px" }} />}
                    onClick={guardarDocumento}
                  >
                    Guardar
                  </Button>
                  <Button
                    className="primary-b"
                    type="primary"
                    icon={<SendOutlined style={{ fontSize: "16px" }} />}
                    onClick={enviarCavali}
                  >
                    Cavali
                  </Button>
                </Space>
              </>
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
              22/10/2021
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
