export interface TableDataProps {
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

type FuncStruct = (...args: any[]) => any

type FunctionKeys<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never
}[keyof T]

type Tmp<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never
}

type Res = Tmp<{
  foo: () => void
  bar: () => number
  baz: number
}>

type ResEqual = {
  foo: 'foo'
  bar: 'bar'
  baz: never
}

export {}
