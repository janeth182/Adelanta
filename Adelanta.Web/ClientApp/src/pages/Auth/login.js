import { Form, Input, Button, Checkbox, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authProvider";

const { Title } = Typography;

export const LoginPage = () => {
	const { loginUser } = useContext(AuthContext);
	const [form] = Form.useForm();
	const history = useHistory();
	const [loadingApi, setLoadingApi] = useState(false);

	const onFinish = (values) => {
		setLoadingApi(true);
		setTimeout(() => {
			console.log(values);
			loginUser(values);
			history.push("/");
			setLoadingApi(false);
		}, 1000);
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
					name="email"
					rules={[
						{
							required: true,
							message: "Ingrese su email",
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
				<p>
					¿No tienes una cuenta? <Link to="/">Registrate !!</Link>
				</p>
			</Form>
		</div>
	);
};
