import React, { useState } from 'react'
import { Table, Select, Button } from 'antd'
import NewOrderForm from './NewOrderForm'
import cardData from '../accest/data'
import { TableDataProps } from '../type'

const { Option } = Select

const OrderListPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [tableData, setTableData] = useState<TableDataProps[]>(cardData)
  const columns = [
    {
      title: '商品ID',
      dataIndex: 'goodId',
      key: 'goodId'
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '物流信息',
      dataIndex: 'deliveryInfo',
      key: 'deliveryInfo'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    }
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: () => (
    //     <Button type='link' onClick={() => setShowNewOrderModal(true)}>
    //       新建订单
    //     </Button>
    //   )
    // }
  ]

  const handleStatusChange = (value: string | null) => {
    setFilterStatus(value)
    setTableData(value ? cardData.filter(item => item.status === value) : cardData)
  }

  const onModelClose = (data: TableDataProps | null) => {
    setShowNewOrderModal(false)
    if (data) {
      setTableData(value => [...value, data])
    }
  }
  return (
    <div>
      <h1>订单列表页</h1>
      <Button type='primary' onClick={() => handleStatusChange(null)} style={{ marginRight: 16 }}>
        清除筛选
      </Button>
      <Select
        style={{ width: 200, marginRight: 16 }}
        placeholder='按订单状态筛选'
        onChange={handleStatusChange}
        value={filterStatus}>
        <Option value='待发货'>待发货</Option>
        <Option value='待支付'>待支付</Option>
        <Option value='退货'>退货</Option>
      </Select>
      <Button style={{ width: 200, marginRight: 16 }} type='primary' onClick={() => setShowNewOrderModal(true)}>
        新建订单
      </Button>

      <Table style={{ marginTop: 16 }} rowKey='goodId' dataSource={tableData} columns={columns} />

      {showNewOrderModal && <NewOrderForm visible={showNewOrderModal} onClose={onModelClose} />}
    </div>
  )
}

export default OrderListPage
