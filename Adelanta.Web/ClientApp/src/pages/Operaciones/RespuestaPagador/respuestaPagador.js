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
  Modal
} from "antd";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import {
  listarDocumentos,
  documentosActualizar,
} from "../../../services/documentoService";
import { ModalComponent } from "../../../components/modal/modal";
import { detalleFacturas } from "../../../model/mocks/detalleFactura";
import moment from "moment";
import { estados, mensajeError } from "../../../utils/constant";
import { AuthContext } from "../../../context/authProvider";
export const RespuestaPagadorPage = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const { isModal, showModal, hiddenModal } = useModal();
  const { isMessage, addMessage, messageInfo } = useMessageApi();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
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
      key: "serie",
      ...getColumnSearchProps("serie"),
      //render: (text, _, index) => <Input value={text} onChange={(v) => onChangeDataCell(v, index)} />,
    },
    {
      title: "Total Factura",
      dataIndex: "montoTotalVenta",
      ...getColumnSearchProps("montoTotalVenta"),
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
      editable: true,
      ...getColumnSearchProps("moneda"),
    },
    {
      title: "F. Pago Confirmado",
      dataIndex: "fechaPago",
      render: (text, _, index) => {
        if (text !== null && text !== '00/00/0000') {
          return (
            <DatePicker
              value={moment(text, "DD/MM/YYYY")}
              onChange={(v) => onChange(v, index)}
              name={"fecha"}
              format={"DD/MM/YYYY"}
            />
          );
        } else {
          return (
            <DatePicker
              name={"fecha"}
              onChange={onChange}
              format={"DD/MM/YYYY"}
              disabledDate={disabledDate}
            />
          )
        }
      },
    },
    {
      title: "Neto Confirmado",
      dataIndex: "netoConfirmado",
      key: "netoConfirmado",
      render: (text, _, index) => {
        return (
          <>
            <InputNumber
              value={text}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(v) => onChangeNetoConfirmado(v, index)}
              name={"neto"}
              data={_.idDocumento}
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
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  function onChangeChecked(e) {
    console.log(`checked = ${JSON.stringify(e.target)}`);
  }
  function onChange(e, index, dateString) {
    console.log(e, dateString);
    if (page > 1) {
      index = ((page - 1) * pageSize) + index;
    }
    const newData = [...data];
    const newItem = { ...newData[index] };
    newItem.fechaPago = dateString === undefined ? null : dateString;
    newData[index] = newItem;
    setData(newData);
  }
  const onChangeNetoConfirmado = (e, index) => {
    if (page > 1) {
      index = ((page - 1) * pageSize) + index;
    }
    const newData = [...data];
    const newItem = { ...newData[index] };
    newItem.netoConfirmado = e;
    newData[index] = newItem;
    setData(newData);
  };
  const cargarDatos = async () => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        const rpta = await listarDocumentos(7);
        if (suscribe) {
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
  const guardarDocumento = async (e) => {
    let suscribe = true;
    let cantError = 0;
    let mensajes = '';
    (async () => {
      setLoadingApi(true);
      try {
        const cantidadControles = document.getElementsByName("fecha").length;
        const lista = [];
        debugger
        for (let i = 0; i < cantidadControles; i++) {
          const idDocumento = document.getElementsByName("neto")[i].getAttribute("data");
          const registro = data.find(d => d.idDocumento == idDocumento);
          const netoConfirmado = document.getElementsByName("neto")[i].value == "0" ? "" : document.getElementsByName("neto")[i].value;
          const fecha = document.getElementsByName("fecha")[i].value;
          if (fecha !== "" && netoConfirmado !== "") {
            if (+(netoConfirmado.replaceAll(',', '')) <= registro.montoTotalVenta) {
              const documento = {
                fechaConfirmada: fecha,
                netoConfirmado: netoConfirmado.replaceAll(',', ''),
                idDocumento: idDocumento,
                estado: estados.REGISTRADO,
                usuario: user.usuario
              };
              lista.push(documento);
            } else {
              cantError++;
              mensajes += `<li>El neto confirmado del documento ${registro.serie} no debe ser mayor al total factura.</li>`;
              notification['info']({
                message: 'Información',
                description:
                  `El neto confirmado del documento ${registro.serie} no debe ser mayor al total factura.`,
              });
            }
          } else if (fecha === "" && netoConfirmado === "") {
            const documento = {
              fechaConfirmada: document.getElementsByName("fecha")[i].value,
              netoConfirmado: netoConfirmado,
              idDocumento: idDocumento,
              estado: estados.REGISTRADO,
              usuario: user.usuario
            };
            lista.push(documento);
          } else if (fecha !== "" && netoConfirmado === "") {
            cantError++;
            notification['info']({
              message: 'Información',
              description:
                `Ingresar el neto confirmado del documento ${registro.serie}.`,
            });
          } else if (fecha === "" && netoConfirmado !== "") {
            cantError++;
            notification['info']({
              message: 'Información',
              description:
                `Ingresar la fecha pago confirmado del documento ${registro.serie}.`,
            });
          }
        }
        if (cantError === 0) {
          let data = new FormData();
          data.append("json", JSON.stringify(lista));
          const rpta = await documentosActualizar(data);
          if (rpta.status === 204) {
            notification['success']({
              message: 'Se proceso correctamente',
              description:
                'Los documentos enviados han sido actualizados correctamente.',
            });
            setLoadingApi(false);
            cargarDatos();
          } else {
            setLoadingApi(false);
          }
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
  const enviarCavali = async (e) => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        const cantidadControles = document.getElementsByName("fecha").length;
        const lista = [];
        for (let i = 0; i < cantidadControles; i++) {
          if (document.getElementsByName("cavali")[i].checked) {
            const documento = {
              fechaConfirmada: document.getElementsByName("fecha")[i].value,
              netoConfirmado: document.getElementsByName("neto")[i].value.replaceAll(',', ''),
              idDocumento: document
                .getElementsByName("neto")
              [i].getAttribute("data"),
              estado: estados.CONFORMIDAD_EXPRESA
            };
            lista.push(documento);
          }
        }
        let data = new FormData();
        data.append("json", JSON.stringify(lista));
        const rpta = await documentosActualizar(data);
        if (rpta.status === 204) {
          for (let i = 0; i < cantidadControles; i++) {
            if (document.getElementsByName("cavali")[i].checked) {
              document.getElementsByName("cavali")[i].click();
            }
          }
          notification['success']({
            message: 'Se proceso correctamente',
            description:
              'Los documentos enviados a Cavali, han sido procesados correctamente.',
          });
          setLoadingApi(false);
          cargarDatos();
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
        const rpta = await listarDocumentos(7);
        if (suscribe) {
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
                    loading={loadingApi}
                  >
                    Guardar
                  </Button>
                  <Button
                    className="primary-b"
                    type="primary"
                    icon={<SendOutlined style={{ fontSize: "16px" }} />}
                    onClick={enviarCavali}
                    loading={loadingApi}
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
              dataSource={data}
              size="middle"
              bordered={true}
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
