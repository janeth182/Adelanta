// import "../../App.css";
import { Layout /* Breadcrumb  */ } from "antd";
import { useContext } from "react/cjs/react.development";
import { HeaderComponent } from "./header";
import { SideBarComponent } from "./sidebar";
import { LayoutContext } from "../../context/layoutProvider";

const { Content } = Layout;

export const ContentComponent = ({ children }) => {
	const { isSideBar, isMobil } = useContext(LayoutContext);
	return (
		<Layout>
			<SideBarComponent />
			<Layout
				className="site-layout"
				style={{ marginLeft: isMobil ? 80 : isSideBar === true ? 80 : 256 }}
			>
				<HeaderComponent />
				<Content
					style={{
						margin: "24px 16px 0",
						overflow: "initial",
						paddingTop: 40,
						paddingBottom: 60,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};
