import React from 'react'
import { useState } from 'react'

const FixedSizeList = (props: any) => {
  const { height, width, itemSize, itemCount, children: Child } = props
  // 记录滚动掉的高度
  const [scrollOffset, setScrollOffset] = useState(0)

  // 外部容器高度
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    overflow: 'auto'
  }

  // 1000个元素撑起盒子的实际高度
  const contentStyle = {
    height: itemSize * itemCount,
    width: '100%'
  }

  const getCurrentChildren = () => {
    // 可视区起始索引
    const startIndex = Math.floor(scrollOffset / itemSize)
    // 上缓冲区起始索引
    const finialStartIndex = Math.max(0, startIndex - 2)
    // 可视区能展示的元素的最大个数
    const numVisible = Math.ceil(height / itemSize)
    // 下缓冲区结束索引
    const endIndex = Math.min(itemCount, startIndex + numVisible + 2)
    const items = []
    // 根据上面计算的索引值，不断添加元素给container
    for (let i = finialStartIndex; i < endIndex; i++) {
      const itemStyle = {
        position: 'absolute',
        height: itemSize,
        width: '100%',
        // 计算每个元素在container中的top值
        top: itemSize * i
      }
      items.push(<Child key={i} index={i} style={itemStyle} />)
    }
    console.log(222)

    return items
  }

  // 当触发滚动就重新计算
  const scrollHandle = (event: any) => {
    const { scrollTop } = event.currentTarget
    setScrollOffset(scrollTop)
  }

  return (
    <div className='aa' style={containerStyle} onScroll={scrollHandle}>
      <div className='bb' style={contentStyle}>
        {getCurrentChildren()}
      </div>
    </div>
  )
}

export default FixedSizeList
