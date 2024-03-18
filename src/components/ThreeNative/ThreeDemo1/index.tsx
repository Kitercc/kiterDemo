import React, { memo, useEffect, useRef, useState } from 'react'
import CreateDemo1Three from './common/createDemo1Three'

const ThreeDemo1 = memo(() => {
  const wrapper = useRef<HTMLDivElement>(null),
    currentMap = useRef<CreateDemo1Three | null>(null)

  useEffect(() => {
    if (wrapper.current) {
      const map = new CreateDemo1Three({
        el: wrapper.current
      })
      currentMap.current = map
    }

    return () => {
      currentMap.current?.destroyed()
      currentMap.current = null
    }
  }, [])

  return <div ref={wrapper} />
})

export default ThreeDemo1
