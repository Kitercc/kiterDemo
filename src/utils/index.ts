export const routerList = [
  {
    id: 'home',
    path: '/home'
  },
  {
    id: 'detail',
    path: '/detail'
  },
  {
    id: 'demo',
    path: '/demo'
  },
  {
    id: 'about',
    path: '/about'
  }
]

export const getMaxList = (len: number): { index: number; name: string }[] => {
  const arr = new Array(len).fill(null).map((_, i) => ({
    index: i,
    name: `我是${i}`
  }))
  return arr
}
