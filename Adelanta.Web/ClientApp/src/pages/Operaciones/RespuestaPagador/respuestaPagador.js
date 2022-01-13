import { useState, useEffect, useContext } from "react";
import { PageHeader, Row, Col, Card, Table, Button, Space, Checkbox, InputNumber, DatePicker, Form, Descriptions, notification, Modal } from "antd";
import { SaveOutlined, SendOutlined, SearchOutlined } from "@ant-design/icons";
import { ContentComponent } from "../../../components/layout/content";
import { getColumnSearchProps } from "../../../components/table/configTable";
import { useModal } from "../../../hooks/useModal";
import { listarDocumentosFiltros, documentosActualizar, documentosEnviarCavali } from "../../../services/documentoService";
import { obtenerSolicitudDetalle } from "../../../services/solicitudService";
import { ModalComponent } from "../../../components/modal/modal";
import moment from "moment";
import { estados, mensajeError, mensajeOK } from "../../../utils/constant";
import { AuthContext } from "../../../context/authProvider";
import { useFormik } from "formik";
export const RespuestaPagadorPage = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const { isModal, showModal, hiddenModal } = useModal();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [detalleSolicitud, setDetalleSolicitud] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [dataFechaInicio, setDataFechaInicio] = useState(10);
  const dateFormat = "DD/MM/YYYY";
  const formik = useFormik({
    initialValues: {
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
      title: "Sol.",
      dataIndex: "idSolicitud",
      /*  ...getColumnSearchProps("pagador"),*/
      render: (text, _, index) => {
        return (
          <a type="primary" onClick={(v) => verDetalle(v, _.idSolicitud)}>
            {_.idSolicitud}
          </a>
        );
      },
    },
    {
      title: "Aceptante",
      dataIndex: "pagador",
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "RUC",
      dataIndex: "rucPagador",
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "Cedente",
      dataIndex: "proveedor",
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "RUC",
      dataIndex: "rucProveedor",
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "Nro. Documento",
      dataIndex: "serie",
      key: "serie",
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "Total Factura",
      dataIndex: "montoTotalVenta",
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
      editable: true,
      /*  ...getColumnSearchProps("pagador"),*/
    },
    {
      title: "F. Creación",
      dataIndex: "fechaCreacion",
      editable: true,
      /*  ...getColumnSearchProps("pagador"),*/
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
              data-solicitud={_.idSolicitud}
            />
          </>
        );
      },
    },
    {
      title: "T. Operación",
      dataIndex: "tipoOperacion",
      /*  ...getColumnSearchProps("pagador"),*/
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
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  function onChangeChecked(e) {
    console.log(`checked = ${JSON.stringify(e.target)}`);
  }
  function onChange(e, index, dateString) {
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
        let fechaDesde = document.getElementById('dFechaDesde').value;
        let fechaHasta = document.getElementById('dFechaHasta').value;
        if (!filtro) {
          debugger
          fechaDesde = moment().format('DD/MM/YYYY');
          fechaHasta = moment().format('DD/MM/YYYY');
          setFiltro(true);
        }
        const filtros = {
          fechaDesde,
          fechaHasta,
          idEstado: estados.REGISTRADO
        }
        if (fechaDesde !== '' && fechaHasta !== '') {
          let data = new FormData();
          data.append("json", JSON.stringify(filtros));
          const rpta = await listarDocumentosFiltros(data);
          if (suscribe) {
            console.log(rpta.data);
            setData(rpta.data);
            setLoadingApi(false);
          }
        } else {
          notification['info']({
            message: 'Información',
            description:
              `Seleccione fechas.`,
          });
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
                mensajeOK.GENERAL,
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
        const solicitudes = [];
        let cantidadError = 0;
        if (validarCantidadEnviadosCavali()) {
          for (let i = 0; i < cantidadControles; i++) {
            if (document.getElementsByName("cavali")[i].checked) {
              if (document.getElementsByName("fecha")[i].value !== '' && document.getElementsByName("neto")[i].value !== '') {
                const documento = {
                  fechaConfirmada: document.getElementsByName("fecha")[i].value,
                  netoConfirmado: document.getElementsByName("neto")[i].value.replaceAll(',', ''),
                  idDocumento: document.getElementsByName("neto")[i].getAttribute("data"),
                  estado: estados.PENDIENTE_CAVALI,
                  idSolicitud: document.getElementsByName("neto")[i].getAttribute("data-solicitud")
                };
                solicitudes.push({
                  idSolicitud: document.getElementsByName("neto")[i].getAttribute("data-solicitud")
                });
                lista.push(documento);
              } else {
                cantidadError++;
                const documento = data.find(element => element.idDocumento == document.getElementsByName("neto")[i].getAttribute("data"));
                notification['info']({
                  message: 'Información',
                  description:
                    mensajeError.ENVIO_CAVALI.replace('{0}', documento.serie),
                });
              }
            }
          }
          if (cantidadError === 0) {
            const solicitudesFilter = [...new Map(solicitudes.map(item => [item.idSolicitud, item])).values()];
            console.log(solicitudesFilter)
            for (let i = 0; i < solicitudesFilter.length; i++) {
              let documentosEnviar = [];
              for (let s = 0; s < lista.length; s++) {
                if (solicitudesFilter[i].idSolicitud === lista[s].idSolicitud) {
                  documentosEnviar.push(lista[s]);
                }
              }

              let data = new FormData();
              data.append("json", JSON.stringify(documentosEnviar));
              data.append("idSolicitud", solicitudesFilter[i].idSolicitud);
              const rpta = await documentosEnviarCavali(data);
              if (rpta.status === 204) {
                for (let p = 0; p < cantidadControles; p++) {
                  if (document.getElementsByName("cavali")[p].checked) {
                    document.getElementsByName("cavali")[p].click();
                  }
                }
                notification['success']({
                  message: `Se proceso correctamente la solicitud ${solicitudesFilter[i].idSolicitud}`,
                  description:
                    mensajeOK.CORRECTO_CAVALI,
                });
              } else {
                setLoadingApi(false);
              }
            }
            cargarDatos();
            setLoadingApi(false);
          } else {
            setLoadingApi(false);
          }
        } else {
          notification['info']({
            message: 'Información',
            description:
              mensajeError.SELECCIONE_UNO,
          });
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
  const validarCantidadEnviadosCavali = () => {
    debugger
    let cantidad = 0;
    const cantidadControles = document.getElementsByName("fecha").length;
    for (let i = 0; i < cantidadControles; i++) {
      if (document.getElementsByName("cavali")[i].checked) {
        cantidad++;
      }
    }
    return cantidad > 0 ? true : false;
  }
  const columsDetalle = [
    {
      title: "Nro. Factura",
      dataIndex: "serie",
    },
    {
      title: "Fecha Pago",
      dataIndex: "fechaEmision",
    },
    {
      title: "F. resguardo",
      dataIndex: "fondoResguardo",
    },
    {
      title: "Monto Pago",
      dataIndex: "montoTotalVenta",
    },
    {
      title: "Intereses",
      dataIndex: "interesesIGV",
    },
    {
      title: "Gastos",
      dataIndex: "gastosIGV",
    },
    {
      title: "Desembolso",
      dataIndex: "montoDesembolso",
    },
  ];

  useEffect(() => {
    setDataFechaInicio(moment().format('DD/MM/YYYY'));
    cargarDatos();
  }, []);
  return (
    <ContentComponent>
      <PageHeader
        backIcon={null}
        className="site-page-header"
        onBack={() => null}
        title="Respuesta Pagador"
        style={{ backgroundcolor: "#f0f2f5" }}
      />
      <Row>
        <Col span={24}>
          <Card
            title=""
            actions={[]}
            extra={
              <>
                <Space>
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    placeholder='Fecha Creación desde:'
                    style={{ width: "200px" }}
                    id={'dFechaDesde'}
                    label={'Field'}
                    defaultValue={moment(moment(), dateFormat)}
                    format={dateFormat}
                  />
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    placeholder='Fecha Creación hasta:'
                    style={{ width: "200px" }}
                    id={'dFechaHasta'}
                    defaultValue={moment(moment(), dateFormat)}
                    format={dateFormat}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined style={{ fontSize: "16px" }} />}
                    onClick={cargarDatos}
                    loading={loadingApi}
                  >
                    Buscar
                  </Button>
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
              {formik.values.idSolicitud}
            </Descriptions.Item>
            <Descriptions.Item label="Moneda" span={1}>
              {formik.values.moneda}
            </Descriptions.Item>
            <Descriptions.Item label="Cedente" span={1}>
              {formik.values.cedente}
            </Descriptions.Item>
            <Descriptions.Item label="Pagador" span={1}>
              Rimac
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Operación" span={1}>
              {formik.values.tipoOperacion}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="Datos Adicionales">
            <Descriptions.Item label="Fecha Operación" span={1}>
            </Descriptions.Item>
            <Descriptions.Item label="TNM Op." span={1}>
              {formik.values.tasaNominalMensual} %
            </Descriptions.Item>
            <Descriptions.Item label="TNA op." span={1}>
              {formik.values.tasaNominalAnual} %
            </Descriptions.Item>
            <Descriptions.Item label="Ejecutivo" span={1}>
              {formik.values.ejecutivoComercial}
            </Descriptions.Item>
            <Descriptions.Item label="Financiamiento" span={1}>
              {formik.values.financiamiento} %
            </Descriptions.Item>
            <Descriptions.Item label="F. Resguardo" span={1}>
              {formik.values.fondoResguardo} %
            </Descriptions.Item>
            <Descriptions.Item label="Com. Estruct." span={1}>
              {formik.values.comisionEstructuracion} %
            </Descriptions.Item>
            <Descriptions.Item label="Cant. Doc." span={1}>
              {formik.values.cantidadDocumentos}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="Datos Contractuales">
            <Descriptions.Item label="Contrato" span={1}>
              S/. {formik.values.contrato}
            </Descriptions.Item>
            <Descriptions.Item label="Gatos al ext." span={1}>
              S/. 2000.00
            </Descriptions.Item>
            <Descriptions.Item label="Com. Carta Not." span={1}>
              S/. {formik.values.comisionCartaNotarial}
            </Descriptions.Item>
            <Descriptions.Item label="Ser. Cobr. Doc" span={1}>
              S/. {formik.values.servicioCobranza}
            </Descriptions.Item>
            <Descriptions.Item label="Ser. Custodia" span={1}>
              S/. {formik.values.servicioCustodia}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Carta Not." span={1}>
              22/10/2021
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
    </ContentComponent >
  );
};
