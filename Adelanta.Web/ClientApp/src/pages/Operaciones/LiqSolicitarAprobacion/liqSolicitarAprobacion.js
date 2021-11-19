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
import { listarDocumentos } from "../../../services/documentoService";
import moment from "moment";
export const LiqSolicitarAprobacionPage = () => {
  const { isModal, showModal, hiddenModal } = useModal();
  const { isMessage, addMessage, messageInfo } = useMessageApi();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const history = useHistory();
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  const columns = [
    {
      title: "Liquidación",
      dataIndex: "pagador",
      ...getColumnSearchProps("pagador"),
      render: (_, record) => {
        return (
          <a type="primary" onClick={showModal}>
            {record.idSolicitud}
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
      title: "Conf. Pagador",
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

  useEffect(() => {
    let suscribe = true;
    (async () => {
      setLoadingApi(true);
      try {
        const rpta = await listarDocumentos(2);
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
  const confirm = async () => {
    message.success("Se proceso correctamente.");
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
            title="Liquidacones Solicitar Aprobación"
            actions={[]}
            extra={
              <>
                <Space>
                  <Button
                    className="primary-b"
                    type="primary"
                    icon={<SendOutlined style={{ fontSize: "16px" }} />}
                    onClick={confirm}
                  >
                    Aprobación Cliente
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
    </ContentComponent>
  );
};
