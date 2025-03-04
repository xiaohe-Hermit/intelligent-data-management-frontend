import React from "react";
import { Table, Button } from "antd";
import "./DataTable.css"

const DataTable = ({
    dataText,
    dataSource,
    columns,
    row_key,
    onClick
}) => {
    return (
        <div>
            <Button type="primary" onClick={onClick}>
                添加{dataText}
            </Button>
            <Table dataSource={dataSource}
                columns={columns}
                rowKey={row_key}
                className="dataTable" />
        </div>

    );
};
export default DataTable;