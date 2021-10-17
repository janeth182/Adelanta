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
					{/* <Breadcrumb style={{ margin: "16px 0" }}>
						<Breadcrumb.Item>User</Breadcrumb.Item>
						<Breadcrumb.Item>Bill</Breadcrumb.Item>
					</Breadcrumb> */}
					{/* <div
						className="site-layout-background"
						style={{ padding: 24, minHeight: 360 }}
					> */}
					{children}
					{/* </div> */}
				</Content>
			</Layout>
		</Layout>
	);
};
