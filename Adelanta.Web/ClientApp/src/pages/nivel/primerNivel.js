import { PageHeader } from "antd";
import { ContentComponent } from "../../components/layout/content";

export const PrimerNivelPage = () => {
	return (
		<ContentComponent>
			<PageHeader
				backIcon={null}
				className="site-page-header"
				onBack={() => null}
				title="Primer Nivel"
			/>
			<h1>Primer Nivel</h1>
		</ContentComponent>
	);
};
