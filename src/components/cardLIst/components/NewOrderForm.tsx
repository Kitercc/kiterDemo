import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'
import { TableDataProps } from '../type'

const { Option } = Select

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

  const validatePsw = () => {}
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
          rules={
            [
              // {
              //   required: true,
              //   message: '请输入商品ID',
              //   pattern: /^[0-9a-zA-Z]{8}$/
              // }
            ]
          }>
          <Input placeholder='请输入商品ID' />
        </Form.Item>
        <Form.Item
          name='type'
          label='订单类型'
          rules={
            [
              // { required: true, message: '请选择订单类型' }
            ]
          }>
          <Select>
            <Option value='普通现货'>普通现货</Option>
            <Option value='品牌现货'>品牌现货</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='price'
          label='价格'
          rules={
            [
              // {
              //   required: true,
              //   message: '请输入价格'
              // },
              // ({ getFieldValue }) => ({
              //   validator(_, value) {
              //     if (!value || (getFieldValue('price') >= 0 && getFieldValue('price') <= 999999)) {
              //       return Promise.resolve()
              //     }
              //     return Promise.reject(new Error('请输入0-9999999区间的价格!'))
              //   }
              // })
            ]
          }>
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

export default NewOrderForm
