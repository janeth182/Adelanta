import { PageHeader } from "antd";
import { ContentComponent } from "../../components/layout/content";

export const SegundoNivelPage = () => {
	return (
		<ContentComponent>
			<PageHeader
				backIcon={null}
				className="site-page-header"
				onBack={() => null}
				title="Segundo Nivel"
			/>
			<h1>Segundo Nivel</h1>
		</ContentComponent>
	);
};
