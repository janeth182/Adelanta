import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Upload,
  Space,
  message,
  Descriptions,
  Tabs,
  Table,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ContentComponent } from "../../../components/layout/content";
import { useMessageApi } from "../../../hooks/useMessage";
import { MessageApi } from "../../../components/message/message";
import {
  SaveOutlined,
  RetweetOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useModal } from "../../../hooks/useModal";
import { cargarDocumentos } from "../../../services/solicitudService";
import XMLParser from "react-xml-parser";
import { ModalComponent } from "../../../components/modal/modal";

export const NuevaSolicitudPage = () => {
  const { isModal, showModal, hiddenModal } = useModal();
  const { isMessage, messageInfo } = useMessageApi();
  const [loadingApi, setLoadingApi] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [fileListPDF, setFileListPDF] = useState([]);
  const [fileListXLSX, setFileListXLSX] = useState([]);
  const [tipoOperacion, setTipoOperacion] = useState("F");
  const [documentoCabecera, setDocumentoCabecera] = useState([]);
  const [documentoDetalle, setDocumentoDetalle] = useState([]);
  const [listaError, setListaError] = useState([]);
  const [listaRespuesta, setListaRespuesta] = useState([]);
  const history = useHistory();
  const { TabPane } = Tabs;
  const urlSolicitud = `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/Solicitudes`;
  const columsRespuesta = [
    {
      title: "Nro Solicitud",
      dataIndex: "idSolicitud",
    },
    {
      title: "Aceptante",
      dataIndex: "aceptante",
    },
    {
      title: "Ruc",
      dataIndex: "ruc",
    },
    {
      title: "Importe Total",
      dataIndex: "importeTotal",
    },
    {
      title: "Nro Documentos",
      dataIndex: "cantidadDoc",
    },
  ];

  const handleupload = async (file) => {
    try {
      if (file.type === "text/xml") {
        let reader = new FileReader();
        reader.fileName = file.name;
        reader.onload = (file) => {
          const xml = file.target.result;
          const jsonDataFromXml = new XMLParser().parseFromString(
            xml,
            "text/xml"
          );
          const detalle = {};
          jsonDataFromXml.children.forEach((nodo) => {
            if (nodo.name === "cac:AccountingCustomerParty") {
              nodo.children.forEach((child) => {
                if (child.name === "cac:Party") {
                  child.children.forEach((det) => {
                    if (det.name === "cac:PartyIdentification") {
                      detalle.rucPagador = det.children[0].value;
                    } else if (det.name === "cac:PartyLegalEntity") {
                      det.children.forEach((legal) => {
                        if (legal.name === "cbc:RegistrationName") {
                          detalle.pagador = legal.value;
                        }
                      });
                    }
                  });
                }
              });
            } else if (nodo.name === "cac:SellerSupplierParty") {
              detalle.direccionPagador =
                nodo.children[0].children[0].children[0].children[0].value;
            } else if (nodo.name === "cac:AccountingSupplierParty") {
              nodo.children.forEach((child) => {
                if (child.name === "cac:Party") {
                  child.children.forEach((det) => {
                    if (det.name === "cac:PartyName") {
                      detalle.proveedor = det.children[0].value;
                    } else if (det.name === "cac:PartyIdentification") {
                      detalle.rucProveedor = det.children[0].value;
                    }
                  });
                }
              });
            } else if (nodo.name === "cbc:ID") {
              detalle.serie = nodo.value;
            } else if (nodo.name === "cbc:DocumentCurrencyCode") {
              detalle.moneda = nodo.value;
            } else if (nodo.name === "cbc:DueDate") {
              detalle.fechaEmision = nodo.value;
            } else if (nodo.name === "cbc:IssueTime") {
              detalle.horaEmision = nodo.value;
            } else if (nodo.name === "cbc:DueDate") {
              detalle.fechaVencimiento = nodo.value;
            } else if (nodo.name === "cac:PaymentTerms") {
              if (nodo.children.length === 3) {
                detalle.formaPago = nodo.children[1].value;
              }
            } else if (nodo.name === "cac:TaxTotal") {
              nodo.children.forEach((child) => {
                if (child.name === "cbc:TaxAmount") {
                  detalle.montoTotalImpuesto = child.value;
                } else if (child.name === "cbc:TaxSubtotal") {
                  child.children.forEach((det) => {
                    if (det.name === "cac:TaxCategory") {
                      detalle.codigoTributo = det.children[0].children[0].value;
                      detalle.nombreTributo = det.children[0].children[1].value;
                      detalle.codigoInternacionalTributo =
                        det.children[0].children[2].value;
                    }
                  });
                }
              });
            } else if (nodo.name === "cac:LegalMonetaryTotal") {
              debugger;
              nodo.children.forEach((child) => {
                if (child.name === "cbc:PayableAmount") {
                  detalle.montoTotalVenta = child.value;
                } else if (child.name === "cbc:LineExtensionAmount") {
                  detalle.montoOperacion = child.value;
                }
              });
            }
          });
          detalle.xml = file.target.result;
          detalle.nombreArchivo = file.target.fileName;
          detalle.archivoPdf = `${file.target.fileName.split(".")[0]}.pdf`;
          detalle.archivoExcel =
            tipoOperacion === "C"
              ? `${file.target.fileName.split(".")[0]}.xlsx`
              : "";
          setDocumentoDetalle((documentoDetalle) => [
            ...documentoDetalle,
            detalle,
          ]);
        };
        reader.readAsText(file);
        setFileList((fileList) => [...fileList, file]);
      } else if (file.type === "application/pdf") {
        setFileListPDF((fileListPDF) => [...fileListPDF, file]);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFileListXLSX((fileListXLSX) => [...fileListXLSX, file]);
      } else {
        message.error("Formato de archivo no permitido.");
      }
      return false;
    } catch (error) {
      message.error("Formato de archivo no permitido.");
      return true;
    }
  };
  const removeFile = async (file) => {
    try {
      debugger;
      if (file.type === "text/xml") {
        const indice = fileList.indexOf(file);
        const nuevaLista = fileList.slice();
        nuevaLista.slice(indice, 1);
        setFileList(nuevaLista);
      } else if (file.type === "application/pdf") {
        setFileListPDF((fileListPDF) => [...fileListPDF, file]);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFileListXLSX((fileListXLSX) => [...fileListXLSX, file]);
      } else {
        message.error("Formato de archivo no permitido.");
      }
      return true;
    } catch (error) {
      message.error("Formato de archivo no permitido.");
      return false;
    }
  };
  const enviarDocumentos = async () => {
    let suscribe = true;
    let listaRespuesta = [];
    let listaError = [];
    (async () => {
      setLoadingApi(true);
      try {
        console.log(documentoDetalle);
        const cabecera = documentoDetalle.filter(
          (detalleP, index, documentoDetalle) =>
            index ===
            documentoDetalle.findIndex(
              (p) =>
                p.rucPagador === detalleP.rucPagador &&
                p.moneda === detalleP.moneda
            )
        );
        for (let c = 0; c < cabecera.length; c++) {
          let detalle = [];
          if (
            cabecera[c].rucPagador !== undefined &&
            cabecera[c].moneda !== undefined
          ) {
            for (let d = 0; d < documentoDetalle.length; d++) {
              if (tipoOperacion === "F") {
                if (
                  cabecera[c].rucPagador === documentoDetalle[d].rucPagador &&
                  cabecera[c].moneda === documentoDetalle[d].moneda
                ) {
                  detalle.push(documentoDetalle[d]);
                }
              } else {
                if (
                  cabecera[c].rucProveedor ===
                    documentoDetalle[d].rucProveedor &&
                  cabecera[c].moneda === documentoDetalle[d].moneda
                ) {
                  detalle.push(documentoDetalle[d]);
                }
              }
            }
            if (fileListPDF.length > 0) {
              let data = new FormData();
              for (let i = 0; i < fileList.length; i++) {
                data.append("file[]", fileListPDF[i]);
              }

              if (tipoOperacion === "F") {
                data.append("ruc", cabecera[c].rucPagador);
                data.append("razonSocial", cabecera[c].pagador);
              } else {
                data.append("ruc", cabecera[c].rucProveedor);
                data.append("razonSocial", cabecera[c].proveedor);
              }
              data.append("tipoOperacion", tipoOperacion);
              data.append("moneda", cabecera[c].moneda);
              data.append("detalle", JSON.stringify(detalle));
              const rpta = await cargarDocumentos(data);
              if (rpta.status === 200) {
                setListaRespuesta((listaRespuesta) => [
                  ...listaRespuesta,
                  rpta.data,
                ]);
                //message.success("Solicitud registrada correctamente.");
                detalle = [];
              } else {
                listaError.push(cabecera);
                /*message.error(
                  "Ocurrio un error al momento de procesar la solicitud."
                );*/
                setLoadingApi(false);
              }
            } else {
              message.info("Usted no ha cargado archivos.");
              setLoadingApi(false);
            }
          } else {
            message.info("No se pudo procesar el archivo.");
            setLoadingApi(false);
          }
        }
        showModal();
      } catch (error) {
        setLoadingApi(false);
        message.error("Ocurrio un error al momento de procesar la solicitud.");
      }
    })();

    return () => {
      suscribe = false;
    };
  };
  const obtenerTipoOperacion = async (e) => {
    setTipoOperacion(e);
  };
  const regresarPaginaSolicitud = () => {};
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
            title="Nueva Solicitud"
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: `0 16px`,
                }}
              >
                <Button
                  type="primary"
                  onClick={enviarDocumentos}
                  icon={<SaveOutlined />}
                  loading={loadingApi}
                >
                  Procesar
                </Button>
              </div>,
            ]}
          >
            <Form layout="vertical">
              <Descriptions title="Información">
                <Descriptions.Item label="">
                  Para registrar una nueva solicitud, haga click en el boton
                  "Adjuntar Carpeta", y seleccione la carpeta que desea ceder a
                  Adelanta Factoring.
                  <br />
                  Luego de que los documentos hayan sido cargados, hacer click
                  en el botón procesar, para registrarlos en el sistema.
                </Descriptions.Item>
              </Descriptions>
              <Descriptions title="Tipo de Servicio"></Descriptions>
              <Tabs type="card" onChange={obtenerTipoOperacion}>
                <TabPane tab="Factoring" key="F">
                  <Form layout="vertical" className="ant-advanced-search-form">
                    <Descriptions title="Proceso de Carga"></Descriptions>
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="large"
                    >
                      <Upload
                        action=""
                        listType="picture"
                        maxCount={100}
                        beforeUpload={handleupload}
                        multiple
                        className="upload-list-inline"
                        directory
                        onRemove={removeFile}
                      >
                        <Button icon={<UploadOutlined />}>
                          Adjuntar Carpeta
                        </Button>
                      </Upload>
                    </Space>
                  </Form>
                </TabPane>
                <TabPane tab="Confirming" key="C">
                  <Form layout="vertical" className="ant-advanced-search-form">
                    <Descriptions title="Proceso de Carga"></Descriptions>
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="large"
                    >
                      <Upload
                        action=""
                        listType="picture"
                        maxCount={100}
                        className="upload-list-inline"
                        multiple
                        beforeUpload={handleupload}
                        directory
                      >
                        <Button icon={<UploadOutlined />}>
                          Adjuntar Carpeta
                        </Button>
                      </Upload>
                    </Space>
                  </Form>
                </TabPane>
              </Tabs>
            </Form>
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
          <Descriptions title="Solicitudes Generadas"></Descriptions>
          <Table
            loading={loadingApi}
            columns={columsRespuesta}
            dataSource={listaRespuesta}
            size="small"
          />
        </Form>
      </ModalComponent>
    </ContentComponent>
  );
};
