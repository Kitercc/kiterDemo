import { makeAutoObservable, runInAction, autorun, toJS, reaction } from 'mobx'
class Counter {
  counter = 0

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  increment() {
    this.counter++
  }

  decrement() {
    this.counter--
  }

  reset() {
    this.counter = 0
  }
}

const counter = new Counter()
reaction(
  () => counter.counter,
  (data, reaction) => {
    console.log(data, reaction)
  }
)
autorun(() => {
  console.log('counter.counter', counter.counter)
})

export default counter
