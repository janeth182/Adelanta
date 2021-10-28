import { useContext, useEffect } from "react";
import { ContentComponent } from "../components/layout/content";
import { AuthContext } from "../context/authProvider";
import { Card, Col, Row, PageHeader } from 'antd';
export const HomePage = () => {
	const { user } = useContext(AuthContext);
	useEffect(() => {
		if(!user) return;		
	}, [user]);
	return (
		<ContentComponent>						
			<div className="site-card-wrapper">
				<Row gutter={16}>
					<Col span={12}>
						<Card title="¿Quiénes somos?" bordered={false}>
						<ul>
							<li>Adelanta Factoring es una empresa que brinda liquidez a la micro, pequeña y mediana empresa a través del factoring.</li>
							<li>Nuestro equipo humano cuenta con más de 20 años de experiencia en el sector financiero.</li>
							<li>Contamos con el aval de estar registrados en la Superintendencia de Banca y Seguros (SBS).</li>
						</ul>
						</Card>
					</Col>
					<Col span={12}>
						<Card title="¿Qué ofrecemos?" bordered={false}>
						<ul>
							<li><strong>Liquidez inmediata </strong>con precios altamente competitivos: hasta <span>98% de financiamiento</span>.</li>
							<li><strong>Asumimos la gestión de cobranza&nbsp;</strong>para que no descuides las responsabilidades de tu empresa.</li>
							<li><strong>El adelanto de facturas no se registra como deuda en el sistema financiero</strong>, para que el historial crediticio de tu empresa no se vea afectado.</li>
						</ul>
						</Card>
					</Col>
				</Row>
			</div>
		</ContentComponent>
	);
};
