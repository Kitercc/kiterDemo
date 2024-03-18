import React from 'react'
import FixedSizeList from './components/FixedSizeList'

const Row = ({ index, style, forwardRef }: any) => {
  return (
    <div className={index % 2 ? 'list-item-odd' : 'list-item-even'} style={style} ref={forwardRef}>
      {`Row ${index}`}
    </div>
  )
}

const VirtualizedCom = () => {
  return (
    <FixedSizeList className='list' height={800} width={200} itemSize={50} itemCount={1000}>
      {Row}
    </FixedSizeList>
  )
}

export default VirtualizedCom
