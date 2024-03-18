import { Button, Form, Input, Modal, Select, Table } from 'antd'
import React, { memo, useState } from 'react'
const { Option } = Select
interface TableDataProps {
  goodId: string // 商品id
  type: string // 订单类型
  orderId: string // 订单id
  price: string // 订单价格
  status: string // 订单状态
  deliveryInfo: string // 物流信息
  createdAt: string // 创建时间
  refundDeliveryId: string // 退货运单号
  refundReason: string // 退货理由
}

const cardData: TableDataProps[] = [
  {
    goodId: '8u63d2fx', // 商品id
    type: '普通现货', // 订单类型
    orderId: '110128372912', // 订单id
    price: '150.00', // 订单价格
    status: '退货', // 订单状态
    deliveryInfo: '浙江省杭州市余杭区', // 物流信息
    createdAt: '2021-11-27 10:23:54', // 创建时间
    refundDeliveryId: '8dxks1', // 退货运单号
    refundReason: '7天无理由退货' // 退货理由
  },
  {
    goodId: '8fjsws82',
    type: '普通现货',
    orderId: '110128372912',
    price: '200.00',
    status: '待支付',
    deliveryInfo: '浙江省杭州市余杭区',
    createdAt: '2021-11-28 09:13:22',
    refundDeliveryId: '',
    refundReason: ''
  },
  {
    goodId: '8jgu32js',
    type: '品牌现货',
    orderId: '110128372912',
    price: '150.00',
    status: '待支付',
    deliveryInfo: '浙江省杭州市余杭区',
    createdAt: '2021-11-28 11:41:24',
    refundDeliveryId: '',
    refundReason: ''
  },
  {
    goodId: '8uk6dzfx',
    type: '品牌现货',
    orderId: '110128372912',
    price: '100.00',
    status: '待支付',
    deliveryInfo: '浙江省杭州市余杭区',
    createdAt: '2021-11-28 10:23:54',
    refundDeliveryId: '',
    refundReason: ''
  }
]

interface NewOrderFormProps {
  visible: boolean
  onClose: (data: TableDataProps | null) => void
}

function getCurrentFormattedTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return formattedTime
}

function generateRandomOrderId(length: number): string {
  const characters = '0123456789'
  let randomOrderId = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomOrderId += characters.charAt(randomIndex)
  }

  return randomOrderId
}

//表单jsx
const NewOrderForm: React.FC<NewOrderFormProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm()
  const _status = Form.useWatch('status', form)

  const onFinish = (values: any) => {
    const listData = {
      createdAt: getCurrentFormattedTime(),
      deliveryInfo: '浙江省杭州市余杭区',
      orderId: generateRandomOrderId(12),
      refundDeliveryId: undefined,
      refundReason: undefined,
      ...values
    }

    onClose(listData)
  }

  return (
    <Modal
      title='新建订单'
      open={visible}
      onCancel={() => onClose(null)}
      footer={[
        <Button key='cancel' onClick={() => onClose(null)}>
          取消
        </Button>,
        <Button key='submit' type='primary' onClick={form.submit}>
          提交
        </Button>
      ]}>
      <Form
        form={form}
        name='newOrderForm'
        onFinish={onFinish}
        initialValues={{
          type: '普通现货',
          status: '待发货'
        }}>
        <Form.Item
          name='goodId'
          label='商品ID'
          rules={[
            {
              required: true,
              message: '请输入商品ID',
              pattern: /^[0-9a-zA-Z]{8}$/
            }
          ]}>
          <Input placeholder='请输入商品ID' />
        </Form.Item>
        <Form.Item name='type' label='订单类型' rules={[{ required: true, message: '请选择订单类型' }]}>
          <Select>
            <Option value='普通现货'>普通现货</Option>
            <Option value='品牌现货'>品牌现货</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='price'
          label='价格'
          rules={[
            {
              required: true,
              message: '请输入价格'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || (getFieldValue('price') >= 0 && getFieldValue('price') <= 999999)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('请输入0-9999999区间的价格!'))
              }
            })
          ]}>
          <Input type='number' placeholder='请输入价格' />
        </Form.Item>
        <Form.Item name='status' label='订单状态' rules={[{ required: true, message: '请选择订单状态' }]}>
          <Select>
            <Option value='待发货'>待发货</Option>
            <Option value='待支付'>待支付</Option>
            <Option value='退货'>退货</Option>
          </Select>
        </Form.Item>
        {_status === '退货' && (
          <>
            <Form.Item name='refundDeliveryId' label='退货运单号'>
              <Input placeholder='请输入退货运单号' />
            </Form.Item>
            <Form.Item name='refundReason' label='退货理由'>
              <Input placeholder='请输入退货理由' />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

const CardList = memo(() => {
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
})

export default CardList
