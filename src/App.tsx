import React, { Profiler, useState } from 'react'
import './style/app.less'
import Demo from './test/Demo'
import KeepAlive from './test/KeepAlive'
import Main from './components/main'
import T_3DMap from './components/threeWebgl'
import VirtualizedCom from './components/virtualized'
import CardList from './components/cardLIst'
import OrderListPage from './components/cardLIst/components/OrderListPage'
import MaxList from './components/maxList'
import MyComp from './components/number'
import { set } from 'lodash'
import Demo1 from './components/ThreeFiber/Demo1'
import ThreeDemo1 from './components/ThreeNative/ThreeDemo1'

function App() {
  return <ThreeDemo1 />
}
export default App
