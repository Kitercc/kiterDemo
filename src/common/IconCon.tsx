import React, { memo, CSSProperties, useEffect, useState } from 'react'
import IconUtils from './util/IconUtil'

type Props = {
  oldFamily?: string
  className?: string
  style?: CSSProperties
  iconValue?: IconValueType
  onClick?: React.MouseEventHandler<HTMLElement>
}

const IconCon = memo(function IconCon(props: Props) {
  const { className = '', style, iconValue = '', oldFamily = 'lcz-system-icon', onClick } = props

  const [fontFamily, setFontFamily] = useState('')

  useEffect(() => {
    ;(async function () {
      if (typeof iconValue !== 'string') {
        const iconData = await IconUtils.getURLFile(iconValue)
        iconData && setFontFamily(iconData.family)
      }
    })()
  }, [JSON.stringify(iconValue)])

  let Con = <></>

  if (typeof iconValue === 'string') {
    Con = (
      <i
        className={`${className} ${oldFamily}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: iconValue.split('|')[0] }}
        onClick={onClick}
      />
    )
  } else {
    const _iconValue = iconValue.iconValue

    Con = (
      <i
        className={`${className} ${fontFamily}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: _iconValue }}
        onClick={onClick}
      />
    )
  }

  return Con
})

export default IconCon
