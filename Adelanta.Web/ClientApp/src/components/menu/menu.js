import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu } from "antd";
import { HomeOutlined, UserOutlined, FileAddOutlined, FieldTimeOutlined  } from "@ant-design/icons";
import { useContext } from "react";
import { LayoutContext } from "antd/lib/layout/layout";
import { listarMenu } from "../../services/menuService";

const { SubMenu } = Menu;
let rutas = [];
export const MenuComponent = () => {
	const location = useLocation();
	const { isMobil } = useContext(LayoutContext);
	const [openKeys, setOpenKeys] = useState([""]);	
	useEffect(() => {
		let suscribe = true;
		(async () => {			
			try {
				const rutaServidor = process.env.REACT_APP_RUTA_SERVIDOR;
				const rpta = await listarMenu();
				const menu = [];
				if (rpta.status === 200) {
					if (suscribe) {
						console.log(JSON.stringify(rpta))
						rpta.data.forEach(item => {
							if(item.idMenuPadre == '0'){
								const subMenu = []; 
								rpta.data.forEach( hijo => {
									if(item.idMenu === hijo.idMenuPadre){
										subMenu.push({
											id: `${rutaServidor}${hijo.rutaPagina}`,
											title: hijo.menu,
											ruta: `${rutaServidor}${hijo.rutaPagina}`,											
											icon: "",
										})
									}
								});							
								if(subMenu.length === 0){
									menu.push({
										id: `${rutaServidor}${item.rutaPagina}`,
										type: subMenu.length === 0 ? 'menu':'submenu',
										title: item.menu,
										ruta : `${rutaServidor}${item.rutaPagina}`,
										icon: 'home',
										rutas: [
											...subMenu							
										],																								
									});
								} else {
									menu.push({
										id: `${rutaServidor}${item.rutaPagina}`,
										type: subMenu.length === 0 ? 'menu':'submenu',
										title: item.menu,
										icon: 'home',
										rutas: [
											...subMenu							
										],																								
									});
								}		
							}	
						});
						rutas = menu;
						let id = "";
						rutas.forEach((el) => {
							if (el.type === "menu") {
								if (el.ruta === location.pathname) {
									id = el.id;
								}
							} else {
								el.rutas.forEach((r) => {
									if (r.ruta === location.pathname) {
										id = el.id;
									}
								});
							}
							setOpenKeys(id);
						});
					}
				}
			} catch (error) {				
				console.log(error.response);
			}
		})();
		return () => {
			suscribe = true;
		};
	}, [location.pathname]);

	const IconMenu = ({ value = "" }) => {
		switch (value) {
			case "home":
				return <FieldTimeOutlined />;
			case "user":
				return <UserOutlined spin={true}/>;
			case "add":
				return <FileAddOutlined />;
			default:
				return <HomeOutlined />;
		}
	};

	const onOpenChange = (keys) => {
		console.log("keys", keys);
		setOpenKeys(keys[1]);
	};

	return (
		<Menu
			theme="dark"
			onOpenChange={onOpenChange}
			onClick={(e) => {
				console.log("w", e);
				if (e.keyPath.length > 1) {
					setOpenKeys(e.keyPath[1]);
				} else {
					setOpenKeys(e.keyPath[0]);
				}
			}}
			openKeys={[openKeys]}
			defaultSelectedKeys={[location.pathname]}
			mode={isMobil === true ? "vertical" : "inline"}
		>
			{rutas.map((el) => {
				if (el.rutas.length === 0) {
					return (
						<Menu.Item key={el.id} icon={<IconMenu value={el.icon} />}>
							{el.title}
							<Link to={el.ruta} />
						</Menu.Item>
					);
				} else if (el.rutas.length > 0) {
					return (
						<SubMenu
							key={el.id}
							title={el.title}
							icon={<IconMenu value={el.icon} />}
						>
							{el.rutas.map(
								(r) =>
									r?.active !== false && (
										<Menu.Item key={r.id}>
											{r.title}
											<Link to={r.ruta} />
										</Menu.Item>
									)
							)}
						</SubMenu>
					);
				}
				return "";
			})}
		</Menu>
	);
};
