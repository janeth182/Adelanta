import { useContext } from "react";
import { Layout } from "antd";
import { MenuComponent } from "../menu/menu";
import { LayoutContext } from "../../context/layoutProvider";

import Logo from "../../images/google.jpg";

const { Sider } = Layout;

export const SideBarComponent = () => {
	const { isSideBar, isMobil } = useContext(LayoutContext);

	return (
		<Sider
			collapsed={isMobil ? true : isSideBar}
			width={isMobil ? 80 : 256}
			style={{
				overflow: "auto",
				height: "100vh",
				position: "fixed",
				left: 0,
			}}
		>
			<div className="logo">
				<img src={Logo} alt="Logo" />
			</div>
			<MenuComponent />
		</Sider>
	);
};
