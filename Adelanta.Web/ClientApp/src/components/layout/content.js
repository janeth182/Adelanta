// import "../../App.css";
import { Layout /* Breadcrumb  */ } from "antd";
import { useContext } from "react/cjs/react.development";
import { HeaderComponent } from "./header";
import { SideBarComponent } from "./sidebar";
import { LayoutContext } from "../../context/layoutProvider";

const { Content, Footer } = Layout;

export const ContentComponent = ({ children }) => {
	const { isSideBar, isMobil } = useContext(LayoutContext);
	return (
		<Layout  >
			<SideBarComponent />
			<Layout
				className="site-layout"
				style={{ marginLeft: isMobil ? 80 : isSideBar === true ? 80 : 256 }}
			>
				<HeaderComponent />
				<Content
					className="site-layout-background"					
					style={{
						margin: "70px 16px 0",
						overflow: "initial",						
						background: '#f0f2f5'
					}}
				>
				{children}				
				</Content>
				<Footer style={{ textAlign: 'center' }}>©2021 Adelanta Factoring</Footer>
			</Layout>
		</Layout>
	);
};
