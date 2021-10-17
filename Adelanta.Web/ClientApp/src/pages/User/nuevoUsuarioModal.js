import { Switch, Form, Select, Row, Col, Button, Radio } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputComponent } from "../../components/formControl.js/input";
import { SelectComponent } from "../../components/formControl.js/select";

const { Option } = Select;

export const NuevoUsuarioModalComponent = () => {
	const formik = useFormik({
		initialValues: {
			nombre: "",
			edad: "",
			direccion: "",
			sexo: "",
			estado: true,
			civil: "Soltero",
		},
		validationSchema: Yup.object().shape({
			nombre: Yup.string().required("El campo es requerido"),
			edad: Yup.string().required("El campo es requerido"),
			direccion: Yup.string().required("El campo es requerido"),
			sexo: Yup.string().required("El campo es requerido"),
			estado: Yup.boolean(),
			civil: Yup.string(),
		}),
		onSubmit: (value) => {
			console.log(value);
		},
	});

	return (
		<Form layout="vertical">
			<Row gutter={16}>
				<Col span={12}>
					<InputComponent
						name="nombre"
						value={formik.values.nombre}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						error={formik.errors.nombre}
						touched={formik.touched.nombre}
						title="Nombre"
					/>
				</Col>
				<Col span={12}>
					<InputComponent
						name="edad"
						value={formik.values.edad}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						error={formik.errors.edad}
						touched={formik.touched.edad}
						title="Edad"
					/>
				</Col>
			</Row>
			<InputComponent
				name="direccion"
				value={formik.values.direccion}
				onBlur={formik.handleBlur}
				onChange={formik.handleChange}
				error={formik.errors.direccion}
				touched={formik.touched.direccion}
				title="Direccion"
			/>
			<Row gutter={16}>
				<Col span={12}>
					<SelectComponent
						name="sexo"
						value={formik.values.sexo}
						onBlur={formik.handleBlur}
						onChange={(e) => {
							formik.setFieldValue("sexo", e);
						}}
						error={formik.errors.sexo}
						touched={formik.touched.sexo}
						title="Sexo"
					>
						<Option value="male">Masculino</Option>
						<Option value="female">Femenino</Option>
					</SelectComponent>
				</Col>
				<Col span={12}>
					<Form.Item label="Estado:" valuePropName="checked">
						<Switch
							name="estado"
							checked={formik.values.estado}
							value={formik.values.estado}
							onBlur={formik.handleBlur}
							onChange={(e) => {
								formik.setFieldValue("estado", e);
							}}
						/>
					</Form.Item>
				</Col>
				<Radio.Group
					onChange={(e) => {
						console.log(e);
						formik.setFieldValue("civil", e.target.value);
					}}
					value={formik.values.civil}
				>
					<Radio value="1">Casado</Radio>
					<Radio value="2">Soltero</Radio>
					<Radio value="3">Divoriciado</Radio>
					<Radio value="4">Viudo</Radio>
				</Radio.Group>
				<Button onClick={formik.handleSubmit}>Guardar</Button>
			</Row>
		</Form>
	);
};
