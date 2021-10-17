import React, { useContext } from "react";
import { Col, Layout, Row, Avatar } from "antd";
import {
	ArrowRightOutlined,
	ArrowLeftOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { LayoutContext } from "../../context/layoutProvider";
import { AuthContext } from "../../context/authProvider";

const { Header } = Layout;

export const HeaderComponent = () => {
	const { logoutUser, user } = useContext(AuthContext);
	const { isSideBar, toggleSidebar, isMobil } = useContext(LayoutContext);

	return (
		<Header
			className={`site-layout-background ${
				isMobil
					? "header-slider-colapse"
					: isSideBar
					? "header-slider-colapse"
					: "header-slider"
			}`}
			style={{
				padding: 0,
				position: "fixed",
				zIndex: 1,
				display: "block",
			}}
		>
			<Row>
				<Col span={12}>
					{!isMobil &&
						React.createElement(
							isSideBar ? ArrowRightOutlined : ArrowLeftOutlined,
							{
								className: "trigger",
								onClick: toggleSidebar,
							}
						)}
				</Col>
				<Col span={12}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginRight: 10,
							}}
						>
							<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
							<span style={{ marginLeft: 5 }}>{user.email}</span>
						</div>
						{React.createElement(LogoutOutlined, {
							className: "trigger",
							onClick: logoutUser,
						})}
					</div>
				</Col>
			</Row>
		</Header>
	);
};
