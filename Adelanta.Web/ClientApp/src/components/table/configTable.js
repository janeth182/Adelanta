import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const handleSearch = (selectedKeys, confirm, dataIndex) => {
	confirm();
	// setSearchText(selectedKeys[0]);
	// setSearchColumn(dataIndex);
};

const handleReset = (clearFilters) => {
	clearFilters();
	// setSearchText("");
};

export const getColumnSearchProps = (dataIndex) => ({
	filterDropdown: ({
		setSelectedKeys,
		selectedKeys,
		confirm,
		clearFilters,
	}) => (
		<div style={{ padding: 8 }}>
			<Input
				placeholder={`Search ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={(e) =>
					setSelectedKeys(e.target.value ? [e.target.value] : [])
				}
				onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
				style={{ marginBottom: 8, display: "block" }}
			/>
			<Space>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90 }}
				>
					Search
				</Button>
				<Button
					onClick={() => handleReset(clearFilters)}
					size="small"
					style={{ width: 90 }}
				>
					Reset
				</Button>
			</Space>
		</div>
	),
	filterIcon: (filtered) => (
		<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
	),
	onFilter: (value, record) =>
		record[dataIndex]
			? record[dataIndex]
					.toString()
					.toLowerCase()
					.includes(value.toLowerCase())
			: "",
	// render: () => {
	// 	return (
	// 		<Input
	// 			placeholder={`Search ${dataIndex}`}
	// 			// value={selectedKeys[0]}
	// 			// onChange={(e) =>
	// 			// 	setSelectedKeys(e.target.value ? [e.target.value] : [])
	// 			// }
	// 			// onPressEnter={() =>
	// 			// 	handleSearch(selectedKeys, confirm, dataIndex)
	// 			// }
	// 			style={{ marginBottom: 8, display: "block" }}
	// 		/>
	// 	);
	// },
});
