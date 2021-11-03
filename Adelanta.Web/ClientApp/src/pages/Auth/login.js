import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authProvider";
import { login } from "../../services/loginService";
import publicIp  from "public-ip";
const { Title } = Typography;

export const LoginPage = () => {
	const { loginUser } = useContext(AuthContext);
	const [form] = Form.useForm();
	const history = useHistory();
	const [loadingApi, setLoadingApi] = useState(false);
	const { REACT_APP_RUTA_SERVIDOR } = process.env;
	const onFinish = (values) => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				let rpta = '';
				rpta = await login(values.usuario, values.password, await publicIp.v4());
				if (rpta.status === 200) {
					if (suscribe){
						if(rpta.data.error === 0){
							values.token = rpta.data.gSesion;
							values.id = rpta.data.idUsuario;
							console.log(values);
							loginUser(values);
							history.push(REACT_APP_RUTA_SERVIDOR);							
						} else {
							message.error(rpta.data.mensaje);
						}			
						setLoadingApi(false);
					}
				} else {
					setLoadingApi(false);
					message.error('Ocurrio un error al momento de procesar la solicitud.');
				}
			} catch (error) {
				setLoadingApi(false);
				message.error('Ocurrio un error al momento de procesar la solicitud.');
			}
		})();

		return () => {
			suscribe = false;
		};	
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "grid",
				placeContent: "center",
			}}
		>
			<Title level={3} className="title__login">
				Bienvenido
			</Title>
			<Form
				form={form}
				name="normal_login"
				style={{ width: 350 }}
				className="login-form"
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				autoComplete="off"
			>
				<Form.Item
					name="usuario"
					rules={[
						{
							required: true,
							message: "Ingrese su usuario",
						},
					]}
				>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Correo Electrónico"
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: "Ingrese su contraseña",
						},
					]}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Password"
					/>
				</Form.Item>
				<Form.Item>
					<Form.Item name="remember" valuePropName="checked" noStyle>
						<Checkbox>Recordar contraseña</Checkbox>
					</Form.Item>

					<Link className="login-form-forgot" to="/">
						¿Olvidaste tu contraseña?
					</Link>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="button__login"
						loading={loadingApi}
					>
						Ingresar
					</Button>
				</Form.Item>				
			</Form>
		</div>
	);
};
