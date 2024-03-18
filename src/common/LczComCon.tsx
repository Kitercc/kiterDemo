import React, { forwardRef } from 'react'
import ErrorBoundary from './ErrorBoundary'

const LczComCon = forwardRef((props: any, ref: any) => {
  const { children, className = '', style = {}, ...otherProps } = props
  return (
    <div className={'lcz-com-con ' + className} style={style} ref={ref} {...otherProps}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  )
})
LczComCon.displayName = 'LczComCon'
export default LczComCon
