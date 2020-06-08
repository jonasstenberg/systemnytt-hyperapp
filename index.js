import { app } from 'hyperapp'

import state from './state'
import actions from './actions'
import App from './components/App'

const devtools = process.env.NODE_ENV !== 'production'
  ? require('hyperapp-redux-devtools')
  : null

require('@babel/polyfill')

let main
if (devtools) {
  main = devtools(app)
} else {
  main = app
}

main(
  state,
  actions,
  App,
  document.getElementById('app')
)
