import { Table } from 'antd';
import React, { useState } from 'react'
import  { Excel } from 'antd-table-saveas-excel'
import { useMemo } from 'react';

const TableComponent = (props) => {
    const {selectionType = 'checkbox', data: dataSource=[], columns = [], handleDeleteMany} = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])

    const newColumnExport = useMemo(() => {
      const arr = columns?.filter((col) => col.dataIndex !== 'action')
      return arr
    }, [columns])

      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   name: record.name,
        // }),
      };

      const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
      }

      const exportExcel = () => {
        const excel = new Excel();

        excel
          .addSheet("test")
          .addColumns(newColumnExport)
          .addDataSource(dataSource, {
            str2Percent: true
          })
          .saveAs("Excel.xlsx");
      };


  return (
    <div>
      {rowSelectedKeys.length > 0 && (
        <div style={{
          background: '#1d1ddd',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      
      <button onClick={exportExcel}>Export Excel</button>
        <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </div>
    
  )
}

export default TableComponent