import React, { memo, useEffect, useRef, useState } from 'react'
import CreateThreeMap from './common/creatChinaMap'

const T_3DMap = memo(() => {
  const wrapper = useRef<HTMLDivElement>(null),
    mapTipRef = useRef<any>(null),
    [threeMap, setThreeMap] = useState<CreateThreeMap | null>(null),
    currentMap = useRef<CreateThreeMap | null>(null),
    [load, setLoad] = useState<boolean>(false),
    firstLoad = useRef<boolean>(true)

  useEffect(() => {
    if (wrapper.current) {
      const map = new CreateThreeMap({
        el: wrapper.current
      })
      setThreeMap(map)
      currentMap.current = map
      firstLoad.current = false
    } else {
      setThreeMap(null)
      // currentMap.current?.destroy();
      currentMap.current = null
    }
    return () => {
      setThreeMap(null)
      // currentMap.current?.destroy();
      currentMap.current = null
    }
  }, [])

  return <div ref={wrapper} className='lcz-3d-area-map' />
})

export default T_3DMap
