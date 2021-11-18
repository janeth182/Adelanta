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
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      tipoFactoring: 0,
      tipoConfirming: 0,
    },
    validationSchema: Yup.object().shape({
      tipoFactoring: Yup.string().required("El campo es requerido"),
      tipoConfirming: Yup.string().required("El campo es requerido"),
    }),
    onSubmit: (value) => {
      //handleNewUsuario(value);
    },
  });
  const { TabPane } = Tabs;
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
              detalle.pagador = nodo.children[0].children[1].children[0].value;
              detalle.rucPagador =
                nodo.children[0].children[0].children[0].value;
            } else if (nodo.name === "cac:SellerSupplierParty") {
              detalle.direccionPagador =
                nodo.children[0].children[0].children[0].children[0].value;
            } else if (nodo.name === "cac:AccountingSupplierParty") {
              detalle.proveedor =
                nodo.children[0].children[2].children[0].value;
              detalle.rucProveedor =
                nodo.children[0].children[0].children[0].value;
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
              detalle.montoTotalImpuesto = nodo.children[0].value;
              detalle.codigoTributo =
                nodo.children[1].children[2].children[1].children[0].value;
              detalle.nombreTributo =
                nodo.children[1].children[2].children[1].children[1].value;
              detalle.codigoInternacionalTributo =
                nodo.children[1].children[2].children[1].children[2].value;
            } else if (nodo.name === "cac:LegalMonetaryTotal") {
              detalle.montoOperacion = nodo.children[0].value;
              detalle.montoTotalVenta = nodo.children[1].value;
            }
          });
          detalle.xml = file.target.result;
          detalle.nombreArchivo = file.target.fileName;
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
  const removeFile = async (file) => {};
  const enviarDocumentos = async () => {
    debugger;
    console.log(documentoDetalle);
    const cabecera = documentoDetalle.filter(
      (detalleP, index, documentoDetalle) =>
        index ===
        documentoDetalle.findIndex(
          (p) =>
            p.rucPagador === detalleP.rucPagador && p.moneda === detalleP.moneda
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
              cabecera[c].rucProveedor === documentoDetalle[d].rucProveedor &&
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
          data.append("tipoOperacion", tipoOperacion);
          if (tipoOperacion === "F") {
            data.append("ruc", cabecera[c].rucPagador);
            data.append("razonSocial", cabecera[c].pagador);
          } else {
            data.append("ruc", cabecera[c].rucProveedor);
            data.append("razonSocial", cabecera[c].proveedor);
          }
          data.append("moneda", cabecera[c].moneda);
          data.append("detalle", JSON.stringify(detalle));
          const rpta = await cargarDocumentos(data);
          if (rpta.status === 200) {
            message.success("Solicitud registrada correctamente.");
            detalle = [];
          } else {
            message.error(
              "Ocurrio un error al momento de procesar la solicitud."
            );
          }
        } else {
          message.info("Usted no ha cargado archivos.");
        }
      } else {
        message.info("No se pudo procesar el archivo.");
      }
    }
  };
  const obtenerTipoOperacion = async (e) => {
    setTipoOperacion(e);
  };

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
                      pathname: `${process.env.REACT_APP_RUTA_SERVIDOR}clientes/solicitudes`,
                      state: 0,
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
                  Guardar
                </Button>
              </div>,
            ]}
          >
            <Form layout="vertical">
              <Descriptions title="Información">
                <Descriptions.Item label="">
                  Para registrar una nueva solicitud, haga click en el boton
                  "Cargar Documentos", y seleccione los documentos que desea
                  ceder a Adelanta Factoring.
                  <br />
                  Para los casos de factoring, cargue los archivos PDF y XML.
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
    </ContentComponent>
  );
};
