// import { useState, useEffect } from "react";
import { PageHeader /* Row, Col, Card, Table, Pagination */ } from "antd";
import { ContentComponent } from "../../components/layout/content";
// import { getColumnSearchProps } from "../../components/table/configTable";
// import { listarPostService } from "../../services/postService";

// const columns = [
// 	{
// 		title: "Nombre",
// 		dataIndex: "title",
// 		...getColumnSearchProps("title"),
// 	},
// 	{
// 		title: "Descripción",
// 		dataIndex: "body",
// 		...getColumnSearchProps("body"),
// 	},
// ];

export const ListarPostPage = () => {
	/* 	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [dataPost, setDataPost] = useState([]);
	const [loadingApi, setLoadingApi] = useState(false);

	useEffect(() => {
		let suscribe = true;
		(async () => {
			setLoadingApi(true);
			try {
				const rpta = await listarPostService();

				if (rpta.status === 200) {
					if (suscribe) {
						handleFormatColumns(rpta.data.data);
						setLoadingApi(false);
					}
				}
			} catch (error) {
				setLoadingApi(false);
				console.log(error.response);
			}
		})();

		return () => {
			suscribe = false;
		};
	}, []);

	const handleFormatColumns = (dataArray = []) => {
		console.log(dataArray);

		const data = dataArray.reduce((ac, el) => {
			ac.push({
				...el,
				key: el.id,
			});
			return ac;
		}, []);
		setDataPost(data);
	}; */

	return (
		<ContentComponent>
			<PageHeader
				backIcon={null}
				className="site-page-header"
				onBack={() => null}
				title="Mantenedor de Post"
			/>
			{/* <Row>
				<Col span={24}>
					<Card title="Listar Post">
						<Table
							loading={loadingApi}
							columns={columns}
							dataSource={dataPost}
							size="middle"
							pagination={{
								hideOnSinglePage: true,
							}}
						/>
						<Pagination
							defaultCurrent={1}
							total={5000}
							current={page}
							onChange={(page) => {
								setPage(page);
							}}
						/>
					</Card>
				</Col>
			</Row> */}
		</ContentComponent>
	);
};
