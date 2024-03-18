import React, { memo, useCallback, useMemo, useState } from 'react'
import { Button, Space, message } from 'antd'
import useLockFn from '@/Hooks/useLockFn'

function getCount(count: number) {
  console.log('function-----执行昂贵的计算')
  console.time('计算耗时')
  let result = 0
  for (let i = 0; i < count * 100000000; i++) {
    result += 1
  }
  console.timeEnd('计算耗时')
  return result
}

const DemoComponent = (data: any) => {
  const { number } = data
  const [count, setCount] = useState<number>(0)
  console.log('DemoComponent render---------------------------------------')

  // const expensiveCalculation = getCount(count)

  const expensiveCalculation = useMemo(() => {
    console.log('useMemo-----执行昂贵的计算')
    console.time('计算耗时')
    let result = 0
    for (let i = 0; i < count * 100000000; i++) {
      result += 1
    }
    console.timeEnd('计算耗时')
    return result
  }, [count])

  const memoTest = useMemo(() => {
    console.log('memo缓存')
    return ''
  }, [])

  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <p> Count :{count}</p>
      <p> Expensive Calculation:{expensiveCalculation}</p>
      <Space>
        <Button type='primary' onClick={() => setCount(pre => pre + 1)}>
          Increment
        </Button>
        <Button type='primary' onClick={() => setCount(pre => pre - 1)}>
          dec
        </Button>
      </Space>
    </div>
  )
}

function MemoApp() {
  const [number, setNumber] = useState<number>(0)

  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <Space style={{ paddingBottom: 10 }}>
        <Button type='primary' onClick={() => setNumber(pre => pre + 1)}>
          Increment++
        </Button>
        {number}
      </Space>
      <DemoComponent />
    </div>
  )
}

////////////////////////////////////////////////////////////////

const CallBackApp = () => {
  let [count, setCount] = useState(0)
  let [number, setNumber] = useState(0)
  let [flag, setFlag] = useState(true)

  const countAdd = useCallback(() => {
    setCount(count + 1)
  }, [count])

  const numberAdd = () => {
    setNumber(v => v + 1)
  }
  return (
    <>
      <div>数字number:{number}</div>
      <div>数字count:{count}</div>
      <TestButton onClick={numberAdd}>普通count++</TestButton>
      <TestButton onClick={countAdd}>useCallback-number++</TestButton>
      <Button style={{ marginLeft: 10 }} type='primary' onClick={() => setFlag(v => !v)}>
        切换{JSON.stringify(flag)}
      </Button>
    </>
  )
}

const TestButton = ({ children, onClick = () => {} }: any) => {
  console.log(children, 'Render')
  return (
    <Button type='primary' onClick={onClick} style={{ marginRight: 10 }}>
      {children}
    </Button>
  )
}

////////////////////////////////////////////////////////////////////////
const mockRequest = (count: number) => {
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(`执行完成, 当前为：${count + 1}`)
    }, 2000)
  })
}

const HooksApp = () => {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const click = useLockFn(async () => {
    setLoading(true)
    message.success('开始执行')
    const res = await mockRequest(count)
    setLoading(false)
    message.success(res)
    setCount(v => v + 1)
  })

  return (
    <>
      <div>数字：{count}</div>
      <Button loading={loading} type='primary' onClick={() => click()}>
        竞态锁: 点击 + 1
      </Button>
    </>
  )
}

export default MemoApp
